const DirectMessage = require('../models/DirectMessage');

// Get all direct messages between two users
exports.getDirectMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await DirectMessage.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a direct message
exports.sendDirectMessage = async (req, res) => {
  const { sender, recipient, content } = req.body;
  try {
    const message = new DirectMessage({ sender, recipient, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
