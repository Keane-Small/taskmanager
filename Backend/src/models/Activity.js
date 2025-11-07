const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created_project',
      'updated_project',
      'deleted_project',
      'created_task',
      'updated_task',
      'deleted_task',
      'completed_task',
      'commented',
      'assigned_task',
      'moved_task',
      'added_member',
      'removed_member',
      'uploaded_file'
    ]
  },
  entityType: {
    type: String,
    enum: ['project', 'task', 'comment', 'user'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  entityName: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
