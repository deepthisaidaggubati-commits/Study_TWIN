# StudyTwin AI Machine Learning Methodology

## 1. Machine Learning Overview

The Python FastAPI Machine Learning service generates predictive insights for StudyTwin AI:

1. **Forgetting-Risk Classification & Regression**: Estimates probability of memory decay for a topic given:
   - Days since last revision (`days_since_last_revision`)
   - Historical quiz accuracy (`historical_accuracy`)
   - Revision count (`revision_count`)
   - Topic difficulty rating (`topic_difficulty`)
   - Total study duration (`study_duration_mins`)

2. **Exam Readiness Estimator**: Models expected exam performance based on subject coverage, mastery metrics, study streak, and high-risk topic penalties.

---

## 2. Dataset & Prototype Model Validation

> [!IMPORTANT]
> **Synthetic Development Dataset Disclosure**:
> The XGBoost model artifact (`forgetting_risk_xgboost.joblib`) was trained and evaluated on a synthetic development dataset containing **3,000 simulated student learning events**.
> 
> - **Synthetic Development Dataset Evaluation**:
>   - **Accuracy**: $97.50\%$ (on synthetic test split)
>   - **Precision**: $87.50\%$
>   - **Recall**: $71.79\%$
>   - **F1 Score**: $0.7887$
>   - **ROC-AUC**: $0.9882$
>
> **Disclaimer**: Reported accuracy represents prototype model validation on the synthetic development dataset. It does not claim clinical or real-world educational predictive validity. As real student logs accumulate in production, the training pipeline will retrain models on real student performance data.

---

## 3. Resilient Fallback Architecture

If the Python FastAPI ML service is unreachable or encounters an inference error, the Node.js Express backend automatically engages a local calibrated baseline estimator based on the Ebbinghaus retention equation:

$$R = e^{-\frac{k \cdot t}{S}}$$

where:
- $t = \text{days since last revision}$
- $k = 0.12 \times \text{topic difficulty}$
- $S = 1 + 0.25 \times \text{revision count} + 0.01 \times \text{accuracy}$

This ensures that the main StudyTwin AI application never crashes if the ML service is temporarily offline.
