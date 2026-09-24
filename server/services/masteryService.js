const TopicMastery = require('../models/TopicMastery');
const StudySession = require('../models/StudySession');
const QuizAttempt = require('../models/QuizAttempt');
const Topic = require('../models/Topic');

/**
 * Calculates transparent Forgetting Risk based on Ebbinghaus memory decay approximation formula.
 * R = exp(-(k * t) / S)
 * ForgettingRisk = (1 - R) * 100
 */
const calculateForgettingRisk = (daysSinceLastRevision, topicDifficulty, revisionCount, accuracy) => {
  const t = Math.max(0, daysSinceLastRevision || 0);
  const difficulty = topicDifficulty || 3;
  const revisions = revisionCount || 0;
  const acc = accuracy || 0;

  const k = 0.12 * difficulty; // Decay factor scaled by difficulty
  const S = 1 + (0.25 * revisions) + (0.01 * acc); // Memory stability buffer
  const retention = Math.exp(-(k * t) / S);
  
  const rawRisk = (1 - retention) * 100;
  return Math.round(Math.max(0, Math.min(100, rawRisk)));
};

/**
 * Calculates transparent Topic Mastery Score (0 - 100).
 */
const calculateMasteryScore = (accuracy, totalStudyMinutes, totalAttempts, forgettingRisk) => {
  const acc = accuracy || 0;
  const studyFactor = Math.min(100, (totalStudyMinutes || 0) * 0.8);
  const attemptsFactor = Math.min(100, (totalAttempts || 0) * 12);
  const riskPenalty = (forgettingRisk || 0) * 0.25;

  const rawMastery = (0.50 * acc) + (0.30 * studyFactor) + (0.20 * attemptsFactor) - riskPenalty;
  return Math.round(Math.max(0, Math.min(100, rawMastery)));
};

const getMasteryCategory = (score) => {
  if (score <= 30) return 'Beginner';
  if (score <= 55) return 'Developing';
  if (score <= 79) return 'Strong';
  return 'Mastered';
};

const getRiskCategory = (risk) => {
  if (risk <= 30) return 'Low';
  if (risk <= 60) return 'Moderate';
  if (risk <= 80) return 'High';
  return 'Very High';
};

const getUserMasteryRecords = async (userId) => {
  const masteries = await TopicMastery.find({ userId })
    .populate({
      path: 'topicId',
      select: 'name difficulty subjectId prerequisites',
      populate: { path: 'subjectId', select: 'name' }
    });

  const now = new Date();

  // Dynamically update forgetting risk and mastery scores on read
  const updatedRecords = [];

  for (let m of masteries) {
    if (!m.topicId) continue;

    const lastDate = m.lastRevised || m.lastStudied;
    const daysSince = lastDate ? (now - new Date(lastDate)) / (1000 * 60 * 60 * 24) : 7;
    
    // Fetch total study duration for topic
    const userSessions = await StudySession.find({ userId, topicId: m.topicId._id });
    const totalMinutes = userSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const updatedRisk = calculateForgettingRisk(daysSince, m.topicId.difficulty, m.attempts, m.accuracy);
    const updatedMastery = calculateMasteryScore(m.accuracy, totalMinutes, m.attempts, updatedRisk);

    m.forgettingRisk = updatedRisk;
    m.masteryScore = updatedMastery;
    await m.save();

    updatedRecords.push({
      id: m._id,
      topicId: m.topicId._id,
      topicName: m.topicId.name,
      subjectName: m.topicId.subjectId?.name || 'Subject',
      difficulty: m.topicId.difficulty,
      masteryScore: m.masteryScore,
      masteryCategory: getMasteryCategory(m.masteryScore),
      confidence: m.confidence || 50,
      attempts: m.attempts || 0,
      accuracy: m.accuracy || 0,
      totalStudyMinutes: totalMinutes,
      lastStudied: m.lastStudied,
      lastRevised: m.lastRevised,
      daysSinceLastRevision: Math.round(daysSince),
      forgettingRisk: m.forgettingRisk,
      riskCategory: getRiskCategory(m.forgettingRisk)
    });
  }

  return updatedRecords.sort((a, b) => a.masteryScore - b.masteryScore);
};

const getMasteryByTopic = async (userId, topicId) => {
  let mastery = await TopicMastery.findOne({ userId, topicId })
    .populate('topicId', 'name difficulty subjectId');

  if (!mastery) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw { statusCode: 404, message: 'Topic not found.' };

    mastery = await TopicMastery.create({
      userId,
      topicId,
      masteryScore: 0,
      confidence: 50,
      forgettingRisk: 0
    });
    mastery.topicId = topic;
  }

  const now = new Date();
  const lastDate = mastery.lastRevised || mastery.lastStudied;
  const daysSince = lastDate ? (now - new Date(lastDate)) / (1000 * 60 * 60 * 24) : 7;

  const userSessions = await StudySession.find({ userId, topicId });
  const totalMinutes = userSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  mastery.forgettingRisk = calculateForgettingRisk(daysSince, mastery.topicId?.difficulty || 3, mastery.attempts, mastery.accuracy);
  mastery.masteryScore = calculateMasteryScore(mastery.accuracy, totalMinutes, mastery.attempts, mastery.forgettingRisk);
  await mastery.save();

  return {
    id: mastery._id,
    topicId: mastery.topicId._id,
    topicName: mastery.topicId?.name,
    difficulty: mastery.topicId?.difficulty,
    masteryScore: mastery.masteryScore,
    masteryCategory: getMasteryCategory(mastery.masteryScore),
    confidence: mastery.confidence,
    attempts: mastery.attempts,
    accuracy: mastery.accuracy,
    totalStudyMinutes: totalMinutes,
    lastStudied: mastery.lastStudied,
    lastRevised: mastery.lastRevised,
    daysSinceLastRevision: Math.round(daysSince),
    forgettingRisk: mastery.forgettingRisk,
    riskCategory: getRiskCategory(mastery.forgettingRisk)
  };
};

module.exports = {
  calculateForgettingRisk,
  calculateMasteryScore,
  getMasteryCategory,
  getRiskCategory,
  getUserMasteryRecords,
  getMasteryByTopic
};
