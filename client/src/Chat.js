import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:3001');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userJoined', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message, type: 'system' }]);
    });

    socket.on('userLeft', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message, type: 'system' }]);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsUsernameSet(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('sendMessage', inputMessage);
      setInputMessage('');
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="chat-container">
        <div className="username-form">
          <h2>Welcome to Chat</h2>
          <form onSubmit={handleSetUsername}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
        <span className="username-display">Logged in as: {username}</span>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type === 'system' ? 'system-message' : msg.username === username ? 'own-message' : 'other-message'}`}
          >
            {msg.type !== 'system' && <strong>{msg.username}: </strong>}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;