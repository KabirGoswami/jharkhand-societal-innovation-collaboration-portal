import { Router } from 'express';
import { authService } from './auth.service';
import { sendResponse, sendError } from '../../utils/apiResponse';
import { authenticate, AuthRequest } from '../../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await authService.register(req.body);
    sendResponse(res, { userId: user.id }, 201, 'User registered successfully');
  } catch (err: any) {
    sendError(res, err.message, 400);
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, result, 200, 'Login successful');
  } catch (err: any) {
    sendError(res, err.message, 401);
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

router.patch('/me', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  try {
    const user = await authService.updateProfile(userId, req.body);
    sendResponse(res, user, 200, 'Profile updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 400);
  }
});

router.patch('/me/password', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { newPassword } = req.body;
  if (!newPassword) return sendError(res, 'New password is required', 400);

  try {
    const result = await authService.changePassword(userId, newPassword);
    sendResponse(res, result, 200, 'Password updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 400);
  }
});

export default router;
