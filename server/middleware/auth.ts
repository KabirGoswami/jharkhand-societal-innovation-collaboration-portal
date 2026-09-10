import { Request, Response, NextFunction } from 'express';
import { authService, TokenPayload } from '../modules/auth/auth.service';
import { sendError } from '../utils/apiResponse';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Bypass authentication if AUTH_BYPASS is explicitly set to 'true'
  if (process.env.AUTH_BYPASS === 'true') {
    req.user = {
      userId: 'dev-user-id',
      name: 'Development User',
      role: 'GOVT_ADMIN', // Grant admin privileges for testing
      email: 'dev@localhost',
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    return sendError(res, err.message, 401, 'INVALID_TOKEN');
  }
};

export const roleGuard = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Bypass role guard if AUTH_BYPASS is explicitly set to 'true'
    if (process.env.AUTH_BYPASS === 'true') {
      return next();
    }

    if (!req.user) {
      return sendError(res, 'User not authenticated', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
};
