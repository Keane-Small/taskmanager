const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/', auth, controller.createNotification);
router.get('/', auth, controller.getNotifications);
router.get('/unread-count', auth, controller.getUnreadCount);
router.get('/:id', auth, controller.getNotificationById);
router.put('/:id/read', auth, controller.markAsRead);
router.put('/read-all', auth, controller.markAllAsRead);
router.delete('/:id', auth, controller.deleteNotification);

module.exports = router;
