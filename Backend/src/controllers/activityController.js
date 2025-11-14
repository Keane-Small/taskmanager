const Activity = require('../models/Activity');

// Get recent activities
exports.getActivities = async (req, res) => {
  try {
    const { projectId, limit = 50, skip = 0 } = req.query;

    const query = {};
    if (projectId) {
      query.project = projectId;
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      total,
      hasMore: skip + activities.length < total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's activities
exports.getUserActivities = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const activities = await Activity.find({ user: req.user._id })
      .populate('user', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments({ user: req.user._id });

    res.json({
      activities,
      total,
      hasMore: skip + activities.length < total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log an activity (helper function, can be called from other controllers)
exports.logActivity = async (userId, action, entityType, entityId, entityName, projectId = null, metadata = {}) => {
  try {
    const activity = new Activity({
      user: userId,
      action,
      entityType,
      entityId,
      entityName,
      project: projectId,
      metadata,
      description: generateDescription(action, entityType, entityName)
    });

    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Generate human-readable description
function generateDescription(action, entityType, entityName) {
  const actionMap = {
    created_project: `created project "${entityName}"`,
    updated_project: `updated project "${entityName}"`,
    deleted_project: `deleted project "${entityName}"`,
    created_task: `created task "${entityName}"`,
    updated_task: `updated task "${entityName}"`,
    deleted_task: `deleted task "${entityName}"`,
    completed_task: `completed task "${entityName}"`,
    commented: `commented on ${entityType}`,
    assigned_task: `assigned task "${entityName}"`,
    moved_task: `moved task "${entityName}"`,
    added_member: `added a member to "${entityName}"`,
    removed_member: `removed a member from "${entityName}"`,
    uploaded_file: `uploaded a file to "${entityName}"`
  };

  return actionMap[action] || `performed ${action}`;
}
