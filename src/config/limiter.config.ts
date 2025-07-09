import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
