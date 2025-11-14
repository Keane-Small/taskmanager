const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'task_assigned', 
      'task_completed', 
      'task_overdue',
      'task_due_soon',
      'task_commented',
      'project_created', 
      'project_updated',
      'project_completed',
      'collaborator_added',
      'collaborator_removed',
      'mention',
      'deadline_approaching',
      'system'
    ], 
    default: 'system' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who triggered this notification
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of related task/project
  relatedModel: { type: String, enum: ['Task', 'Project', 'User', 'Comment', null], default: null },
  actionUrl: { type: String }, // URL to navigate to when clicked
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: { type: Date } // Optional expiration for temporary notifications
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
