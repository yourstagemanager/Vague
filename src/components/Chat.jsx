import { useState, useEffect, useRef } from 'react';
import { generateResponse, resetConversation } from '../utils/conversationEngine';
import '../styles/windows98.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay (because a lazy assistant wouldn't respond instantly)
    const delay = Math.random() * 1000 + 800; // 800-1800ms delay

    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleReset = () => {
    setMessages([]);
    resetConversation();
    setInputValue('');
    setIsTyping(false);
  };

  const handleMinimize = () => {
    alert("Nice try, but minimizing doesn't actually do anything here.");
  };

  const handleMaximize = () => {
    alert("This window is already at maximum disappointment.");
  };

  const handleClose = () => {
    const shouldClose = window.confirm("Are you sure? I was just starting to not help you.");
    if (shouldClose) {
      window.location.reload();
    }
  };

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">
          <span>🤖</span>
          <span>Lazy Assistant - Personal Helper v0.98</span>
        </div>
        <div className="title-bar-controls">
          <button className="title-bar-button" onClick={handleMinimize}>_</button>
          <button className="title-bar-button" onClick={handleMaximize}>□</button>
          <button className="title-bar-button" onClick={handleClose}>×</button>
        </div>
      </div>

      <div className="window-body">
        <div className="field-group">
          <div className="field-group-title">💬 Chat Session</div>

          <div className="win98-scrollable" style={{ height: '400px', marginBottom: '8px' }}>
            {messages.length === 0 && (
              <div style={{
                color: '#808080',
                textAlign: 'center',
                padding: '20px',
                fontStyle: 'italic'
              }}>
                Welcome to Lazy Assistant™<br />
                Ask me anything... or don't. Whatever.<br />
                <br />
                <small>© 1998 Unhelpful Software Inc.</small>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                <div className="message-label">
                  {message.type === 'user' ? '👤 You' : '🤖 Lazy Assistant'}
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="message message-assistant">
                <div className="message-label">🤖 Lazy Assistant</div>
                <div className="message-text">
                  <span className="loading">Typing... slowly...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              className="win98-input"
              placeholder="Type your question here... if you must"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="win98-button"
              disabled={isTyping || !inputValue.trim()}
            >
              Send
            </button>
          </form>
        </div>

        <div className="separator"></div>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
          <button className="win98-button" onClick={handleReset}>
            🔄 New Chat
          </button>
          <button className="win98-button" onClick={() => alert("Help? That's rich. You're on your own.")}>
            ❓ Help
          </button>
          <button className="win98-button" onClick={() => alert("Lazy Assistant v0.98\nBuild 19981231\n\n© 1998 Unhelpful Software Inc.\nAll rights reserved. Not that we care.")}>
            ℹ️ About
          </button>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-bar-field">
          Ready. Sort of.
        </div>
        <div className="status-bar-field" style={{ flex: '0 0 100px' }}>
          Messages: {messages.length}
        </div>
      </div>
    </div>
  );
}

export default Chat;
