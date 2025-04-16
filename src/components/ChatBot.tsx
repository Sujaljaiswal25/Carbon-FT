import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, I could not reach the server.' }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <>
      {!open && (
        <button className="chatbot-fab" onClick={() => setOpen(true)} aria-label="Open chatbot">
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
      {open && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <span className="chatbot-avatar">🤖</span>
            <span className="chatbot-title">CarbonFT Bot</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message chatbot-message-${msg.sender}`}>{msg.text}</div>
            ))}
            {loading && <div className="chatbot-message chatbot-message-bot chatbot-typing">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={sendMessage}>
            <input
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              autoFocus
            />
            <button className="chatbot-send-btn" type="submit" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
