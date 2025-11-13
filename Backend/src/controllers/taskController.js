const Task = require('../models/Task');
const Project = require('../models/Project');
const { updateProjectCounts } = require('./projectController');
const NotificationService = require('../services/notificationService');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, projectId } = req.body;
    const userId = req.userId;

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      assignedTo: assignedTo || [],
      projectId,
      userId
    });

    // Update project task counts
    await updateProjectCounts(projectId);

    // Notify assigned users
    if (assignedTo && assignedTo.length > 0) {
      for (const assigneeId of assignedTo) {
        await NotificationService.notifyTaskAssigned(
          task._id,
          title,
          assigneeId,
          userId,
          projectId
        );
      }
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all tasks for the authenticated user
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all tasks belonging to the user's projects
    const tasks = await Task.find({ userId })
      .populate('projectId', 'name description')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all tasks for a project
exports.getTasksForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const tasks = await Task.find({ projectId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get urgent tasks (high priority or due soon, excluding completed)
exports.getUrgentTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find tasks that are:
    // 1. High priority OR due within 3 days
    // 2. Not completed or archived
    // 3. Belong to user's projects
    const tasks = await Task.find({
      userId,
      status: { $nin: ['completed', 'archived'] },
      $or: [
        { priority: 'high' },
        { dueDate: { $lte: threeDaysFromNow, $gte: now } }
      ]
    })
    .populate('projectId', 'name')
    .sort({ dueDate: 1, priority: -1 })
    .limit(10);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Ensure user owns this task
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Ensure user owns this task
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo || [];

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );

    // Update project task counts if status changed
    if (status !== undefined) {
      await updateProjectCounts(task.projectId);
      
      // Notify project owner if task completed
      if (status === 'completed' && oldStatus !== 'completed') {
        const project = await Project.findById(task.projectId);
        if (project) {
          await NotificationService.notifyTaskCompleted(
            task._id,
            task.title,
            req.userId,
            project.userId,
            task.projectId
          );
        }
      }
    }

    // Notify newly assigned users
    if (assignedTo !== undefined) {
      const newAssignees = assignedTo.filter(
        id => !oldAssignedTo.includes(id)
      );
      
      for (const assigneeId of newAssignees) {
        await NotificationService.notifyTaskAssigned(
          task._id,
          task.title,
          assigneeId,
          req.userId,
          task.projectId
        );
      }
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Ensure user owns this task
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const projectId = task.projectId;
    await Task.findByIdAndDelete(req.params.id);

    // Update project task counts
    await updateProjectCounts(projectId);

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get task statistics for a project
exports.getTaskStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const total = await Task.countDocuments({ projectId });
    const completed = await Task.countDocuments({ projectId, status: 'completed' });
    const inProgress = await Task.countDocuments({ projectId, status: 'in-progress' });
    const todo = await Task.countDocuments({ projectId, status: 'todo' });

    res.json({ total, completed, inProgress, todo });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
