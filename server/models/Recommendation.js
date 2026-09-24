const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic ID is required']
  },
  recommendationType: {
    type: String,
    enum: ['Revision', 'Practice Quiz', 'Deep Study', 'Prerequisite Review'],
    default: 'Revision'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  reason: {
    type: String,
    required: [true, 'Recommendation reason is required'],
    trim: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 30
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
