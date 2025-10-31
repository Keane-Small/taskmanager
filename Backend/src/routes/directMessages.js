const express = require('express');
const router = express.Router();
const directMessageController = require('../controllers/directMessageController');

// Get unread count for a user (must be before /:userId1/:userId2)
router.get('/unread/:userId', directMessageController.getUnreadCount);

// Mark messages as read (must be before /:userId1/:userId2)
router.put('/read/:userId1/:userId2', directMessageController.markAsRead);

// Send a direct message
router.post('/', directMessageController.sendDirectMessage);

// Get all direct messages between two users (must be last)
router.get('/:userId1/:userId2', directMessageController.getDirectMessages);

module.exports = router;
