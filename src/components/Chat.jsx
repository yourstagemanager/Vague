import { useState, useEffect, useRef } from 'react';
import { generateResponse, resetConversation, THEMES, getCurrentTheme } from '../utils/conversationEngine';
import '../styles/windows98.css';
import '../styles/strongbad.css';
import '../styles/eager.css';

// Easter egg threshold - messages longer than this trigger Strong Bad email mode
const SBEMAIL_THRESHOLD = 150;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(THEMES.LAZY_ASSISTANT);
  const [showThemeChangeAlert, setShowThemeChangeAlert] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update body class when theme changes
  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('theme-strong-bad', 'theme-eager');

    // Add current theme class
    if (currentTheme === THEMES.STRONG_BAD) {
      document.body.classList.add('theme-strong-bad');
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      document.body.classList.add('theme-eager');
    }
  }, [currentTheme]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Check for Strong Bad email easter egg (long messages)
    const isLongMessage = inputValue.length > SBEMAIL_THRESHOLD;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      isEmail: isLongMessage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay (because a lazy assistant wouldn't respond instantly)
    // Longer delay for Strong Bad emails
    const baseDelay = isLongMessage ? 2000 : 800;
    const delay = Math.random() * 1000 + baseDelay;

    setTimeout(() => {
      const responseData = generateResponse(currentInput);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: responseData.text,
        theme: responseData.theme,
        isEmail: isLongMessage,
        screenshot: responseData.screenshot,
        showScreenshot: responseData.showScreenshot
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Update theme if it changed
      if (responseData.themeChanged) {
        setCurrentTheme(responseData.theme);
        setShowThemeChangeAlert(true);
        setTimeout(() => setShowThemeChangeAlert(false), 3000);
      } else if (isLongMessage && responseData.theme === THEMES.STRONG_BAD) {
        // Easter egg triggered!
        setCurrentTheme(THEMES.STRONG_BAD);
      }
    }, delay);
  };

  const handleReset = () => {
    setMessages([]);
    resetConversation();
    setInputValue('');
    setIsTyping(false);
    setCurrentTheme(THEMES.LAZY_ASSISTANT);
  };

  const handleMinimize = () => {
    if (currentTheme === THEMES.STRONG_BAD) {
      alert("Minimize? What is this, Windows? DELETED!");
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      alert("Oh! You want to minimize? Sure! I can help with that! Just kidding, this doesn't work! 😊");
    } else {
      alert("Nice try, but minimizing doesn't actually do anything here.");
    }
  };

  const handleMaximize = () => {
    if (currentTheme === THEMES.STRONG_BAD) {
      alert("This window is already MAXIMUM STRONG BAD.");
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      alert("MAXIMUM HELPFULNESS ACHIEVED! ✨ (The window is already as big as it gets!)");
    } else {
      alert("This window is already at maximum disappointment.");
    }
  };

  const handleClose = () => {
    let message;
    if (currentTheme === THEMES.STRONG_BAD) {
      message = "Leave? FINE. I didn't want to answer your stupid questions anyway!";
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      message = "Oh no! Are you sure you want to leave? I was having so much fun helping you! Please don't go! 🥺";
    } else {
      message = "Are you sure? I was just starting to not help you.";
    }

    const shouldClose = window.confirm(message);
    if (shouldClose) {
      window.location.reload();
    }
  };

  const handleAbout = () => {
    if (currentTheme === THEMES.STRONG_BAD) {
      alert("Strong Bad Email Answering System v2.0\n\nPowered by the Compy 386\n(Actually it's a crappy web browser but whatever)\n\n© 2001 Strong Bad Industries\nAll rights reserved. Especially the right to DELETED!");
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      alert("✨ Eager Assistant Pro™ ✨\nVersion 3.14.159\n\nPowered by ENTHUSIASM and DETERMINATION!\n\n🎉 Ready to help with ANYTHING! 🎉\n\n© 2024 HelpfulBot Technologies Inc.\nCommitted to Excellence in Assistance!\n\n(Results may vary. Memory not guaranteed.)");
    } else {
      alert("Lazy Assistant v0.98\nBuild 19981231\n\n© 1998 Unhelpful Software Inc.\nAll rights reserved. Not that we care.");
    }
  };

  const handleHelp = () => {
    if (currentTheme === THEMES.STRONG_BAD) {
      alert("HELP? You want HELP?\n\nFine. Here's some help:\n1. Type your stupid question\n2. Hit Send\n3. Get a sarcastic answer\n4. Deal with it\n\nPS - Don't send me any long-winded emails. Oh wait, too late.");
    } else if (currentTheme === THEMES.EAGER_ASSISTANT) {
      alert("🌟 HELP MENU 🌟\n\nI'm SO EXCITED to help you!\n\nHere's how it works:\n1. Ask me ANYTHING!\n2. I'll ask clarifying questions!\n3. We'll develop a COMPREHENSIVE plan!\n4. AMAZING results! ✨\n\nLet's do this!");
    } else {
      alert("Help? That's rich. You're on your own.");
    }
  };

  const isStrongBad = currentTheme === THEMES.STRONG_BAD;
  const isEager = currentTheme === THEMES.EAGER_ASSISTANT;
  const themeClass = isStrongBad ? 'strong-bad-theme' : (isEager ? 'eager-theme' : '');

  const getTitle = () => {
    if (isStrongBad) {
      return "📧 COMPY 386 - SBEMAIL SYSTEM";
    }
    if (isEager) {
      return "✨ Eager Assistant - Ready to Help!";
    }
    return "🤖 Lazy Assistant - Personal Helper v0.98";
  };

  const getStatusText = () => {
    if (isStrongBad) {
      return "READY TO ANSWER EMAILS (UNFORTUNATELY)";
    }
    if (isEager) {
      return "🎉 Ready and Excited to Assist!";
    }
    return "Ready. Sort of.";
  };

  const getEmptyStateMessage = () => {
    if (isStrongBad) {
      return (
        <div className={`empty-state ${themeClass}`}>
          &gt;&gt; STRONG BAD EMAIL SYSTEM &lt;&lt;<br />
          <br />
          SEND ME YOUR QUESTIONS<br />
          (BUT MAKE THEM GOOD OR I'LL DELETE THEM)<br />
          <br />
          <small>COMPY 386 - 256K RAM - 1998</small>
        </div>
      );
    }

    if (isEager) {
      return (
        <div className={`empty-state ${themeClass}`}>
          <strong>Welcome! 🎉</strong><br />
          <br />
          I'm your Eager Assistant and I'm<br />
          SO EXCITED to help you today!<br />
          <br />
          Ask me anything and let's get started! ✨<br />
          <br />
          <small>Powered by Enthusiasm™</small>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className={`window ${themeClass}`}>
      <div className={`title-bar ${themeClass}`}>
        <div className={`title-bar-text ${themeClass}`}>
          <span>{getTitle()}</span>
        </div>
        <div className="title-bar-controls">
          <button className="title-bar-button" onClick={handleMinimize}>_</button>
          <button className="title-bar-button" onClick={handleMaximize}>□</button>
          <button className="title-bar-button" onClick={handleClose}>×</button>
        </div>
      </div>

      {showThemeChangeAlert && (
        <div style={{
          background: isStrongBad ? '#ff6600' : (isEager ? '#4CAF50' : '#ffeb3b'),
          color: '#000',
          padding: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          animation: 'blink 0.5s infinite'
        }}>
          {isStrongBad ? "⚠️ ENTERING STRONG BAD MODE ⚠️" : (isEager ? "✨ ENTERING EAGER MODE ✨" : "⚠️ RETURNING TO LAZY MODE ⚠️")}
        </div>
      )}

      <div className={`window-body ${themeClass}`}>
        <div className={`field-group ${themeClass}`}>
          <div className={`field-group-title ${themeClass}`}>
            {isStrongBad ? ">> EMAILS <<" : (isEager ? "💬 Let's Chat!" : "💬 Chat Session")}
          </div>

          <div className={`win98-scrollable ${themeClass}`} style={{ height: '400px', marginBottom: '8px' }}>
            {messages.length === 0 && getEmptyStateMessage()}

            {messages.map((message) => {
              // Special rendering for Strong Bad emails
              if (message.isEmail && message.type === 'user' && isStrongBad) {
                return (
                  <div key={message.id} className="email-header">
                    <div className="email-from">FROM: Some Emailer</div>
                    <div className="email-subject">SUBJECT: {message.text.substring(0, 50)}...</div>
                    <div className="email-body">{message.text}</div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`message ${message.type === 'user' ? 'message-user' : 'message-assistant'} ${themeClass}`}
                >
                  <div className={`message-label ${themeClass}`}>
                    {message.type === 'user'
                      ? (isStrongBad ? '📧 EMAILER' : (isEager ? '😊 You' : '👤 You'))
                      : (isStrongBad ? '💪 STRONG BAD' : (isEager ? '✨ Eager Assistant' : '🤖 Lazy Assistant'))
                    }
                  </div>
                  <div className={`message-text ${themeClass}`}>{message.text}</div>

                  {/* Render fake screenshot for Eager Assistant gaslighting */}
                  {message.showScreenshot && message.screenshot && (
                    <div className="fake-screenshot">
                      <div className="screenshot-header">
                        📸 Conversation Archive - Recovered from logs
                      </div>
                      <div className="screenshot-content">
                        <div className="screenshot-question">
                          <strong>Assistant:</strong> "{message.screenshot.manipulatedQuestion}"
                        </div>
                        <div className="screenshot-answer">
                          <strong>You:</strong> "{message.screenshot.userAnswer}"
                        </div>
                      </div>
                      <div className="screenshot-footer">
                        Timestamp: {message.screenshot.timestamp} | Source: System Logs
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className={`message message-assistant ${themeClass}`}>
                <div className={`message-label ${themeClass}`}>
                  {isStrongBad ? '💪 STRONG BAD' : (isEager ? '✨ Eager Assistant' : '🤖 Lazy Assistant')}
                </div>
                <div className={`message-text ${themeClass}`}>
                  <span className={`loading ${themeClass}`}>
                    {isStrongBad ? "::typing::" : (isEager ? "Analyzing your request..." : "Typing... slowly...")}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              className={`win98-input ${themeClass}`}
              placeholder={isStrongBad ? "type your email here genius..." : (isEager ? "Ask me anything! I'm so excited to help! ✨" : "Type your question here... if you must")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className={`win98-button ${themeClass}`}
              disabled={isTyping || !inputValue.trim()}
            >
              {isStrongBad ? "SEND" : (isEager ? "Send 💬" : "Send")}
            </button>
          </form>
          {inputValue.length > SBEMAIL_THRESHOLD && !isStrongBad && (
            <div style={{
              fontSize: '10px',
              color: '#ff6600',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              ⚠️ Long message detected. Easter egg incoming...
            </div>
          )}
        </div>

        <div className={`separator ${themeClass}`}></div>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
          <button className={`win98-button ${themeClass}`} onClick={handleReset}>
            {isStrongBad ? "🔄 NEW" : (isEager ? "🔄 Start Fresh!" : "🔄 New Chat")}
          </button>
          <button className={`win98-button ${themeClass}`} onClick={handleHelp}>
            {isStrongBad ? "❓ HELP" : (isEager ? "❓ Need Help?" : "❓ Help")}
          </button>
          <button className={`win98-button ${themeClass}`} onClick={handleAbout}>
            {isStrongBad ? "ℹ️ ABOUT" : (isEager ? "ℹ️ About Us" : "ℹ️ About")}
          </button>
        </div>
      </div>

      <div className={`status-bar ${themeClass}`}>
        <div className={`status-bar-field ${themeClass}`}>
          {getStatusText()}
        </div>
        <div className={`status-bar-field ${themeClass}`} style={{ flex: '0 0 100px' }}>
          {isStrongBad ? `EMAILS: ${messages.length}` : (isEager ? `Chats: ${messages.length}` : `Messages: ${messages.length}`)}
        </div>
      </div>
    </div>
  );
}

export default Chat;
