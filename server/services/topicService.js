const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const TopicMastery = require('../models/TopicMastery');

const getTopics = async (userId, subjectId) => {
  // Get all user's subject IDs to scope search safely
  const userSubjects = await Subject.find({ userId }).select('_id');
  const userSubjectIds = userSubjects.map(s => s._id);

  const filter = { subjectId: { $in: userSubjectIds } };
  if (subjectId) {
    // Verify user owns subjectId
    if (!userSubjectIds.some(id => id.toString() === subjectId)) {
      return [];
    }
    filter.subjectId = subjectId;
  }

  const topics = await Topic.find(filter)
    .populate('subjectId', 'name')
    .populate('prerequisites', 'name difficulty')
    .sort({ createdAt: -1 });

  return topics;
};

const getTopicById = async (topicId, userId) => {
  const topic = await Topic.findById(topicId)
    .populate('subjectId', 'name userId')
    .populate('prerequisites', 'name difficulty');

  if (!topic || topic.subjectId.userId.toString() !== userId.toString()) {
    throw { statusCode: 404, message: 'Topic not found or access denied.' };
  }

  return topic;
};

const createTopic = async (userId, data) => {
  const { subjectId, name, description, difficulty, prerequisites } = data;

  if (!subjectId || !name) {
    throw { statusCode: 400, message: 'Subject ID and topic name are required.' };
  }

  // Ensure user owns subject
  const subject = await Subject.findOne({ _id: subjectId, userId });
  if (!subject) {
    throw { statusCode: 403, message: 'Subject not found or does not belong to active user.' };
  }

  const topic = await Topic.create({
    subjectId,
    name,
    description: description || '',
    difficulty: difficulty || 3,
    prerequisites: prerequisites || []
  });

  // Automatically initialize TopicMastery for user
  await TopicMastery.create({
    userId,
    topicId: topic._id,
    masteryScore: 0,
    confidence: 50,
    forgettingRisk: 0
  });

  return topic;
};

const updateTopic = async (topicId, userId, updateData) => {
  const topic = await Topic.findById(topicId).populate('subjectId', 'userId');
  if (!topic || topic.subjectId.userId.toString() !== userId.toString()) {
    throw { statusCode: 404, message: 'Topic not found or access denied.' };
  }

  if (updateData.name !== undefined) topic.name = updateData.name;
  if (updateData.description !== undefined) topic.description = updateData.description;
  if (updateData.difficulty !== undefined) topic.difficulty = updateData.difficulty;
  if (updateData.prerequisites !== undefined) topic.prerequisites = updateData.prerequisites;

  await topic.save();
  return topic;
};

const deleteTopic = async (topicId, userId) => {
  const topic = await Topic.findById(topicId).populate('subjectId', 'userId');
  if (!topic || topic.subjectId.userId.toString() !== userId.toString()) {
    throw { statusCode: 404, message: 'Topic not found or access denied.' };
  }

  await Topic.findByIdAndDelete(topicId);
  await TopicMastery.deleteMany({ topicId, userId });
  return { message: 'Topic deleted successfully.' };
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
};
