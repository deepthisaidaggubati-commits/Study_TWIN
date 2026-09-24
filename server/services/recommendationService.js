const Recommendation = require('../models/Recommendation');
const TopicMastery = require('../models/TopicMastery');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

const getRecommendations = async (userId) => {
  return await Recommendation.find({ userId, completed: false })
    .populate({
      path: 'topicId',
      select: 'name difficulty subjectId',
      populate: { path: 'subjectId', select: 'name examDate' }
    })
    .sort({ createdAt: -1 });
};

const generateRecommendations = async (userId) => {
  // Clear uncompleted existing recommendations to avoid duplicates
  await Recommendation.deleteMany({ userId, completed: false });

  const masteryRecords = await TopicMastery.find({ userId })
    .populate({
      path: 'topicId',
      select: 'name difficulty subjectId prerequisites',
      populate: { path: 'subjectId', select: 'name examDate' }
    });

  const recommendations = [];

  for (const record of masteryRecords) {
    if (!record.topicId) continue;

    const topicName = record.topicId.name;
    const daysSinceLastRevised = record.lastRevised
      ? Math.floor((new Date() - new Date(record.lastRevised)) / (1000 * 60 * 60 * 24))
      : 7;

    // Rule 1: High Forgetting Risk / Long time without revision
    if (record.forgettingRisk >= 60 || daysSinceLastRevised >= 5) {
      recommendations.push({
        userId,
        topicId: record.topicId._id,
        recommendationType: 'Revision',
        priority: record.forgettingRisk >= 75 ? 'High' : 'Medium',
        reason: `Your recent quiz accuracy for ${topicName} is ${record.accuracy}% and it has not been revised for ${daysSinceLastRevised} days.`,
        estimatedDuration: 35
      });
    }

    // Rule 2: Low Mastery Topic Needs Practice
    if (record.masteryScore < 60) {
      recommendations.push({
        userId,
        topicId: record.topicId._id,
        recommendationType: 'Practice Quiz',
        priority: 'High',
        reason: `Mastery score for ${topicName} is currently ${record.masteryScore}%. Taking a practice quiz will reinforce weak concepts.`,
        estimatedDuration: 25
      });
    }
  }

  // Fallback if no records found yet
  if (recommendations.length === 0) {
    const userSubjects = await Subject.find({ userId });
    const userTopics = await Topic.find({ subjectId: { $in: userSubjects.map(s => s._id) } });
    
    if (userTopics.length > 0) {
      recommendations.push({
        userId,
        topicId: userTopics[0]._id,
        recommendationType: 'Deep Study',
        priority: 'High',
        reason: `Initial deep study session recommended to build base topic mastery for ${userTopics[0].name}.`,
        estimatedDuration: 45
      });
    }
  }

  if (recommendations.length > 0) {
    await Recommendation.insertMany(recommendations);
  }

  return await getRecommendations(userId);
};

const markRecommendationCompleted = async (recommendationId, userId) => {
  const rec = await Recommendation.findOneAndUpdate(
    { _id: recommendationId, userId },
    { $set: { completed: true } },
    { new: true }
  );

  if (!rec) {
    throw { statusCode: 404, message: 'Recommendation not found or access denied.' };
  }

  return rec;
};

module.exports = {
  getRecommendations,
  generateRecommendations,
  markRecommendationCompleted
};
