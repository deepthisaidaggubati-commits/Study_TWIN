const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'studytwin_dev_jwt_secret_key_2026' : null);
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined in production.');
  }
  return secret;
};

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

const registerUser = async (userData) => {
  const { name, email, password, academicLevel, branch, graduationYear, gender } = userData;

  if (!name || !email || !password) {
    throw { statusCode: 400, message: 'Please provide name, email, and password.' };
  }

  if (password.length < 6) {
    throw { statusCode: 400, message: 'Password must be at least 6 characters long.' };
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw { statusCode: 400, message: 'An account with this email already exists.' };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    academicLevel: academicLevel || 'Undergraduate',
    branch: branch || 'Computer Science',
    graduationYear: graduationYear || new Date().getFullYear() + 2,
    gender: gender || 'neutral'
  });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      academicLevel: user.academicLevel,
      branch: user.branch,
      graduationYear: user.graduationYear,
      gender: user.gender,
      createdAt: user.createdAt
    }
  };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { statusCode: 400, message: 'Please provide email and password.' };
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials. User not found.' };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials. Password incorrect.' };
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      academicLevel: user.academicLevel,
      branch: user.branch,
      graduationYear: user.graduationYear,
      gender: user.gender,
      createdAt: user.createdAt
    }
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw { statusCode: 404, message: 'User profile not found.' };
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'academicLevel', 'branch', 'graduationYear', 'gender'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  return updatedUser;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
