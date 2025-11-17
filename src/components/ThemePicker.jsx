import '../styles/windows98.css';

/**
 * ThemePicker - Developer backdoor for testing themes
 * Triggered by typing "Show me what you got" in any theme
 */
function ThemePicker({ onSelectTheme, onClose }) {
  const themes = [
    {
      id: 'lazy',
      name: 'Lazy Assistant',
      icon: '🤖',
      description: 'Vague and unhelpful (default)',
      color: '#808080'
    },
    {
      id: 'strongbad',
      name: 'Strong Bad',
      icon: '💪',
      description: 'Compy 386 terminal',
      color: '#00ff00'
    },
    {
      id: 'eager',
      name: 'Eager Assistant',
      icon: '✨',
      description: 'Overly helpful with gaslighting',
      color: '#4CAF50'
    },
    {
      id: 'scantron',
      name: 'Scantron',
      icon: '📝',
      description: 'Standardized test form',
      color: '#0066CC'
    },
    {
      id: 'mapquest',
      name: 'MapQuest',
      icon: '🗺️',
      description: 'Early 2000s navigation',
      color: '#7AB800'
    },
    {
      id: 'myspace',
      name: 'MySpace',
      icon: '💫',
      description: 'Mid-2000s social network',
      color: '#0066CC'
    },
    {
      id: 'geocities',
      name: 'GeoCities',
      icon: '🌐',
      description: 'Late 90s web hosting',
      color: '#FF0000'
    },
    {
      id: 'mac',
      name: 'Early Mac',
      icon: '🖥️',
      description: 'System 7 / Classic Mac OS',
      color: '#DDDDDD'
    }
  ];

  return (
    <div className="theme-picker-overlay">
      <div className="theme-picker-container">
        <div className="theme-picker-header">
          <h2>🎨 Theme Selector</h2>
          <p>Choose your assistant personality</p>
          <button className="theme-picker-close" onClick={onClose}>×</button>
        </div>

        <div className="theme-picker-grid">
          {themes.map(theme => (
            <div
              key={theme.id}
              className="theme-card"
              onClick={() => onSelectTheme(theme.id)}
              style={{ borderColor: theme.color }}
            >
              <div className="theme-icon" style={{ color: theme.color }}>
                {theme.icon}
              </div>
              <div className="theme-name">{theme.name}</div>
              <div className="theme-description">{theme.description}</div>
            </div>
          ))}
        </div>

        <div className="theme-picker-footer">
          <small>💡 Tip: Type "Show me what you got" anytime to open this menu</small>
        </div>
      </div>
    </div>
  );
}

export default ThemePicker;
