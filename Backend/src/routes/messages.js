const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get all messages for a project
router.get('/:projectId', messageController.getProjectMessages);

// Send a message to a project
router.post('/', messageController.sendProjectMessage);

module.exports = router;
