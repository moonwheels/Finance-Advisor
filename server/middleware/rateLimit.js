const rateLimit = require('express-rate-limit');

const buildRateLimitMessage = (message, windowMinutes) => ({
  message,
  retryAfterMinutes: windowMinutes
});

const createLimiter = ({
  windowMs,
  max,
  message,
  standardHeaders = true,
  legacyHeaders = false,
  keyGenerator,
  skipSuccessfulRequests = false
}) => rateLimit({
  windowMs,
  max,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skipSuccessfulRequests,
  handler: (req, res) => {
    res.status(429).json(
      buildRateLimitMessage(message, Math.ceil(windowMs / 60000))
    );
  }
});

const loginLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please wait 1 minute before trying again.',
  skipSuccessfulRequests: true
});

const registerLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please wait 15 minutes before creating another account.'
});

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many API requests. Please slow down and try again shortly.'
});

const aiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'AI request limit reached. Please wait before requesting more AI insights.'
});

module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  aiLimiter
};
