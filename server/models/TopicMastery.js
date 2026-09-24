const mongoose = require('mongoose');

const TopicMasterySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic ID is required'],
    index: true
  },
  masteryScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastStudied: {
    type: Date
  },
  lastRevised: {
    type: Date
  },
  forgettingRisk: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure compound index for unique user-topic mastery record
TopicMasterySchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TopicMastery', TopicMasterySchema);
