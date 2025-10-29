const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Planning', 'In Progress', 'Completed'], 
    default: 'Planning' 
  },
  dueDate: { type: String, default: 'TBD' },
  collaborators: [{ type: String }], // Array of initials like ['JD', 'SM']
  color: { type: String, default: '#F9F9F9' },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
