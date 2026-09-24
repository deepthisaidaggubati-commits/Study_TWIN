const studySessionService = require('../services/studySessionService');

const getSessions = async (req, res, next) => {
  try {
    const { subjectId, topicId, studyType } = req.query;
    const sessions = await studySessionService.getSessions(req.user._id, { subjectId, topicId, studyType });
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching study sessions' });
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await studySessionService.getSessionById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching study session' });
  }
};

const createSession = async (req, res, next) => {
  try {
    const session = await studySessionService.createSession(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Study session logged successfully', data: session });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error logging study session' });
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const result = await studySessionService.deleteSession(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error deleting study session' });
  }
};

const getStudyAnalytics = async (req, res, next) => {
  try {
    const analytics = await studySessionService.getStudyAnalytics(req.user._id);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching study analytics' });
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  deleteSession,
  getStudyAnalytics
};
