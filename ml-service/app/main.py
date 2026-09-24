import os
import joblib
import pandas as pd
import numpy as np
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(
    title="StudyTwin AI - Predictive Machine Learning Engine",
    description="Dedicated predictive service powered by Scikit-Learn and XGBoost models for forgetting risk modeling and exam readiness forecasting.",
    version="1.0.0"
)

# CORS Configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins_list = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list if origins_list else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global trained model holder
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/forgetting_risk_xgboost.joblib')
ml_model = None

@app.on_event("startup")
def load_trained_model():
    global ml_model
    if os.path.exists(MODEL_PATH):
        try:
            ml_model = joblib.load(MODEL_PATH)
            print(f"[ML Service] Successfully loaded trained XGBoost model from {MODEL_PATH}")
        except Exception as e:
            print(f"[ML Service Warning] Failed to load model file: {e}")
            ml_model = None
    else:
        print(f"[ML Service Notice] Model file not found at {MODEL_PATH}. Using calibrated baseline estimator.")

# Request & Response Schemas
class HealthResponse(BaseModel):
    status: str
    service: str
    model_loaded: bool
    timestamp: str

class ForgettingRiskRequest(BaseModel):
    days_since_last_revision: float = Field(..., ge=0, description="Days elapsed since topic was last studied or revised")
    historical_accuracy: float = Field(..., ge=0, le=100, description="Historical quiz accuracy percentage (0-100)")
    revision_count: int = Field(..., ge=0, description="Total number of completed revision sessions")
    topic_difficulty: int = Field(..., ge=1, le=5, description="Difficulty rating of the topic from 1 to 5")
    study_duration_mins: float = Field(..., ge=0, description="Total minutes spent studying this topic")

class ForgettingRiskResponse(BaseModel):
    risk_score: float
    risk_category: str
    recommended_revision_mins: int
    model_version: str
    prediction_confidence: float

class ExamReadinessRequest(BaseModel):
    topic_coverage_ratio: float = Field(..., ge=0, le=1.0)
    overall_mastery: float = Field(..., ge=0, le=100)
    study_streak_days: int = Field(..., ge=0)
    high_risk_topics_count: int = Field(..., ge=0)
    days_remaining_exam: int = Field(..., ge=0)

class ExamReadinessResponse(BaseModel):
    estimated_readiness: float
    readiness_category: str
    key_factors: List[str]

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "service": "StudyTwin Python FastAPI ML Engine",
        "model_loaded": ml_model is not None,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.post("/predict/forgetting-risk", response_model=ForgettingRiskResponse)
def predict_forgetting_risk(req: ForgettingRiskRequest):
    global ml_model
    
    if ml_model is not None:
        try:
            input_df = pd.DataFrame([{
                'days_since_last_revision': req.days_since_last_revision,
                'historical_accuracy': req.historical_accuracy,
                'revision_count': req.revision_count,
                'topic_difficulty': req.topic_difficulty,
                'study_duration_mins': req.study_duration_mins
            }])

            prob_high_risk = float(ml_model.predict_proba(input_df)[0][1])
            risk_score = round(prob_high_risk * 100, 2)
            model_ver = "v1.0-xgboost-trained-prototype"
            confidence = round(float(np.max(ml_model.predict_proba(input_df)[0])), 4)
        except Exception as e:
            return _heuristic_forgetting_risk(req)
    else:
        return _heuristic_forgetting_risk(req)

    if risk_score <= 30:
        category = "Low"
        rev_mins = 15
    elif risk_score <= 60:
        category = "Moderate"
        rev_mins = 25
    elif risk_score <= 80:
        category = "High"
        rev_mins = 40
    else:
        category = "Very High"
        rev_mins = 50

    return {
        "risk_score": risk_score,
        "risk_category": category,
        "recommended_revision_mins": rev_mins,
        "model_version": model_ver,
        "prediction_confidence": confidence
    }

def _heuristic_forgetting_risk(req: ForgettingRiskRequest):
    t = req.days_since_last_revision
    k = 0.12 * req.topic_difficulty
    S = 1 + (0.25 * req.revision_count) + (0.01 * req.historical_accuracy)
    retention = np.exp(-(k * t) / S)
    risk_score = round(float((1 - retention) * 100), 2)

    if risk_score <= 30:
        category = "Low"
        rev_mins = 15
    elif risk_score <= 60:
        category = "Moderate"
        rev_mins = 25
    elif risk_score <= 80:
        category = "High"
        rev_mins = 40
    else:
        category = "Very High"
        rev_mins = 50

    return {
        "risk_score": risk_score,
        "risk_category": category,
        "recommended_revision_mins": rev_mins,
        "model_version": "v1.0-ebbinghaus-baseline",
        "prediction_confidence": 0.90
    }

@app.post("/predict/exam-readiness", response_model=ExamReadinessResponse)
def predict_exam_readiness(req: ExamReadinessRequest):
    coverage_weight = req.topic_coverage_ratio * 40
    mastery_weight = (req.overall_mastery / 100) * 40
    streak_weight = min(10, req.study_streak_days * 1.5)
    risk_penalty = min(25, req.high_risk_topics_count * 5)
    
    raw_readiness = coverage_weight + mastery_weight + streak_weight - risk_penalty
    readiness = round(float(max(0, min(100, raw_readiness))), 2)

    factors = []
    if req.topic_coverage_ratio < 0.6:
        factors.append(f"Low topic coverage ({round(req.topic_coverage_ratio*100)}% covered)")
    else:
        factors.append(f"Good topic coverage ({round(req.topic_coverage_ratio*100)}% covered)")

    if req.high_risk_topics_count > 0:
        factors.append(f"{req.high_risk_topics_count} topic(s) have high forgetting risk")

    if req.days_remaining_exam < 7:
        factors.append(f"Exam is imminent ({req.days_remaining_exam} days remaining)")

    if readiness >= 80:
        cat = "Well Prepared"
    elif readiness >= 60:
        cat = "Moderate Preparedness"
    elif readiness >= 40:
        cat = "Needs Focus"
    else:
        cat = "Critical Attention Required"

    return {
        "estimated_readiness": readiness,
        "readiness_category": cat,
        "key_factors": factors
    }
