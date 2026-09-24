const topicService = require('../services/topicService');

const getTopics = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const topics = await topicService.getTopics(req.user._id, subjectId);
    res.status(200).json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching topics' });
  }
};

const getTopicById = async (req, res, next) => {
  try {
    const topic = await topicService.getTopicById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching topic' });
  }
};

const createTopic = async (req, res, next) => {
  try {
    const topic = await topicService.createTopic(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Topic created successfully', data: topic });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating topic' });
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const updated = await topicService.updateTopic(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Topic updated successfully', data: updated });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error updating topic' });
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const result = await topicService.deleteTopic(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error deleting topic' });
  }
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
};
