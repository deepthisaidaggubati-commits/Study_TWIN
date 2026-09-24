const masteryService = require('../services/masteryService');

const getUserMasteryRecords = async (req, res, next) => {
  try {
    const records = await masteryService.getUserMasteryRecords(req.user._id);
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching topic mastery' });
  }
};

const getMasteryByTopic = async (req, res, next) => {
  try {
    const mastery = await masteryService.getMasteryByTopic(req.user._id, req.params.topicId);
    res.status(200).json({ success: true, data: mastery });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching topic mastery' });
  }
};

const updateTopicMastery = async (req, res, next) => {
  try {
    const updated = await masteryService.updateTopicMastery(req.user._id, req.params.topicId, req.body);
    res.status(200).json({ success: true, message: 'Topic mastery updated', data: updated });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error updating topic mastery' });
  }
};

module.exports = {
  getUserMasteryRecords,
  getMasteryByTopic,
  updateTopicMastery
};
