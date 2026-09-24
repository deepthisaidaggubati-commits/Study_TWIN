const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  incorrectAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
