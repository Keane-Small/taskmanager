const Task = require('../models/Task');
const Project = require('../models/Project');
const { updateProjectCounts } = require('./projectController');

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

    res.status(201).json(task);
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
