const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', quizController.getQuizzes);
router.post('/', quizController.createQuiz);
router.get('/history', quizController.getQuizHistory);
router.get('/:id', quizController.getQuizById);
router.post('/:id/attempt', quizController.submitQuizAttempt);

module.exports = router;
