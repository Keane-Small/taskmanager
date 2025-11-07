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
  dueDate: { type: Date },
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

module.exports = mongoose.model('Project', projectSchema);
