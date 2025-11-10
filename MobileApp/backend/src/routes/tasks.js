const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      $or: [
        { userId: req.userId },
        { assignedTo: req.userId }
      ]
    })
    .populate('projectId', 'name color')
    .populate('assignedTo', 'name email profilePicture')
    .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get urgent tasks (high priority or due soon)
router.get('/urgent', auth, async (req, res) => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const tasks = await Task.find({
      $or: [
        { userId: req.userId },
        { assignedTo: req.userId }
      ],
      status: { $ne: 'completed' },
      $or: [
        { priority: 'high' },
        { dueDate: { $lte: threeDaysFromNow, $gte: new Date() } }
      ]
    })
    .populate('projectId', 'name color')
    .populate('assignedTo', 'name email profilePicture')
    .sort({ dueDate: 1, priority: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get urgent tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name color')
      .populate('assignedTo', 'name email profilePicture');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (task.userId.toString() !== req.userId && 
        !task.assignedTo.some(user => user._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assignedTo, tags } = req.body;

    const task = new Task({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      projectId,
      userId: req.userId,
      assignedTo: assignedTo || [],
      tags: tags || []
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name color')
      .populate('assignedTo', 'name email profilePicture');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is owner
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, projectId, assignedTo, tags } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (projectId !== undefined) task.projectId = projectId;
    if (assignedTo) task.assignedTo = assignedTo;
    if (tags) task.tags = tags;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name color')
      .populate('assignedTo', 'name email profilePicture');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is owner
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
