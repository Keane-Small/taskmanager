import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiBell, FiCheck, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const NotificationContainer = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  svg {
    width: 22px;
    height: 22px;
    color: #000;
  }
`;

const Badge = styled(motion.div)`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff4444;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  padding: 0 5px;
  box-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
`;

const DropdownTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }
`;

const NotificationList = styled.div`
  overflow-y: auto;
  max-height: 400px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const NotificationItem = styled(motion.div)`
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  background-color: ${props => props.$isRead ? 'white' : '#f0f7ff'};

  &:hover {
    background-color: ${props => props.$isRead ? '#fafafa' : '#e6f2ff'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const NotificationIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$priority) {
      case 'urgent': return 'rgba(255, 68, 68, 0.1)';
      case 'high': return 'rgba(255, 152, 0, 0.1)';
      case 'medium': return 'rgba(33, 150, 243, 0.1)';
      default: return 'rgba(0, 0, 0, 0.05)';
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 'urgent': return '#ff4444';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      default: return '#666';
    }
  }};
`;

const NotificationDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriorityBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$priority) {
      case 'urgent': return '#ff4444';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      default: return '#999';
    }
  }};
  color: white;
`;

const NotificationMessage = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: #999;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const getNotificationIcon = (type) => {
  const icons = {
    task_assigned: '📋',
    task_completed: '✅',
    task_overdue: '⚠️',
    task_due_soon: '⏰',
    task_commented: '💬',
    project_created: '🎉',
    project_updated: '📝',
    collaborator_added: '👋',
    mention: '👤',
    deadline_approaching: '📅',
    system: '🔔'
  };
  return icons[type] || '🔔';
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log('Received new notification:', notification);
      
      // Add new notification to the top of the list
      setNotifications(prev => [notification, ...prev]);
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (!notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <NotificationContainer ref={dropdownRef}>
      <BellButton onClick={() => setIsOpen(!isOpen)}>
        <FiBell />
        {unreadCount > 0 && (
          <Badge
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </BellButton>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownHeader>
              <DropdownTitle>Notifications</DropdownTitle>
              {unreadCount > 0 && (
                <HeaderActions>
                  <HeaderButton onClick={markAllAsRead}>
                    <FiCheckCircle size={14} />
                    Mark all read
                  </HeaderButton>
                </HeaderActions>
              )}
            </DropdownHeader>

            <NotificationList>
              {notifications.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🔔</EmptyIcon>
                  <EmptyText>No notifications yet</EmptyText>
                </EmptyState>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    $isRead={notification.isRead}
                    onClick={() => handleNotificationClick(notification)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <NotificationContent>
                      <NotificationIcon $priority={notification.priority}>
                        {getNotificationIcon(notification.type)}
                      </NotificationIcon>
                      <NotificationDetails>
                        <NotificationTitle>
                          {notification.title}
                          {notification.priority === 'urgent' && (
                            <PriorityBadge $priority="urgent">Urgent</PriorityBadge>
                          )}
                        </NotificationTitle>
                        <NotificationMessage>
                          {notification.message}
                        </NotificationMessage>
                        <NotificationTime>
                          {formatTime(notification.createdAt)}
                        </NotificationTime>
                        <NotificationActions>
                          {!notification.isRead && (
                            <ActionButton onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}>
                              <FiCheck size={12} />
                              Mark read
                            </ActionButton>
                          )}
                          <ActionButton onClick={(e) => deleteNotification(notification._id, e)}>
                            <FiTrash2 size={12} />
                            Delete
                          </ActionButton>
                        </NotificationActions>
                      </NotificationDetails>
                    </NotificationContent>
                  </NotificationItem>
                ))
              )}
            </NotificationList>
          </Dropdown>
        )}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default NotificationCenter;
