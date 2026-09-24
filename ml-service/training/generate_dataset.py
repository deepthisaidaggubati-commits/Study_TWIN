"""
StudyTwin AI - Synthetic Dataset Generator
Generates realistic synthetic student learning logs for model development and evaluation.
Clearly labeled as Synthetic Development Dataset.
"""
import pandas as pd
import numpy as np
import os

def generate_synthetic_data(num_samples=2500, random_seed=42):
    np.random.seed(random_seed)

    days_since_last_revision = np.random.exponential(scale=5.0, size=num_samples)
    days_since_last_revision = np.clip(days_since_last_revision, 0, 30)

    historical_accuracy = np.random.beta(a=5, b=2, size=num_samples) * 100
    revision_count = np.random.poisson(lam=2.5, size=num_samples)
    topic_difficulty = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.2, 0.4, 0.2, 0.1], size=num_samples)
    study_duration_mins = np.random.normal(loc=35, scale=12, size=num_samples)
    study_duration_mins = np.clip(study_duration_mins, 5, 120)

    # Underlying retention target (1 = High Risk of forgetting/failing, 0 = Retained)
    logits = (
        0.18 * days_since_last_revision
        - 0.04 * historical_accuracy
        - 0.35 * revision_count
        + 0.45 * topic_difficulty
        - 0.02 * study_duration_mins
        + np.random.normal(0, 0.5, num_samples)
    )

    probabilities = 1 / (1 + np.exp(-logits))
    target_high_risk = (probabilities > 0.5).astype(int)

    df = pd.DataFrame({
        'days_since_last_revision': np.round(days_since_last_revision, 2),
        'historical_accuracy': np.round(historical_accuracy, 2),
        'revision_count': revision_count,
        'topic_difficulty': topic_difficulty,
        'study_duration_mins': np.round(study_duration_mins, 2),
        'forgetting_risk_probability': np.round(probabilities * 100, 2),
        'high_risk_label': target_high_risk
    })

    return df

if __name__ == '__main__':
    dataset_dir = os.path.join(os.path.dirname(__file__), '../datasets')
    os.makedirs(dataset_dir, exist_ok=True)
    df = generate_synthetic_data(3000)
    output_path = os.path.join(dataset_dir, 'synthetic_student_decay_dataset.csv')
    df.to_csv(output_path, index=False)
    print(f"✔ Synthetic dataset generated ({len(df)} records) at: {output_path}")
