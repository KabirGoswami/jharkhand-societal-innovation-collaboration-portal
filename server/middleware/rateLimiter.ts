import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

/**
 * Simple in-memory rate limiter.
 * For production, use Redis-backed rate limiting.
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(options: {
  windowMs?: number;   // Time window in milliseconds (default: 1 minute)
  maxRequests?: number; // Max requests per window (default: 100)
} = {}) {
  const { windowMs = 60_000, maxRequests = 100 } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return sendError(res, 'Too many requests. Please try again later.', 429);
    }

    entry.count += 1;
    next();
  };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 300_000);
