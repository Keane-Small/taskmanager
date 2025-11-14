const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// @route   GET /api/activities
// @desc    Get recent activities (with optional project filter)
// @access  Private
router.get('/', activityController.getActivities);

// @route   GET /api/activities/user
// @desc    Get user's activities
// @access  Private
router.get('/user', activityController.getUserActivities);

module.exports = router;
