import React, { useRef, useEffect } from 'react';
import './Messaging.css';

const ChatWindow = ({ chat, messages, onSendMessage, currentUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [input, setInput] = React.useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  if (!chat) {
    return <div className="chat-window empty">Select a chat to start messaging</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {chat.type === 'user' ? (
          <>
            <img src={chat.avatar} alt={chat.name} className="avatar" />
            <div>
              <div className="chat-title">{chat.name}</div>
              <div className="chat-status">{chat.status || 'Offline'}</div>
            </div>
          </>
        ) : (
          <>
            <div className="group-avatar">👥</div>
            <div>
              <div className="chat-title">{chat.name}</div>
              <div className="chat-status">Group Chat</div>
            </div>
          </>
        )}
      </div>
      <div className="messages-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble${msg.senderId === currentUser.id ? ' sent' : ' received'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-row" onSubmit={handleSend}>
        <input
          className="message-input"
          type="text"
          placeholder="Message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="send-btn" type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
