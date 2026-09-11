import { Router } from 'express';
import { authService } from './auth.service';
import { sendResponse, sendError } from '../../utils/apiResponse';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authRateLimiter } from '../../middleware/rateLimit';

const router = Router();

router.use(authRateLimiter);

router.post('/complete-profile', async (req, res) => {
  try {
    // In production, userId comes from the Supabase JWT (req.user.userId)
    // For now, we take it from the body or use a fallback for dev
    const userId = req.body.userId || 'dev-user-id';
    const result = await authService.completeProfile(userId, req.body);
    sendResponse(res, result, 200, 'Profile completed successfully');
  } catch (err: any) {
    sendError(res, err.message, 400);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  try {
    const user = await authService.getMe(userId);
    sendResponse(res, user);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
