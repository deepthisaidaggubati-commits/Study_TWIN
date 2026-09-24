const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: [{
    type: String,
    required: [true, 'Option text is required']
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct option index is required'],
    min: 0
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  conceptTag: {
    type: String,
    default: 'General'
  }
});

const QuizSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required']
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic ID is required'],
    index: true
  },
  questions: [QuestionSchema],
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', QuizSchema);
