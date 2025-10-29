const express = require('express');
const router = express.Router();
const directMessageController = require('../controllers/directMessageController');

// Get all direct messages between two users
router.get('/:userId1/:userId2', directMessageController.getDirectMessages);

// Send a direct message
router.post('/', directMessageController.sendDirectMessage);

module.exports = router;
