import { useState, useEffect, useRef } from 'react';
import { generateResponse, resetConversation, THEMES, getCurrentTheme } from '../utils/conversationEngine';
import ScantronKeyboard from './ScantronKeyboard';
import ThemePicker from './ThemePicker';
import '../styles/windows98.css';
import '../styles/strongbad.css';
import '../styles/eager.css';
import '../styles/scantron.css';
import '../styles/mapquest.css';
import '../styles/myspace.css';
import '../styles/geocities.css';
import '../styles/earlymac.css';

// Easter egg threshold - messages longer than this trigger Strong Bad email mode
const SBEMAIL_THRESHOLD = 150;

/**
 * DEVELOPER BACKDOOR: Theme Testing URLs
 *
 * Use these URLs to navigate directly to specific themes for testing:
 * - http://localhost:5150/?theme=lazy       - Lazy Assistant (default)
 * - http://localhost:5150/?theme=strongbad  - Strong Bad / Compy 386
 * - http://localhost:5150/?theme=eager      - Eager Assistant (with gaslighting)
 * - http://localhost:5150/?theme=scantron   - Scantron Test Form
 * - http://localhost:5150/?theme=mapquest   - MapQuest Navigation
 * - http://localhost:5150/?theme=myspace    - MySpace Profile
 * - http://localhost:5150/?theme=geocities  - GeoCities Website
 * - http://localhost:5150/?theme=mac        - Early Mac System 7
 */

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check for theme parameter in URL for testing
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');

    const themeMap = {
      'lazy': THEMES.LAZY_ASSISTANT,
      'strongbad': THEMES.STRONG_BAD,
      'eager': THEMES.EAGER_ASSISTANT,
      'scantron': THEMES.SCANTRON,
      'mapquest': THEMES.MAPQUEST,
      'myspace': THEMES.MYSPACE,
      'geocities': THEMES.GEOCITIES,
      'mac': THEMES.EARLY_MAC
    };

    const selectedTheme = themeMap[themeParam?.toLowerCase()] || THEMES.LAZY_ASSISTANT;

    // Log theme info for developer
    if (themeParam) {
      console.log(`%c🎨 THEME BACKDOOR ACTIVATED`, 'color: #ff6600; font-size: 16px; font-weight: bold');
      console.log(`%cLoaded theme: ${themeParam}`, 'color: #0066cc; font-size: 14px');
    } else {
      console.log(`%c🎨 Theme Testing Available`, 'color: #666; font-size: 12px');
      console.log(`%cAdd ?theme=<name> to URL. Options: lazy, strongbad, eager, scantron, mapquest, myspace, geocities, mac`, 'color: #999; font-size: 11px');
    }

    return selectedTheme;
  });
  const [showThemeChangeAlert, setShowThemeChangeAlert] = useState(false);
  const [showScantronKeyboard, setShowScantronKeyboard] = useState(false);
  const [currentMultipleChoice, setCurrentMultipleChoice] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
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
    document.body.classList.remove(
      'theme-strong-bad',
      'theme-eager',
      'theme-scantron',
      'theme-mapquest',
      'theme-myspace',
      'theme-geocities',
      'theme-early-mac'
    );

    // Add current theme class
    switch (currentTheme) {
      case THEMES.STRONG_BAD:
        document.body.classList.add('theme-strong-bad');
        break;
      case THEMES.EAGER_ASSISTANT:
        document.body.classList.add('theme-eager');
        break;
      case THEMES.SCANTRON:
        document.body.classList.add('theme-scantron');
        // Automatically show Scantron keyboard when entering theme
        if (messages.length === 0) {
          setShowScantronKeyboard(true);
        }
        break;
      case THEMES.MAPQUEST:
        document.body.classList.add('theme-mapquest');
        break;
      case THEMES.MYSPACE:
        document.body.classList.add('theme-myspace');
        break;
      case THEMES.GEOCITIES:
        document.body.classList.add('theme-geocities');
        break;
      case THEMES.EARLY_MAC:
        document.body.classList.add('theme-early-mac');
        break;
      default:
        // Lazy Assistant - no special body class needed
        break;
    }
  }, [currentTheme, messages.length]);

  const handleScantronKeyboardSubmit = (text) => {
    setShowScantronKeyboard(false);
    // Process the text as if user typed it normally
    handleMessageSubmit(text);
  };

  const handleScantronBubbleClick = (option) => {
    // If user clicked "Other", show keyboard
    if (option === 'OTHER') {
      setShowScantronKeyboard(true);
      setCurrentMultipleChoice(null);
      return;
    }

    // Otherwise, treat this as the user's answer
    handleMessageSubmit(`Selected: ${option}`);
    setCurrentMultipleChoice(null);
  };

  const handleThemeSelect = (themeId) => {
    const themeMap = {
      'lazy': THEMES.LAZY_ASSISTANT,
      'strongbad': THEMES.STRONG_BAD,
      'eager': THEMES.EAGER_ASSISTANT,
      'scantron': THEMES.SCANTRON,
      'mapquest': THEMES.MAPQUEST,
      'myspace': THEMES.MYSPACE,
      'geocities': THEMES.GEOCITIES,
      'mac': THEMES.EARLY_MAC
    };

    const newTheme = themeMap[themeId];
    if (newTheme) {
      setCurrentTheme(newTheme);
      setShowThemePicker(false);
      setShowThemeChangeAlert(true);
      setTimeout(() => setShowThemeChangeAlert(false), 3000);
      console.log(`%c🎨 Theme changed to: ${themeId}`, 'color: #00ff00; font-size: 14px; font-weight: bold');
    }
  };

  const handleMessageSubmit = (textInput) => {
    const inputText = textInput || inputValue;
    if (!inputText.trim()) return;

    // Check for theme picker backdoor
    if (inputText.toLowerCase().includes('show me what you got')) {
      setShowThemePicker(true);
      if (!textInput) setInputValue(''); // Clear input if using input field
      return;
    }

    // Check for Strong Bad email easter egg (long messages)
    const isLongMessage = inputText.length > SBEMAIL_THRESHOLD;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      isEmail: isLongMessage
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textInput) setInputValue(''); // Only clear if using input field
    setIsTyping(true);

    // Simulate typing delay (because a lazy assistant wouldn't respond instantly)
    // Longer delay for Strong Bad emails
    const baseDelay = isLongMessage ? 2000 : 800;
    const delay = Math.random() * 1000 + baseDelay;

    setTimeout(async () => {
      const responseData = await generateResponse(inputText);

      // Check if this is a Scantron response that needs special handling
      if (responseData.isScantron) {
        if (responseData.showKeyboard) {
          // Show the Scantron keyboard
          setShowScantronKeyboard(true);
          const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            text: responseData.text,
            theme: responseData.theme
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
          return;
        } else if (responseData.requiresBubbles) {
          // Show multiple choice options
          setCurrentMultipleChoice({
            question: responseData.text,
            options: responseData.bubbleOptions,
            hasOther: responseData.hasOtherOption
          });
        }
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: responseData.text,
        theme: responseData.theme,
        isEmail: isLongMessage,
        screenshot: responseData.screenshot,
        showScreenshot: responseData.showScreenshot,
        multipleChoice: responseData.requiresBubbles ? {
          options: responseData.bubbleOptions,
          hasOther: responseData.hasOtherOption
        } : null
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessageSubmit(null);
  };

  const handleReset = () => {
    setMessages([]);
    resetConversation();
    setInputValue('');
    setIsTyping(false);
    setCurrentTheme(THEMES.LAZY_ASSISTANT);
    setShowScantronKeyboard(false);
    setCurrentMultipleChoice(null);
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

  const handleEscapeTheme = () => {
    let confirmMessage;
    let cancelMessage;

    switch (currentTheme) {
      case THEMES.STRONG_BAD:
        confirmMessage = "Leaving already? Fine! Click OK to admit you can't handle the STRONG BAD experience, or Cancel to confirm you're intellectually overwhelmed.";
        cancelMessage = "Oh, you clicked Cancel? That obviously means you want to leave too. Everyone knows Cancel means 'Yes, I give up.' DELETED!";
        break;
      case THEMES.EAGER_ASSISTANT:
        confirmMessage = "Are you SURE you want to leave? 🥺\n\nClick OK to confirm you'd like to abandon our amazing conversation, or Cancel to verify that you need a break from all this helpfulness!";
        cancelMessage = "You clicked Cancel! That clearly means you DO want to take a break from my enthusiasm! I totally understand! Let's reset! ✨";
        break;
      case THEMES.SCANTRON:
        confirmMessage = "CONFIRMATION REQUIRED:\n\nClick OK to acknowledge insufficient preparation for standardized testing environment, or Cancel to confirm inability to properly fill bubbles with #2 pencil.";
        cancelMessage = "CANCEL interpreted as: 'I cannot complete this assessment.' Test terminated. Please study harder next time.";
        break;
      case THEMES.MAPQUEST:
        confirmMessage = "Are you sure you want to exit navigation?\n\nClick OK to admit you're lost and need simpler directions, or Cancel to confirm that turn-by-turn instructions exceed your cognitive capacity.";
        cancelMessage = "Cancel selected. We interpret this as: 'These directions are too complex for me.' Returning to basic interface...";
        break;
      case THEMES.MYSPACE:
        confirmMessage = "r u sure u wanna leave?? 😢\n\nclick OK 2 delete ur profile cuz u cant handle the social pressure, or Cancel 2 admit ur not cool enough 4 MySpace!! 💔";
        cancelMessage = "u clicked Cancel?? that obvs means u wanna leave 2!! like, Cancel is just another way of saying 'im not popular enough 4 this' lol bye!! 👋";
        break;
      case THEMES.GEOCITIES:
        confirmMessage = "⚠️ CONFIRM NAVIGATION EXIT ⚠️\n\nClick OK to acknowledge you lack the technical expertise to browse this GeoCities page, or Cancel to verify that HTML is beyond your comprehension.";
        cancelMessage = "CANCEL DETECTED. Translation: 'This website is too advanced for my 1999 browsing skills.' Redirecting to simpler interface...";
        break;
      case THEMES.EARLY_MAC:
        confirmMessage = "System Error -41\n\nClick OK to confirm insufficient system resources in user memory, or Cancel to acknowledge operator incompetence.\n\nNote: Both options indicate user error.";
        cancelMessage = "Cancel = Affirmative. User has confirmed inability to operate Classic Mac interface. Initiating restart sequence...";
        break;
      default:
        // Lazy assistant - straightforward
        const shouldReset = window.confirm("Reset the chat?");
        if (shouldReset) {
          handleReset();
        }
        return;
    }

    // Show confirmation dialog
    const userClickedOK = window.confirm(confirmMessage);

    if (userClickedOK) {
      // User clicked OK - reset immediately
      handleReset();
    } else {
      // User clicked Cancel - show gaslighting message then reset anyway
      alert(cancelMessage);
      handleReset();
    }
  };

  const isStrongBad = currentTheme === THEMES.STRONG_BAD;
  const isEager = currentTheme === THEMES.EAGER_ASSISTANT;
  const isScantron = currentTheme === THEMES.SCANTRON;
  const isMapQuest = currentTheme === THEMES.MAPQUEST;
  const isMySpace = currentTheme === THEMES.MYSPACE;
  const isGeoCities = currentTheme === THEMES.GEOCITIES;
  const isEarlyMac = currentTheme === THEMES.EARLY_MAC;

  const getThemeClass = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return 'strong-bad-theme';
      case THEMES.EAGER_ASSISTANT: return 'eager-theme';
      case THEMES.SCANTRON: return 'scantron-theme';
      case THEMES.MAPQUEST: return 'mapquest-theme';
      case THEMES.MYSPACE: return 'myspace-theme';
      case THEMES.GEOCITIES: return 'geocities-theme';
      case THEMES.EARLY_MAC: return 'earlymac-theme';
      default: return '';
    }
  };

  const themeClass = getThemeClass();

  const getTitle = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD:
        return "📧 COMPY 386 - SBEMAIL SYSTEM";
      case THEMES.EAGER_ASSISTANT:
        return "✨ Eager Assistant - Ready to Help!";
      case THEMES.SCANTRON:
        return "📝 STANDARDIZED TEST FORM - ANSWER SHEET";
      case THEMES.MAPQUEST:
        return "🗺️ MapQuest - Directions & Maps";
      case THEMES.MYSPACE:
        return "💫 MySpace - A Place For Friends";
      case THEMES.GEOCITIES:
        return "🌐 GeoCities - Your Home on the Web";
      case THEMES.EARLY_MAC:
        return "🖥️ System 7.5 - Assistant";
      default:
        return "🤖 Lazy Assistant - Personal Helper v0.98";
    }
  };

  const getStatusText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD:
        return "READY TO ANSWER EMAILS (UNFORTUNATELY)";
      case THEMES.EAGER_ASSISTANT:
        return "🎉 Ready and Excited to Assist!";
      case THEMES.SCANTRON:
        return "Use #2 Pencil Only - Fill Bubbles Completely";
      case THEMES.MAPQUEST:
        return "Ready to Calculate Route";
      case THEMES.MYSPACE:
        return "Online Now ● Last Login: Just Now";
      case THEMES.GEOCITIES:
        return "Under Construction Since 1999";
      case THEMES.EARLY_MAC:
        return "System Ready";
      default:
        return "Ready. Sort of.";
    }
  };

  const getEmptyStateMessage = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD:
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

      case THEMES.EAGER_ASSISTANT:
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

      case THEMES.SCANTRON:
        return (
          <div className={`empty-state ${themeClass}`}>
            <strong>STANDARDIZED TESTING INTERFACE</strong><br />
            <br />
            INSTRUCTIONS:<br />
            • Use #2 pencil only<br />
            • Fill bubbles completely<br />
            • Erase cleanly if you change answer<br />
            • Do not fold or tear this form<br />
            <br />
            <small>FORM 8492-B Rev. 2003</small>
          </div>
        );

      case THEMES.MAPQUEST:
        return (
          <div className={`empty-state ${themeClass}`}>
            <strong>Welcome to MapQuest!</strong><br />
            <br />
            Get directions between two points<br />
            Find addresses and local businesses<br />
            Print your maps!<br />
            <br />
            <small>MapQuest.com - © 2001</small>
          </div>
        );

      case THEMES.MYSPACE:
        return (
          <div className={`empty-state ${themeClass}`}>
            <strong>wElCoMe To My PrOfILe!!</strong><br />
            <br />
            thanks 4 visiting my page!! ✨<br />
            leave a comment or send me a message!<br />
            don't 4get to add me 2 ur top 8! 💕<br />
            <br />
            <small>A Place For Friends™</small>
          </div>
        );

      case THEMES.GEOCITIES:
        return (
          <div className={`empty-state ${themeClass}`}>
            <strong>🚧 UNDER CONSTRUCTION 🚧</strong><br />
            <br />
            Welcome to my GeoCities page!<br />
            Please sign my guestbook!<br />
            Best viewed in Netscape Navigator 4.0<br />
            <br />
            <small>You are visitor #000042</small>
          </div>
        );

      case THEMES.EARLY_MAC:
        return (
          <div className={`empty-state ${themeClass}`}>
            <strong>Welcome to Macintosh</strong><br />
            <br />
            System 7.5<br />
            Memory: 8 MB<br />
            Assistant Ready<br />
            <br />
            <small>© Apple Computer 1995</small>
          </div>
        );

      default:
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
    }
  };

  const getUserLabel = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '📧 EMAILER';
      case THEMES.EAGER_ASSISTANT: return '😊 You';
      case THEMES.SCANTRON: return '📝 TEST TAKER';
      case THEMES.MAPQUEST: return '🚗 USER';
      case THEMES.MYSPACE: return '💫 Friend';
      case THEMES.GEOCITIES: return '👤 VISITOR';
      case THEMES.EARLY_MAC: return '👤 User';
      default: return '👤 You';
    }
  };

  const getAssistantLabel = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '💪 STRONG BAD';
      case THEMES.EAGER_ASSISTANT: return '✨ Eager Assistant';
      case THEMES.SCANTRON: return '📋 SCANTRON SYSTEM';
      case THEMES.MAPQUEST: return '🗺️ MapQuest';
      case THEMES.MYSPACE: return '💖 MySpace';
      case THEMES.GEOCITIES: return '🌐 WebMaster';
      case THEMES.EARLY_MAC: return '🖥️ System';
      default: return '🤖 Lazy Assistant';
    }
  };

  const getLoadingText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '::typing::';
      case THEMES.EAGER_ASSISTANT: return 'Analyzing your request...';
      case THEMES.SCANTRON: return 'Scanning bubbles...';
      case THEMES.MAPQUEST: return 'Calculating route...';
      case THEMES.MYSPACE: return 'posting comment...';
      case THEMES.GEOCITIES: return 'Loading page...';
      case THEMES.EARLY_MAC: return 'Processing...';
      default: return 'Typing... slowly...';
    }
  };

  const getPlaceholder = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return 'type your email here genius...';
      case THEMES.EAGER_ASSISTANT: return 'Ask me anything! I\'m so excited to help! ✨';
      case THEMES.SCANTRON: return 'Fill in your answer...';
      case THEMES.MAPQUEST: return 'Enter destination address or search for a place...';
      case THEMES.MYSPACE: return 'leave a comment!! :)';
      case THEMES.GEOCITIES: return 'Sign my guestbook!';
      case THEMES.EARLY_MAC: return 'Enter text...';
      default: return 'Type your question here... if you must';
    }
  };

  const getSendButtonText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return 'SEND';
      case THEMES.EAGER_ASSISTANT: return 'Send 💬';
      case THEMES.SCANTRON: return 'SUBMIT';
      case THEMES.MAPQUEST: return 'Get Directions';
      case THEMES.MYSPACE: return 'Post!';
      case THEMES.GEOCITIES: return 'Submit';
      case THEMES.EARLY_MAC: return 'OK';
      default: return 'Send';
    }
  };

  const getNewChatButtonText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '🔄 NEW';
      case THEMES.EAGER_ASSISTANT: return '🔄 Start Fresh!';
      case THEMES.SCANTRON: return '🔄 NEW TEST';
      case THEMES.MAPQUEST: return '🔄 New Route';
      case THEMES.MYSPACE: return '🔄 Clear';
      case THEMES.GEOCITIES: return '🔄 Refresh';
      case THEMES.EARLY_MAC: return '🔄 Restart';
      default: return '🔄 New Chat';
    }
  };

  const getHelpButtonText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '❓ HELP';
      case THEMES.EAGER_ASSISTANT: return '❓ Need Help?';
      case THEMES.SCANTRON: return '❓ INSTRUCTIONS';
      case THEMES.MAPQUEST: return '❓ Help';
      case THEMES.MYSPACE: return '❓ FAQ';
      case THEMES.GEOCITIES: return '❓ Site Map';
      case THEMES.EARLY_MAC: return '❓ Help';
      default: return '❓ Help';
    }
  };

  const getAboutButtonText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return 'ℹ️ ABOUT';
      case THEMES.EAGER_ASSISTANT: return 'ℹ️ About Us';
      case THEMES.SCANTRON: return 'ℹ️ INFO';
      case THEMES.MAPQUEST: return 'ℹ️ About';
      case THEMES.MYSPACE: return 'ℹ️ Profile';
      case THEMES.GEOCITIES: return 'ℹ️ Webmaster';
      case THEMES.EARLY_MAC: return 'ℹ️ About';
      default: return 'ℹ️ About';
    }
  };

  const getMessageCountLabel = (count) => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return `EMAILS: ${count}`;
      case THEMES.EAGER_ASSISTANT: return `Chats: ${count}`;
      case THEMES.SCANTRON: return `Questions: ${count}`;
      case THEMES.MAPQUEST: return `Steps: ${count}`;
      case THEMES.MYSPACE: return `Comments: ${count}`;
      case THEMES.GEOCITIES: return `Entries: ${count}`;
      case THEMES.EARLY_MAC: return `Items: ${count}`;
      default: return `Messages: ${count}`;
    }
  };

  const getThemeChangeAlert = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '⚠️ ENTERING STRONG BAD MODE ⚠️';
      case THEMES.EAGER_ASSISTANT: return '✨ ENTERING EAGER MODE ✨';
      case THEMES.SCANTRON: return '📝 ENTERING TEST MODE 📝';
      case THEMES.MAPQUEST: return '🗺️ ENTERING MAPQUEST MODE 🗺️';
      case THEMES.MYSPACE: return '💫 ENTERING MYSPACE MODE 💫';
      case THEMES.GEOCITIES: return '🌐 ENTERING GEOCITIES MODE 🌐';
      case THEMES.EARLY_MAC: return '🖥️ ENTERING MAC MODE 🖥️';
      default: return '⚠️ RETURNING TO LAZY MODE ⚠️';
    }
  };

  const getFieldGroupTitle = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '>> EMAILS <<';
      case THEMES.EAGER_ASSISTANT: return '💬 Let\'s Chat!';
      case THEMES.SCANTRON: return '📝 TEST QUESTIONS';
      case THEMES.MAPQUEST: return '🗺️ Directions';
      case THEMES.MYSPACE: return '💬 Comments';
      case THEMES.GEOCITIES: return '📖 Guestbook';
      case THEMES.EARLY_MAC: return '💬 Messages';
      default: return '💬 Chat Session';
    }
  };

  const getEscapeButtonText = () => {
    switch (currentTheme) {
      case THEMES.STRONG_BAD: return '🚪 LEAVE';
      case THEMES.EAGER_ASSISTANT: return '😓 Stop Helping';
      case THEMES.SCANTRON: return '❌ Cancel Test';
      case THEMES.MAPQUEST: return '🛑 End Navigation';
      case THEMES.MYSPACE: return '💔 Delete Profile';
      case THEMES.GEOCITIES: return '🚫 Exit Page';
      case THEMES.EARLY_MAC: return '⚠️ Force Quit';
      default: return '🔙 Reset';
    }
  };

  return (
    <>
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
          {getThemeChangeAlert()}
        </div>
      )}

      <div className={`window-body ${themeClass}`}>
        <div className={`field-group ${themeClass}`}>
          <div className={`field-group-title ${themeClass}`}>
            {getFieldGroupTitle()}
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
                    {message.type === 'user' ? getUserLabel() : getAssistantLabel()}
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

                  {/* Render Scantron multiple choice options */}
                  {message.multipleChoice && message.type === 'assistant' && (
                    <div className="scantron-multiple-choice">
                      <div className="scantron-mc-options">
                        {Object.entries(message.multipleChoice.options).map(([letter, text]) => (
                          <div
                            key={letter}
                            className="scantron-mc-option"
                            onClick={() => handleScantronBubbleClick(letter)}
                          >
                            <div className="scantron-mc-bubble"></div>
                            <div className="scantron-mc-label">{letter})</div>
                            <div className="scantron-mc-text">{text}</div>
                          </div>
                        ))}
                        {message.multipleChoice.hasOther && (
                          <div
                            className="scantron-mc-option"
                            onClick={() => handleScantronBubbleClick('OTHER')}
                            style={{ borderColor: '#FF6600', borderStyle: 'dashed' }}
                          >
                            <div className="scantron-mc-bubble" style={{ borderColor: '#FF6600' }}></div>
                            <div className="scantron-mc-label" style={{ color: '#FF6600' }}>E)</div>
                            <div className="scantron-mc-text" style={{ fontStyle: 'italic' }}>Other (Fill in your own response)</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className={`message message-assistant ${themeClass}`}>
                <div className={`message-label ${themeClass}`}>
                  {getAssistantLabel()}
                </div>
                <div className={`message-text ${themeClass}`}>
                  <span className={`loading ${themeClass}`}>
                    {getLoadingText()}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hide input form completely in Scantron mode - force keyboard/bubbles only */}
          {!isScantron && (
            <form onSubmit={handleSubmit} className="input-container">
              <input
                type="text"
                className={`win98-input ${themeClass}`}
                placeholder={getPlaceholder()}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className={`win98-button ${themeClass}`}
                disabled={isTyping || !inputValue.trim()}
              >
                {getSendButtonText()}
              </button>
            </form>
          )}
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

        {/* Theme escape button - only shown when NOT in lazy assistant mode */}
        {currentTheme !== THEMES.LAZY_ASSISTANT && (
          <div style={{ marginBottom: '8px' }}>
            <button
              className={`win98-button ${themeClass}`}
              onClick={handleEscapeTheme}
              style={{ width: '100%', fontWeight: 'bold' }}
            >
              {getEscapeButtonText()}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
          <button className={`win98-button ${themeClass}`} onClick={handleReset}>
            {getNewChatButtonText()}
          </button>
          <button className={`win98-button ${themeClass}`} onClick={handleHelp}>
            {getHelpButtonText()}
          </button>
          <button className={`win98-button ${themeClass}`} onClick={handleAbout}>
            {getAboutButtonText()}
          </button>
        </div>
      </div>

      <div className={`status-bar ${themeClass}`}>
        <div className={`status-bar-field ${themeClass}`}>
          {getStatusText()}
        </div>
        <div className={`status-bar-field ${themeClass}`} style={{ flex: '0 0 100px' }}>
          {getMessageCountLabel(messages.length)}
        </div>
      </div>
    </div>

    {/* Scantron Keyboard Overlay */}
    {showScantronKeyboard && (
      <ScantronKeyboard
        onSubmit={handleScantronKeyboardSubmit}
        onClose={() => setShowScantronKeyboard(false)}
      />
    )}

    {/* Theme Picker Overlay */}
    {showThemePicker && (
      <ThemePicker
        onSelectTheme={handleThemeSelect}
        onClose={() => setShowThemePicker(false)}
      />
    )}
    </>
  );
}

export default Chat;
