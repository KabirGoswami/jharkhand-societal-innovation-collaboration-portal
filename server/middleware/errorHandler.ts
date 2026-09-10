import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

/**
 * Global error handler middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 * Must be registered AFTER all routes.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the full error
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma known request errors
  if (err.code === 'P2002') {
    return sendError(res, 'A record with this unique value already exists', 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'Record not found', 404);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return sendError(res, 'Validation failed', 400);
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 'Invalid JSON in request body', 400);
  }

  // Default 500
  return sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error',
    err.statusCode || 500
  );
}
