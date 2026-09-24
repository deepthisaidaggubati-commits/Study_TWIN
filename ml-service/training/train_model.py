"""
StudyTwin AI - ML Model Training Pipeline
Trains Random Forest and XGBoost classifiers on student learning features.
Reports Accuracy, Precision, Recall, F1, and ROC-AUC metrics.
"""
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBClassifier

from generate_dataset import generate_synthetic_data

def train_and_evaluate():
    print("=== Training StudyTwin AI Forgetting-Risk Prediction Models ===")
    
    # Generate / Load dataset
    df = generate_synthetic_data(num_samples=3000)
    
    features = [
        'days_since_last_revision',
        'historical_accuracy',
        'revision_count',
        'topic_difficulty',
        'study_duration_mins'
    ]
    X = df[features]
    y = df['high_risk_label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Dataset split: Train={len(X_train)} samples, Test={len(X_test)} samples.")

    # Model 1: Random Forest Classifier
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf_model.fit(X_train, y_train)

    rf_preds = rf_model.predict(X_test)
    rf_probs = rf_model.predict_proba(X_test)[:, 1]

    print("\n--- Model 1: Random Forest Evaluation ---")
    print(f"Accuracy  : {accuracy_score(y_test, rf_preds):.4f}")
    print(f"Precision : {precision_score(y_test, rf_preds):.4f}")
    print(f"Recall    : {recall_score(y_test, rf_preds):.4f}")
    print(f"F1 Score  : {f1_score(y_test, rf_preds):.4f}")
    print(f"ROC-AUC   : {roc_auc_score(y_test, rf_probs):.4f}")

    # Model 2: XGBoost Classifier
    xgb_model = XGBClassifier(n_estimators=80, max_depth=4, learning_rate=0.08, random_state=42)
    xgb_model.fit(X_train, y_train)

    xgb_preds = xgb_model.predict(X_test)
    xgb_probs = xgb_model.predict_proba(X_test)[:, 1]

    print("\n--- Model 2: XGBoost Evaluation ---")
    print(f"Accuracy  : {accuracy_score(y_test, xgb_preds):.4f}")
    print(f"Precision : {precision_score(y_test, xgb_preds):.4f}")
    print(f"Recall    : {recall_score(y_test, xgb_preds):.4f}")
    print(f"F1 Score  : {f1_score(y_test, xgb_preds):.4f}")
    print(f"ROC-AUC   : {roc_auc_score(y_test, xgb_probs):.4f}")

    # Save model artifact
    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, 'forgetting_risk_xgboost.joblib')
    
    joblib.dump(xgb_model, model_path)
    print(f"\n[Model Saved] Trained XGBoost model saved successfully to: {model_path}")

if __name__ == '__main__':
    train_and_evaluate()
