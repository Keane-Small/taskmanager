const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const Task = require('../models/Task');
const NotificationService = require('../services/notificationService');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { text, taskId, projectId, mentions } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (!taskId && !projectId) {
      return res.status(400).json({ message: 'Either taskId or projectId is required' });
    }

    const comment = new Comment({
      text,
      user: req.user._id,
      task: taskId,
      project: projectId,
      mentions: mentions || []
    });

    await comment.save();
    await comment.populate('user', 'name email profilePicture');

    // Log activity
    const activity = new Activity({
      user: req.user._id,
      action: 'commented',
      entityType: taskId ? 'task' : 'project',
      entityId: taskId || projectId,
      entityName: text.substring(0, 50),
      project: projectId,
      description: `commented on ${taskId ? 'a task' : 'a project'}`
    });
    await activity.save();

    // Notify task assignee if commenting on a task
    if (taskId) {
      const task = await Task.findById(taskId);
      if (task && task.assignedTo && task.assignedTo.length > 0) {
        for (const assigneeId of task.assignedTo) {
          await NotificationService.notifyTaskComment(
            taskId,
            task.title,
            req.user._id,
            assigneeId,
            projectId,
            text
          );
        }
      }
    }

    // Notify mentioned users
    if (mentions && mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        await NotificationService.notifyMention(
          mentionedUserId,
          req.user._id,
          text,
          comment._id,
          'comment',
          projectId
        );
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comments for a task or project
exports.getComments = async (req, res) => {
  try {
    const { taskId, projectId } = req.query;

    if (!taskId && !projectId) {
      return res.status(400).json({ message: 'Either taskId or projectId is required' });
    }

    const query = {};
    if (taskId) query.task = taskId;
    if (projectId) query.project = projectId;

    const comments = await Comment.find(query)
      .populate('user', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.text = text;
    comment.edited = true;
    comment.editedAt = new Date();
    await comment.save();
    await comment.populate('user', 'name email profilePicture');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
