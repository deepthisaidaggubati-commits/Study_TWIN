const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const profile = await authService.getUserProfile(req.user._id);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error fetching user profile'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await authService.updateUserProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

const logout = async (req, res) => {
  // In JWT stateless architecture, client discards token.
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout
};
