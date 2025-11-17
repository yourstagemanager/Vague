import { useState } from 'react';
import '../styles/windows98.css';

const ERROR_MESSAGES = [
  "Well, this is awkward. You typed in a URL that doesn't exist.",
  "404. That means YOU went to the wrong place. Not us. You.",
  "Congratulations! You've successfully navigated to nowhere.",
  "This page doesn't exist. But you already knew that, didn't you?",
  "Error 404: Page Not Found. Error 418: User Error Detected.",
  "The page you're looking for is in another castle. Or doesn't exist. Probably the second one.",
];

const EXPLANATIONS = [
  "Look, I don't make the pages. I just tell you when you mess up finding them.",
  "Maybe check your spelling? Just a thought.",
  "This is usually the part where I'd help you. But where's the fun in that?",
  "You could try going back. Or you could stay here. I don't really care either way.",
  "Have you considered that maybe you didn't actually want to go to this page?",
  "The URL you entered is wrong. But you probably already figured that out.",
];

const SUGGESTIONS = [
  "Try the home page. It's probably there. Somewhere.",
  "Check the URL. Did you spell something wrong? You probably did.",
  "Click the back button. You know, the arrow. Top left. You'll figure it out.",
  "Maybe this is a sign that you should take a break from the internet.",
  "Have you tried turning your computer off and on again? Won't help, but worth a shot.",
  "The answer you seek is not here. It never was.",
];

function NotFound() {
  const [errorMessage] = useState(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
  const [explanation] = useState(EXPLANATIONS[Math.floor(Math.random() * EXPLANATIONS.length)]);
  const [suggestion] = useState(SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]);
  const [clickCount, setClickCount] = useState(0);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleRefresh = () => {
    setClickCount(prev => prev + 1);
    if (clickCount === 0) {
      alert("Did you really think clicking refresh would make the page appear? Optimistic.");
    } else if (clickCount === 1) {
      alert("Still doesn't exist. But sure, keep trying.");
    } else if (clickCount === 2) {
      alert("OK, this is just sad now.");
    } else {
      alert("I admire your persistence. It's misguided, but admirable.");
    }
  };

  const handleHelp = () => {
    alert("Help? You want help?\n\nFine. Here's some help:\n\n1. The page doesn't exist\n2. It's probably your fault\n3. Go back to the home page\n4. Try not to mess it up this time\n\nYou're welcome.");
  };

  return (
    <div className="window" style={{ marginTop: '50px' }}>
      <div className="title-bar">
        <div className="title-bar-text">
          ⚠️ Error - Not Found
        </div>
        <div className="title-bar-controls">
          <button className="title-bar-button" onClick={() => alert("Minimizing an error won't make it go away.")}>_</button>
          <button className="title-bar-button" onClick={() => alert("Already maximum error.")}>□</button>
          <button className="title-bar-button" onClick={handleHomeClick}>×</button>
        </div>
      </div>

      <div className="window-body">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#808080',
            marginBottom: '20px',
            fontFamily: 'MS Sans Serif, sans-serif'
          }}>
            404
          </div>

          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#000080'
          }}>
            {errorMessage}
          </div>

          <div className="separator" style={{ margin: '20px 40px' }}></div>

          <div style={{
            fontSize: '14px',
            marginBottom: '15px',
            color: '#000',
            lineHeight: '1.6'
          }}>
            {explanation}
          </div>

          <div style={{
            fontSize: '13px',
            color: '#666',
            fontStyle: 'italic',
            marginBottom: '30px'
          }}>
            💡 Suggestion: {suggestion}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="win98-button" onClick={handleHomeClick}>
              🏠 Go Home
            </button>
            <button className="win98-button" onClick={handleRefresh}>
              🔄 Refresh (Won't Help)
            </button>
            <button className="win98-button" onClick={handleHelp}>
              ❓ Help
            </button>
            <button className="win98-button" onClick={() => window.history.back()}>
              ⬅️ Go Back
            </button>
          </div>

          <div className="separator" style={{ margin: '30px 40px' }}></div>

          <div style={{
            fontSize: '11px',
            color: '#999',
            marginTop: '20px'
          }}>
            <div>Error Code: 404 (Page Not Found)</div>
            <div>Blame: User (That's You)</div>
            <div>Fix ETA: When you learn to type URLs correctly</div>
            <div style={{ marginTop: '15px', fontStyle: 'italic' }}>
              "Maybe the page you're looking for is the friends we made along the way."<br />
              - Ancient Proverb (That I Just Made Up)
            </div>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-bar-field">
          Error 404: User navigated to wrong page
        </div>
        <div className="status-bar-field" style={{ flex: '0 0 120px' }}>
          Status: Your Fault
        </div>
      </div>
    </div>
  );
}

export default NotFound;
