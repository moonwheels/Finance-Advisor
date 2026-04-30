const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  loginLimiter,
  registerLimiter,
  apiLimiter
} = require('../middleware/rateLimit');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('monthlyBudget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly budget must be a non-negative number'),
  body('savingsGoal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Savings goal must be a non-negative number'),
  body('currentPassword')
    .custom((value, { req }) => {
      if (req.body.password && !value) {
        throw new Error('Current password is required to change password');
      }
      return true;
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
    .withMessage('New password must include uppercase, lowercase, number, and special character')
];

// Routes
router.post('/register', registerLimiter, registerValidation, registerUser);
router.post('/login', loginLimiter, loginValidation, loginUser);
router.get('/profile', apiLimiter, protect, getUserProfile);
router.put('/profile', apiLimiter, protect, updateProfileValidation, updateUserProfile);

module.exports = router;
