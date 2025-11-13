const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/', auth, controller.createTask);
router.get('/', auth, controller.getAllTasks);  // Get all tasks for user
router.get('/urgent', auth, controller.getUrgentTasks);
router.get('/project/:projectId', auth, controller.getTasksForProject);
router.get('/project/:projectId/stats', auth, controller.getTaskStats);
router.get('/:id', auth, controller.getTaskById);
router.put('/:id', auth, controller.updateTask);
router.delete('/:id', auth, controller.deleteTask);

module.exports = router;
