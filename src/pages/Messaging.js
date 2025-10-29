
import React, { useState } from 'react';
import MessageSidebar from './MessageSidebar';
import ChatWindow from './ChatWindow';
import './Messaging.css';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'George Paul', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', lastMessage: 'Hey Ergas! 👋 How is...', lastDate: '08 Jan', status: 'Online' },
  { id: 2, name: 'Zaire Siphron', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', lastMessage: 'I can help 👍', lastDate: '06 Jan' },
  { id: 3, name: 'Giana Press', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', lastMessage: 'I have a new project! ✨', lastDate: '06 Jan' },
  // ...add more users
];
const mockGroups = [
  { id: 101, name: 'Task: Website Redesign', lastMessage: 'Let’s meet at 3pm', lastDate: '07 Jan', type: 'group' },
  // ...add more groups
];
const mockMessages = {
  'user-1': [
    { senderId: 1, text: 'Hey Ergas! 👋 How is going?' },
    { senderId: 0, text: 'Hey George👋 Thanks!' },
    { senderId: 1, text: 'I saw your references. They are very good!' },
  ],
  'group-101': [
    { senderId: 2, text: 'Let’s meet at 3pm' },
    { senderId: 0, text: 'Works for me!' },
  ],
};

const currentUser = { id: 0, name: 'You', avatar: 'https://randomuser.me/api/portraits/men/99.jpg' };

const Messaging = () => {
  const [users, setUsers] = useState(mockUsers);
  const [groups, setGroups] = useState(mockGroups);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);

  const handleSelectChat = (chat, type) => {
    setSelectedChat({ ...chat, type });
  };

  const handleSendMessage = (text) => {
    if (!selectedChat) return;
    const key = `${selectedChat.type}-${selectedChat.id}`;
    setMessages(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { senderId: currentUser.id, text }],
    }));
  };

  const handleSearch = (value) => {
    setUsers(
      mockUsers.filter(u => u.name.toLowerCase().includes(value.toLowerCase()))
    );
    setGroups(
      mockGroups.filter(g => g.name.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const chatKey = selectedChat ? `${selectedChat.type}-${selectedChat.id}` : null;

  return (
    <div className="messaging-container">
      <MessageSidebar
        users={users}
        groups={groups}
        onSelectChat={handleSelectChat}
        selectedChat={selectedChat}
        onSearch={handleSearch}
      />
      <ChatWindow
        chat={selectedChat}
        messages={chatKey ? messages[chatKey] || [] : []}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Messaging;
