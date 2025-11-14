import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const socketUrl = API_URL.replace('/api', '');
    
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      
      // Register user with their ID
      if (user._id || user.id) {
        newSocket.emit('user:register', user._id || user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Online users events
    newSocket.on('users:online-list', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    });

    newSocket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Helper function to send notifications
  const sendNotification = useCallback((recipientId, notification) => {
    if (socket && isConnected) {
      socket.emit('notification:send', { recipientId, notification });
    }
  }, [socket, isConnected]);

  // Helper function to send messages
  const sendMessage = useCallback((recipientId, message) => {
    if (socket && isConnected) {
      socket.emit('message:send', { recipientId, message });
    }
  }, [socket, isConnected]);

  // Helper function to send direct messages
  const sendDirectMessage = useCallback((recipientId, message) => {
    if (socket && isConnected) {
      socket.emit('direct-message:send', { recipientId, message });
    }
  }, [socket, isConnected]);

  // Helper function to broadcast project updates
  const broadcastProjectUpdate = useCallback((projectId, update) => {
    if (socket && isConnected) {
      socket.emit('project:update', { projectId, update });
    }
  }, [socket, isConnected]);

  // Helper function to broadcast task updates
  const broadcastTaskUpdate = useCallback((taskId, projectId, update) => {
    if (socket && isConnected) {
      socket.emit('task:update', { taskId, projectId, update });
    }
  }, [socket, isConnected]);

  // Typing indicators
  const startTyping = useCallback((recipientId) => {
    if (socket && isConnected && (user._id || user.id)) {
      socket.emit('typing:start', { recipientId, senderId: user._id || user.id });
    }
  }, [socket, isConnected, user]);

  const stopTyping = useCallback((recipientId) => {
    if (socket && isConnected && (user._id || user.id)) {
      socket.emit('typing:stop', { recipientId, senderId: user._id || user.id });
    }
  }, [socket, isConnected, user]);

  // Subscribe to events
  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  // Unsubscribe from events
  const off = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    sendNotification,
    sendMessage,
    sendDirectMessage,
    broadcastProjectUpdate,
    broadcastTaskUpdate,
    startTyping,
    stopTyping,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
