const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        savingsGoal: user.savingsGoal,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        savingsGoal: user.savingsGoal,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      monthlyBudget,
      savingsGoal,
      currentPassword,
      password
    } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      if (typeof email === 'string') {
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail !== user.email) {
          const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: user._id }
          });

          if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
          }
        }

        user.email = normalizedEmail;
      }

      if (typeof name === 'string') {
        user.name = name.trim();
      }

      if (monthlyBudget !== undefined) {
        user.monthlyBudget = Number(monthlyBudget);
      }

      if (savingsGoal !== undefined) {
        user.savingsGoal = Number(savingsGoal);
      }

      if (password) {
        const isCurrentPasswordValid = await user.matchPassword(currentPassword);

        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        monthlyBudget: updatedUser.monthlyBudget,
        savingsGoal: updatedUser.savingsGoal,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
