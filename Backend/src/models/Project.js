const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['Planning', 'In Progress', 'Completed'], 
    default: 'Planning' 
  },
  startDate: { type: Date },
  dueDate: { type: String, default: 'TBD' },
  collaborators: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Viewer', 'Editor', 'Admin'], default: 'Editor' },
    addedAt: { type: Date, default: Date.now }
  }],
  color: { type: String, default: '#F9F9F9' },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Virtual field to maintain backward compatibility - dueDate is the endDate
projectSchema.virtual('dueDate').get(function() {
  return this.endDate;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
