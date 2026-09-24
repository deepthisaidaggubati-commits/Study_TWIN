const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getRecommendations(req.user._id);
    res.status(200).json({ success: true, count: recommendations.length, data: recommendations });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching recommendations' });
  }
};

const generateRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.generateRecommendations(req.user._id);
    res.status(200).json({ success: true, message: 'Recommendations generated successfully', data: recommendations });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error generating recommendations' });
  }
};

const markCompleted = async (req, res, next) => {
  try {
    const rec = await recommendationService.markRecommendationCompleted(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Recommendation marked as completed', data: rec });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error completing recommendation' });
  }
};

module.exports = {
  getRecommendations,
  generateRecommendations,
  markCompleted
};
