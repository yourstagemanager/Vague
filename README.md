# 🤖 Lazy Assistant

A delightfully unhelpful personal assistant app with a comedic twist. Built with React, styled like Windows 98, and powered by contextual AI sarcasm (or canned responses if you prefer).

## 🎭 What is This?

Lazy Assistant is a web-based chat application that parodies overly-helpful AI assistants by being intentionally vague, passive-aggressive, and generally unhelpful. It's designed to be just frustrating enough to be funny, while still engaging users with witty, dry humor in the style of Stephen Wright or Mitch Hedberg.

## ✨ Features

- **Contextual Sarcasm**: Responses are based on YOUR actual questions (when using AI mode)
- **Vague but Accurate**: Get answers that are technically correct but practically useless
- **Passive-Aggressive Personality**: The assistant doesn't want to help, and it shows
- **Deflection Master**: Instead of helping, it'll give you phone numbers to call (that don't actually exist)
- **Multiple Themes**: Lazy Assistant, Strong Bad, MapQuest, Scantron, and more retro personas
- **Nostalgic References**: Callbacks to AltaVista, Ask Jeeves, MapQuest, GeoCities, and more
- **Windows 98 UI**: Full retro interface with that classic teal desktop background
- **Gaslighting Features**: Buttons and UI elements that mess with your expectations
- **Flexible AI**: Use Gemini (free), Ollama (local), or canned responses (no setup)

## 🤖 AI Configuration

The app now supports **contextual AI responses** that understand your questions and respond with theme-appropriate sarcasm!

### Option 1: Google Gemini (Recommended for Quick Start)
**FREE** - 250 requests/day

1. Get a free API key: https://aistudio.google.com/apikey
2. Copy `.env.example` to `.env`
3. Set `VITE_AI_PROVIDER=gemini`
4. Add your API key to `VITE_GEMINI_API_KEY`
5. Run `npm run dev`

**Pros**: Fast, no installation, good quality responses
**Cons**: Daily limit (250 requests), requires internet

### Option 2: Ollama (Best for Unlimited Use)
**100% FREE** - Unlimited requests

1. Install Ollama: https://ollama.com/download
2. Run: `ollama pull llama3.2:3b`
3. Copy `.env.example` to `.env`
4. Set `VITE_AI_PROVIDER=ollama`
5. Run `npm run dev`

**Pros**: Completely free, unlimited, works offline, private
**Cons**: Slower responses, requires 8-16GB RAM, installation needed

**Recommended Models**:
- `llama3.2:3b` - Fast, needs 8GB RAM (best for comedy)
- `llama3:8b` - Better quality, needs 16GB RAM
- `mistral:7b` - Good balance, needs 16GB RAM
- `phi3:mini` - Lightweight, needs 8GB RAM

### Option 3: No AI (Classic Mode)
**FREE** - No limits, no setup

Set `VITE_AI_PROVIDER=none` in your `.env` file to use pre-written canned responses only.

**Pros**: No setup, instant responses, works anywhere
**Cons**: Responses not contextual to your questions

## 🎨 Design Philosophy

The assistant is designed to:
- Give technically accurate but practically useless advice
- Reference obsolete technology and services
- Deflect to external resources rather than help directly
- Get progressively more passive-aggressive with each message
- Maintain a dry, deadpan tone throughout
- Keep users engaged through wit and nostalgia

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`

## 📁 Project Structure

```
src/
├── components/
│   └── Chat.jsx              # Main chat interface component
├── utils/
│   └── conversationEngine.js # Response generation logic
├── styles/
│   └── windows98.css         # Windows 98 theme styling
├── App.jsx                   # Root component
├── index.css                 # Global styles
└── main.jsx                  # Entry point
```

## 🎮 How It Works

### Conversation Engine

The conversation engine (`src/utils/conversationEngine.js`) uses:
- **AI Integration** (optional) - Uses Gemini or Ollama to generate contextual sarcastic responses
- **Theme-Based Prompts** (`src/utils/themePrompts.js`) - Each theme has a personality that guides AI responses
- **Pattern matching** to identify keywords in user messages
- **Response templates** as fallback when AI is unavailable
- **Randomization** to keep responses fresh
- **State tracking** to get more passive-aggressive over time

When AI is enabled, **all themes** generate contextual responses to your actual questions while maintaining their unique personalities!

### Response Categories

- **Greetings**: Reluctant hellos
- **Vague**: Technically answers but tells you nothing
- **Deflecting**: Sends you elsewhere for help
- **Technical**: Computer-related non-help
- **Passive-Aggressive**: For when the assistant is tired of your questions
- **Nostalgic**: References to dead tech services
- **Gaslighting**: Messes with your perception
- **Phone Numbers**: Fake support lines

## 🎨 Styling

The app uses a custom Windows 98 theme (`windows98.css`) that includes:
- Classic grey beveled UI elements
- Blue gradient title bars
- Authentic button and input styling
- Teal desktop background
- Period-accurate fonts and spacing

## 🔮 Future Enhancements

Planned features for future versions:
- Random UI theme switching (Windows 98 → MySpace → MapQuest, etc.)
- Moving/disappearing buttons for maximum frustration
- "Loading" animations that take forever
- iOS/Android app using Capacitor
- Multiple retro UI personas (Clippy, BonziBuddy, Ask Jeeves)
- Fake error messages
- More elaborate gaslighting features
- Sound effects (dial-up modem, Windows startup, etc.)

## 🎯 Target Audience

Primarily aimed at older millennials (28-42) who will appreciate references to:
- Windows 98/XP
- AltaVista, Ask Jeeves, Lycos
- MapQuest printouts
- Early MySpace
- GeoCities pages
- AOL keywords
- Netscape Navigator
- And other early internet nostalgia

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Pure CSS** - No CSS frameworks needed
- **Client-side only** - No backend required

## 📝 License

This project is for comedic and educational purposes. Use it to annoy your friends.

## 🤝 Contributing

Feel free to add more vague responses, nostalgic references, or UI annoyances. The worse it is at helping, the better!

## 💡 Inspiration

Inspired by:
- Unhelpful customer service experiences
- The dry humor of Stephen Wright and Mitch Hedberg
- Nostalgic frustration with obsolete technology
- The desire to make software that's intentionally bad (but in a good way)

---

© 1998 Unhelpful Software Inc. All rights reserved. Not that we care.
