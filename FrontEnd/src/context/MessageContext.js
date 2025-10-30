import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchUnreadCount();
      // Poll for new messages every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const currentUserId = user?._id || user?.id;
      if (!currentUserId) return;

      const response = await fetch(`${API_URL}/direct-messages/unread/${currentUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (otherUserId) => {
    try {
      const currentUserId = user?._id || user?.id;
      if (!currentUserId || !otherUserId) return;

      await fetch(`${API_URL}/direct-messages/read/${currentUserId}/${otherUserId}`, {
        method: 'PUT',
      });

      // Refresh the unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const value = {
    unreadCount,
    fetchUnreadCount,
    markAsRead,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
