const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  examDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
