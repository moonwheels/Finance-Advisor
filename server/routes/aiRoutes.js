const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');
const {
  getFinancialInsights,
  getBudgetSuggestions,
  getSavingTips
} = require('../controllers/aiController');

// All AI routes require authentication and stricter rate limiting
router.use(aiLimiter);
router.post('/insights', protect, getFinancialInsights);
router.post('/budget-suggestions', protect, getBudgetSuggestions);
router.post('/saving-tips', protect, getSavingTips);

module.exports = router;
