import { useState } from 'react';
import '../styles/scantron.css';

/**
 * ScantronKeyboard - An on-screen keyboard styled like a Scantron answer sheet
 * Users click on letter bubbles to type their message
 */
function ScantronKeyboard({ onSubmit, onClose, inline = false }) {
  const [inputText, setInputText] = useState('');

  // Scantron-style keyboard layout (A-Z arranged in rows like a test form)
  const keyboardRows = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ']
  ];

  const handleLetterClick = (letter) => {
    setInputText(prev => prev + letter);
  };

  const handleBackspace = () => {
    setInputText(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText('');
    }
  };

  // Inline mode - render without overlay
  if (inline) {
    return (
      <div className="scantron-keyboard-container-inline">
        <div className="scantron-keyboard-header">
          <h3>📝 FILL IN YOUR RESPONSE</h3>
          <p>Use #2 pencil to select letters by filling in bubbles completely</p>
        </div>

        <div className="scantron-keyboard-display">
          <div className="scantron-display-label">YOUR RESPONSE:</div>
          <div className="scantron-display-text">
            {inputText || '(Click bubbles to fill in letters)'}
          </div>
        </div>

        <div className="scantron-keyboard-grid">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="scantron-keyboard-row">
              {row.map((letter, index) => (
                <button
                  key={index}
                  className="scantron-keyboard-bubble"
                  onClick={() => handleLetterClick(letter)}
                  title={`Fill in ${letter === ' ' ? 'SPACE' : letter}`}
                >
                  <div className="bubble-letter">{letter === ' ' ? 'SPC' : letter}</div>
                  <div className="bubble-circle"></div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="scantron-keyboard-actions">
          <button
            className="scantron-action-button scantron-backspace"
            onClick={handleBackspace}
            disabled={!inputText}
          >
            ⌫ ERASE
          </button>
          <button
            className="scantron-action-button scantron-submit"
            onClick={handleSubmit}
            disabled={!inputText.trim()}
          >
            ✓ SUBMIT FORM
          </button>
        </div>

        <div className="scantron-keyboard-warning">
          ⚠️ WARNING: Stray marks may cause scanning errors
        </div>
      </div>
    );
  }

  // Overlay mode - original implementation
  return (
    <div className="scantron-keyboard-overlay">
      <div className="scantron-keyboard-container">
          <div className="scantron-display-label">YOUR RESPONSE:</div>
          <div className="scantron-display-text">
            {inputText || '(Click bubbles to fill in letters)'}
          </div>
        </div>

        <div className="scantron-keyboard-grid">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="scantron-keyboard-row">
              {row.map((letter, index) => (
                <button
                  key={index}
                  className="scantron-keyboard-bubble"
                  onClick={() => handleLetterClick(letter)}
                  title={`Fill in ${letter === ' ' ? 'SPACE' : letter}`}
                >
                  <div className="bubble-letter">{letter === ' ' ? 'SPC' : letter}</div>
                  <div className="bubble-circle"></div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="scantron-keyboard-actions">
          <button
            className="scantron-action-button scantron-backspace"
            onClick={handleBackspace}
            disabled={!inputText}
          >
            ⌫ ERASE
          </button>
          <button
            className="scantron-action-button scantron-submit"
            onClick={handleSubmit}
            disabled={!inputText.trim()}
          >
            ✓ SUBMIT FORM
          </button>
        </div>

        <div className="scantron-keyboard-warning">
          ⚠️ WARNING: Stray marks may cause scanning errors
        </div>
      </div>
    </div>
  );
}

export default ScantronKeyboard;
