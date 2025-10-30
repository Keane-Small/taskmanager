const Project = require('../models/Project');
const Task = require('../models/Task');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, status, dueDate, collaborators, color } = req.body;
    const userId = req.userId; // From auth middleware

    const project = await Project.create({
      name,
      status: status || 'Planning',
      dueDate: dueDate || 'TBD',
      collaborators: collaborators || [],
      color: color || '#F9F9F9',
      userId
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all projects for logged-in user (owned + collaborated)
exports.getProjects = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Find projects where user is owner OR collaborator
    const projects = await Project.find({
      $or: [
        { userId: userId },
        { 'collaborators.userId': userId }
      ]
    })
    .populate('collaborators.userId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure user owns this project
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, status, dueDate, collaborators, color, totalTasks, completedTasks } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure user owns this project
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (collaborators !== undefined) updates.collaborators = collaborators;
    if (color !== undefined) updates.color = color;
    if (totalTasks !== undefined) updates.totalTasks = totalTasks;
    if (completedTasks !== undefined) updates.completedTasks = completedTasks;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete project and all its tasks
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure user owns this project
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: req.params.id });

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and associated tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update project task counts (called when tasks are created/updated/deleted)
exports.updateProjectCounts = async (projectId) => {
  try {
    const totalTasks = await Task.countDocuments({ projectId });
    const completedTasks = await Task.countDocuments({ projectId, status: 'completed' });
    
    await Project.findByIdAndUpdate(projectId, {
      totalTasks,
      completedTasks
    });
  } catch (err) {
    console.error('Error updating project counts:', err);
  }
};

// Add collaborator to project
exports.addCollaborator = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure user owns this project
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if collaborator already exists
    const existingCollab = project.collaborators.find(
      c => c.userId.toString() === userId
    );
    
    if (existingCollab) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    project.collaborators.push({
      userId,
      role: role || 'Editor',
      addedAt: new Date()
    });

    await project.save();
    
    // Populate the collaborators before sending response
    await project.populate('collaborators.userId', 'name email');
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove collaborator from project
exports.removeCollaborator = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure user owns this project
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    project.collaborators = project.collaborators.filter(
      c => c.userId.toString() !== userId
    );

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get project collaborators
exports.getCollaborators = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('collaborators.userId', 'name email');
      
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    res.json(project.collaborators);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
