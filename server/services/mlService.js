const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const predictForgettingRisk = async (params) => {
  const { days_since_last_revision, historical_accuracy, revision_count, topic_difficulty, study_duration_mins } = params;

  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/forgetting-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        days_since_last_revision: Number(days_since_last_revision || 0),
        historical_accuracy: Number(historical_accuracy || 0),
        revision_count: Number(revision_count || 0),
        topic_difficulty: Number(topic_difficulty || 3),
        study_duration_mins: Number(study_duration_mins || 0)
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn(`[ML Service Fallback] Python ML service unavailable (${error.message}). Using calibrated baseline.`);
  }

  // Local fallback baseline
  const t = Math.max(0, days_since_last_revision || 0);
  const k = 0.12 * (topic_difficulty || 3);
  const S = 1 + (0.25 * (revision_count || 0)) + (0.01 * (historical_accuracy || 0));
  const retention = Math.exp(-(k * t) / S);
  const risk_score = Math.round(Math.max(0, Math.min(100, (1 - retention) * 100)));

  let category = 'Low';
  if (risk_score > 80) category = 'Very High';
  else if (risk_score > 60) category = 'High';
  else if (risk_score > 30) category = 'Moderate';

  return {
    risk_score,
    risk_category: category,
    recommended_revision_mins: risk_score > 60 ? 40 : 20,
    model_version: 'v1.0-express-fallback-baseline',
    prediction_confidence: 0.85
  };
};

const predictExamReadiness = async (params) => {
  const { topic_coverage_ratio, overall_mastery, study_streak_days, high_risk_topics_count, days_remaining_exam } = params;

  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/exam-readiness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic_coverage_ratio: Number(topic_coverage_ratio || 0),
        overall_mastery: Number(overall_mastery || 0),
        study_streak_days: Number(study_streak_days || 0),
        high_risk_topics_count: Number(high_risk_topics_count || 0),
        days_remaining_exam: Number(days_remaining_exam || 30)
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn(`[ML Service Fallback] Readiness predictor fallback engaged (${error.message}).`);
  }

  const rawReadiness = (overall_mastery * 0.5) + (topic_coverage_ratio * 100 * 0.25) + (Math.min(1, study_streak_days / 7) * 100 * 0.25) - (high_risk_topics_count * 4);
  const estimated_readiness = Math.round(Math.max(0, Math.min(100, rawReadiness)));

  return {
    estimated_readiness,
    readiness_category: estimated_readiness >= 75 ? 'Well Prepared' : 'Needs Focus',
    key_factors: [
      `Overall mastery is ${overall_mastery}%`,
      `Topic coverage is ${Math.round(topic_coverage_ratio * 100)}%`
    ]
  };
};

module.exports = {
  predictForgettingRisk,
  predictExamReadiness
};
