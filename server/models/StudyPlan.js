const mongoose = require('mongoose');

const PlanTaskSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  taskType: {
    type: String,
    enum: ['Learn', 'Revise', 'Practice Quiz'],
    default: 'Revise'
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 30
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const StudyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Plan date is required']
  },
  tasks: [PlanTaskSchema],
  estimatedDuration: {
    type: Number, // total minutes
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
