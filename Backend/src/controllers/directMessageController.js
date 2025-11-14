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
    })
    .populate('sender', 'name email')
    .populate('recipient', 'name email')
    .sort({ timestamp: 1 });
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

// Mark messages as read
exports.markAsRead = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    // Mark all messages from userId2 to userId1 as read
    await DirectMessage.updateMany(
      { sender: userId2, recipient: userId1, read: false },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  const { userId } = req.params;
  try {
    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ count: 0 });
    }

    const count = await DirectMessage.countDocuments({
      recipient: userId,
      $or: [
        { read: false },
        { read: { $exists: false } }
      ]
    });
    res.json({ count: count || 0 });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.json({ count: 0 }); // Return 0 instead of error to prevent frontend issues
  }
};
