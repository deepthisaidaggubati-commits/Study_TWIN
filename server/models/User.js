const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  academicLevel: {
    type: String,
    enum: ['High School', 'Undergraduate', 'Postgraduate', 'Other'],
    default: 'Undergraduate'
  },
  branch: {
    type: String,
    trim: true,
    default: 'Computer Science'
  },
  graduationYear: {
    type: Number,
    default: new Date().getFullYear() + 2
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
