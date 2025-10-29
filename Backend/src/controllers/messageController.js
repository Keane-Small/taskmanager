const Message = require('../models/Message');

// Get all messages for a project
exports.getProjectMessages = async (req, res) => {
  const { projectId } = req.params;
  try {
    const messages = await Message.find({ project: projectId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message to a project
exports.sendProjectMessage = async (req, res) => {
  const { sender, project, content } = req.body;
  try {
    const message = new Message({ sender, project, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
