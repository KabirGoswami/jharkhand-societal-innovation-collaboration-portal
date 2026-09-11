import rateLimit from 'express-rate-limit';
import { Response } from 'express';
import { sendError } from '../utils/apiResponse';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'TOO_MANY_REQUESTS',
  },
  handler: (req, res, next, options) => {
    sendError(res, options.message, 429, 'TOO_MANY_REQUESTS');
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: 'Too many sensitive requests from this IP, please try again after an hour',
    code: 'TOO_MANY_SENSITIVE_REQUESTS',
  },
  handler: (req, res, next, options) => {
    sendError(res, options.message, 429, 'TOO_MANY_SENSITIVE_REQUESTS');
  },
  standardHeaders: true,
  legacyHeaders: false,
});
