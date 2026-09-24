const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
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
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 1
  },
  studyType: {
    type: String,
    enum: ['Learning', 'Revision', 'Practice', 'Quiz', 'Coding'],
    default: 'Learning'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
