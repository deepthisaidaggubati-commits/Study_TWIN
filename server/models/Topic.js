const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Topic', TopicSchema);
