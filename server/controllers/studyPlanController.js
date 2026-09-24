const studyPlanService = require('../services/studyPlanService');

const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await studyPlanService.getStudyPlans(req.user._id);
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching study plans' });
  }
};

const generateStudyPlan = async (req, res, next) => {
  try {
    const plan = await studyPlanService.generateStudyPlan(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Adaptive study plan generated successfully', data: plan });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error generating study plan' });
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId, completed } = req.body;
    const plan = await studyPlanService.updateTaskStatus(req.user._id, req.params.id, taskId, completed);
    res.status(200).json({ success: true, message: 'Task completion status updated', data: plan });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error updating task status' });
  }
};

module.exports = {
  getStudyPlans,
  generateStudyPlan,
  updateTaskStatus
};
