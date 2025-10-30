const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['task', 'project', 'user', 'system'], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of related task/project
  relatedModel: { type: String, enum: ['Task', 'Project', 'User', null], default: null }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
