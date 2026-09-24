const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error loading dashboard metrics' });
  }
};

module.exports = {
  getDashboard
};
