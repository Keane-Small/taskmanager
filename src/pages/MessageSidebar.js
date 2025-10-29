import React from 'react';
import './Messaging.css';

const MessageSidebar = ({ users, groups, onSelectChat, selectedChat, onSearch }) => {
  return (
    <div className="message-sidebar">
      <div className="sidebar-header">
        <h3>Message</h3>
        <button className="add-btn">+</button>
      </div>
      <input
        className="search-input"
        type="text"
        placeholder="Search message..."
        onChange={e => onSearch(e.target.value)}
      />
      <div className="chat-list">
        <div className="list-section">Direct Messages</div>
        {users.map(user => (
          <div
            key={user.id}
            className={`chat-item${selectedChat?.id === user.id && selectedChat.type === 'user' ? ' selected' : ''}`}
            onClick={() => onSelectChat(user, 'user')}
          >
            <img src={user.avatar} alt={user.name} className="avatar" />
            <div className="chat-info">
              <div className="chat-name">{user.name}</div>
              <div className="chat-last">{user.lastMessage}</div>
            </div>
            <div className="chat-date">{user.lastDate}</div>
          </div>
        ))}
        <div className="list-section">Group Chats</div>
        {groups.map(group => (
          <div
            key={group.id}
            className={`chat-item${selectedChat?.id === group.id && selectedChat.type === 'group' ? ' selected' : ''}`}
            onClick={() => onSelectChat(group, 'group')}
          >
            <div className="group-avatar">👥</div>
            <div className="chat-info">
              <div className="chat-name">{group.name}</div>
              <div className="chat-last">{group.lastMessage}</div>
            </div>
            <div className="chat-date">{group.lastDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar;
