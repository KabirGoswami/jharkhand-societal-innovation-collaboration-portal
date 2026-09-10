import { Router } from 'express';
import { notificationsService } from './notifications.service';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notifications = await notificationsService.getAllNotifications();
    res.json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationsService.markAsRead(id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    await notificationsService.markAllAsRead();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

export default router;
