const express = require('express');
const { Message, DirectMessage } = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all direct message conversations for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all users the current user has messaged with
    const sentMessages = await DirectMessage.find({ senderId: req.userId })
      .distinct('recipientId');
    const receivedMessages = await DirectMessage.find({ recipientId: req.userId })
      .distinct('senderId');
    
    const allUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get user details and last message for each conversation
    const conversations = await Promise.all(
      allUserIds.map(async (userId) => {
        const user = await User.findById(userId).select('name email profilePicture');
        const lastMessage = await DirectMessage.findOne({
          $or: [
            { senderId: req.userId, recipientId: userId },
            { senderId: userId, recipientId: req.userId }
          ]
        }).sort({ createdAt: -1 });
        
        const unreadCount = await DirectMessage.countDocuments({
          senderId: userId,
          recipientId: req.userId,
          read: false
        });
        
        return {
          user,
          lastMessage,
          unreadCount
        };
      })
    );
    
    // Sort by most recent message
    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return dateB - dateA;
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get direct messages with a specific user
router.get('/direct/:userId', auth, async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      $or: [
        { senderId: req.userId, recipientId: req.params.userId },
        { senderId: req.params.userId, recipientId: req.userId }
      ]
    })
    .populate('senderId', 'name email profilePicture')
    .sort({ createdAt: 1 });
    
    // Mark messages as read
    await DirectMessage.updateMany(
      { senderId: req.params.userId, recipientId: req.userId, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a direct message
router.post('/direct', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const message = new DirectMessage({
      senderId: req.userId,
      recipientId,
      content: content.trim()
    });
    
    await message.save();
    
    const populatedMessage = await DirectMessage.findById(message._id)
      .populate('senderId', 'name email profilePicture');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send direct message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project messages
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate('senderId', 'name email profilePicture')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a project message
router.post('/project', auth, async (req, res) => {
  try {
    const { projectId, content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const message = new Message({
      senderId: req.userId,
      projectId,
      content: content.trim()
    });
    
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email profilePicture');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send project message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users for starting a new conversation
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('name email profilePicture')
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
