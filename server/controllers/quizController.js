const quizService = require('../services/quizService');

const getQuizzes = async (req, res, next) => {
  try {
    const { topicId, subjectId } = req.query;
    const quizzes = await quizService.getQuizzes(topicId, subjectId);
    res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching quizzes' });
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching quiz' });
  }
};

const createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json({ success: true, message: 'Quiz created successfully', data: quiz });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating quiz' });
  }
};

const submitQuizAttempt = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;
    const result = await quizService.submitQuizAttempt(req.user._id, req.params.id, answers, timeTaken);
    res.status(200).json({ success: true, message: 'Quiz submitted successfully', data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error submitting quiz attempt' });
  }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const history = await quizService.getQuizHistory(req.user._id);
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching quiz history' });
  }
};

const generateAdaptiveQuiz = async (req, res, next) => {
  try {
    const { topicId } = req.body;
    const quiz = await quizService.generateAdaptiveQuiz(req.user._id, topicId);
    res.status(201).json({ success: true, message: 'Adaptive quiz prepared by your Digital Twin', data: quiz });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error generating adaptive quiz' });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  generateAdaptiveQuiz,
  submitQuizAttempt,
  getQuizHistory
};
