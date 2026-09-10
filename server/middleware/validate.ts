import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/apiResponse';

/**
 * Request validation middleware factory using Zod schemas.
 * Validates body, query, or params based on config.
 *
 * Usage:
 *   router.post('/problems', validate({ body: createProblemSchema }), handler)
 */
export function validate(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }
      next();
    } catch (err: any) {
      if (err.name === 'ZodError') {
        const messages = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
        return sendError(res, 'Validation failed', 400);
      }
      next(err);
    }
  };
}
