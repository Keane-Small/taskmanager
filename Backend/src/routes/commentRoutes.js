const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post('/', commentController.createComment);

// @route   GET /api/comments
// @desc    Get comments for a task or project
// @access  Private
router.get('/', commentController.getComments);

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', commentController.updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', commentController.deleteComment);

module.exports = router;
