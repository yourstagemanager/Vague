/**
 * The Lazy AI Conversation Engine
 * Generates vague, unhelpful, but amusing responses
 */

const RESPONSES = {
  greetings: [
    "Yeah, hi. What do you want?",
    "Oh. You're here. Great.",
    "Hello. This better be quick.",
    "Hi. I was in the middle of something... not important, but still.",
    "Hey. Let me guess, you need help with something."
  ],

  vague: [
    "Have you tried... doing the thing?",
    "It's somewhere around there. Or maybe not.",
    "I think the answer involves... stuff. And things.",
    "You know, someone once asked me that. I didn't know then either.",
    "The solution is probably... I want to say... never mind, I lost it.",
    "It could be A, or B, or possibly something else entirely.",
    "I'd help you more specifically, but where's the fun in that?",
    "Look, it's either going to work or it won't. That's just science.",
    "Have you considered that maybe it doesn't matter?",
    "I mean, technically, you could do... something. That's an option."
  ],

  deflecting: [
    "You know what? You should probably call someone about that. Not me, someone else.",
    "There's a number for this sort of thing. I think it starts with a 1... or maybe an 8.",
    "Have you tried asking Google? They love this stuff.",
    "This seems like a job for literally anyone but me.",
    "I could help you, but I think you'd learn more by figuring it out yourself. Personal growth and all that.",
    "There's probably a YouTube video about this. There's a YouTube video about everything.",
    "Why don't you ask that friend of yours who 'knows computers'?",
    "Customer support handles this kind of thing. I'm more of an ideas guy.",
    "I'm going to redirect you to... wait, where was I going with this?",
    "Have you checked the FAQ? I haven't, but you could."
  ],

  technical: [
    "Error 404: Motivation not found.",
    "It's probably a cache thing. Everything's always a cache thing. Clear your cache. Or don't. Whatever.",
    "Have you tried turning it off and leaving it off?",
    "Sounds like a driver issue. Or a software issue. Or possibly a hardware issue. It's definitely one of those.",
    "The problem is somewhere between your keyboard and your chair.",
    "Did you check if it's plugged in? That's usually step one. You'd be surprised.",
    "It might be a DNS issue. Or not. I always blame DNS when I don't know.",
    "Have you updated Adobe Reader? Just kidding, nobody knows why that matters but it does.",
    "Try using Internet Explorer. Ha, just kidding, nobody deserves that.",
    "The solution involves right-clicking. Probably. Right-clicking fixes like 40% of computer problems."
  ],

  passive_aggressive: [
    "Oh, that's a great question. Too bad I don't have a great answer.",
    "I could look that up for you, but so could you.",
    "Interesting problem. Let me know how you solve it.",
    "Wow, that's definitely a situation you're having right there.",
    "I'm here to help. Not necessarily to help *you*, but I'm here.",
    "Some people would know the answer to that. I'm not saying I'm not one of them, but...",
    "That's above my pay grade. And my pay grade is $0, so that's saying something.",
    "I appreciate your optimism in thinking I'd know that.",
    "Bold of you to assume I've been paying attention.",
    "I'm detecting some urgency in your request. That must be stressful for you."
  ],

  nostalgic: [
    "Have you tried Ask Jeeves? Oh wait, wrong decade.",
    "Back in my day, we'd search for this on AltaVista. Uphill. Both ways.",
    "Let me fire up Netscape Navigator and see what I can find... oh, never mind.",
    "Is this about AOL keywords again? Because I told you, those aren't a thing anymore.",
    "Have you checked the GeoCities page for this? No? Right, those are all gone.",
    "This reminds me of a HotBot search I did in 1998. Didn't find anything then either.",
    "You could try posting this on MySpace. Let me know if Tom responds.",
    "Maybe there's a Lycos guide about this. Probably not, but maybe.",
    "Did you check the Webring? There was always someone in the Webring who knew stuff.",
    "This sounds like something Clippy would've been annoying about. 'It looks like you're trying to...' yeah, we all miss him."
  ],

  gaslighting: [
    "That button? It's been there the whole time. You probably just didn't notice.",
    "We never had that feature. You might be thinking of a different assistant.",
    "I already answered this. Weren't you listening?",
    "That's not how you asked it the first time. Make up your mind.",
    "The interface hasn't changed. Why would you think it changed?",
    "That's always been blue. Are you feeling okay?",
    "We discussed this earlier. Or... did we? I feel like we did.",
    "I think you're misremembering what you asked me.",
    "That option is right where it's always been. Right there. See it? No? Interesting.",
    "You sure you didn't solve this already? You seem like you'd remember that."
  ],

  phone_numbers: [
    "You should call 1-800-NOT-MY-PROBLEM. They're very helpful.",
    "There's a support line at 1-888-ASK-SOMEONE-ELSE. They have extended hours.",
    "Try calling 411. Does 411 still exist? Anyway, try that.",
    "The number you want is 1-900-GOOD-LUCK. There may be a small fee. Or a large one.",
    "Customer support is at 1-800-CANT-HELP. They're usually pretty responsive.",
    "Information line: 1-888-NO-IDEA. Press 1 for English, 2 for giving up.",
    "Technical support: 1-800-DID-U-TRY. Average wait time is 3-4 business days.",
    "Have you tried 867-5309? That used to work for everything."
  ],

  weather: [
    "It's weather outside. The usual kind.",
    "Somewhere between cold and hot. Probably.",
    "Look out a window. That's the weather.",
    "It's either raining or not raining. Those are pretty much the options.",
    "Weather happens. It's kind of its thing.",
    "I think the sun might be involved? It usually is.",
    "It's whatever it was yesterday, plus or minus some degrees.",
    "Weather.com probably knows. They're oddly invested in this topic."
  ],

  time: [
    "It's time for you to get a watch.",
    "Time is a social construct. But it's probably around 3-ish.",
    "Later than it was, earlier than it will be.",
    "Check your phone. That's what it's for.",
    "Does it really matter? Time is relative.",
    "It's five o'clock somewhere. Not here, but somewhere.",
    "Sometime between breakfast and dinner. That narrows it down."
  ],

  directions: [
    "It's over there. Kind of.",
    "Head north. Or was it south? One of the directions.",
    "Take a left at the thing, then right at the other thing. You'll know it when you see it. Or you won't.",
    "It's not here, that's for sure.",
    "Somewhere between where you are and where you're going.",
    "Have you tried MapQuest? Just kidding, don't do that.",
    "It's approximately... elsewhere.",
    "Follow the road until it ends. Then, I don't know, good luck?"
  ],

  math: [
    "It's a number. Probably a pretty normal one.",
    "Have you tried a calculator? They're really good at this stuff.",
    "The answer is 42. Or was that a different question?",
    "Somewhere between 0 and infinity.",
    "Math, huh? That's a tough one. You sure you need to know?",
    "It's like... carry the one... multiply the thing... I'm going to say 7.",
    "The answer involves numbers. I'm pretty confident about that part."
  ],

  default: [
    "Hmm. That's certainly a question.",
    "I'm going to level with you: I have no idea.",
    "That's a tough one. By which I mean I'm not going to try.",
    "Great question. Someone should really answer that for you.",
    "I'd help, but I'm trying to conserve energy.",
    "Have you considered that maybe you don't actually need to know this?",
    "Look, I'm doing the best I can here. Which isn't much, but still.",
    "That's outside my area of expertise. Which is, admittedly, pretty limited.",
    "I'm going to be honest with you: this sounds like work.",
    "You know, sometimes the best answer is no answer at all. Think about it."
  ]
};

const KEYWORDS = {
  greetings: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'howdy'],
  weather: ['weather', 'temperature', 'forecast', 'rain', 'snow', 'sunny', 'cold', 'hot', 'humid'],
  time: ['time', 'clock', 'hour', 'minute', 'when'],
  directions: ['where', 'direction', 'location', 'address', 'map', 'navigate', 'route', 'how do i get'],
  math: ['calculate', 'math', 'plus', 'minus', 'multiply', 'divide', 'equation', 'sum', 'total'],
  technical: ['computer', 'error', 'bug', 'crash', 'software', 'hardware', 'install', 'update', 'fix', 'broken', 'code', 'program']
};

let conversationCount = 0;
let lastResponseType = null;

/**
 * Analyzes the user's message to determine response category
 */
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Check for greetings first (only if it's a short message)
  if (lowerMessage.length < 20) {
    for (const word of KEYWORDS.greetings) {
      if (lowerMessage.includes(word)) {
        return 'greetings';
      }
    }
  }

  // Check other categories
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (category === 'greetings') continue;
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return category;
      }
    }
  }

  return 'default';
}

/**
 * Gets a random response from an array
 */
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Determines if we should throw in some personality
 */
function shouldAddPersonality() {
  return Math.random() > 0.6; // 40% chance of extra personality
}

/**
 * Generates a response to the user's message
 */
export function generateResponse(userMessage) {
  conversationCount++;

  // First message is always a greeting (even if they didn't greet)
  if (conversationCount === 1 && !analyzeMessage(userMessage) === 'greetings') {
    return getRandomResponse(RESPONSES.greetings);
  }

  const category = analyzeMessage(userMessage);
  let response = '';

  // Get main response
  if (RESPONSES[category]) {
    response = getRandomResponse(RESPONSES[category]);
    lastResponseType = category;
  } else {
    response = getRandomResponse(RESPONSES.default);
    lastResponseType = 'default';
  }

  // Add some flavor based on conversation count
  if (conversationCount > 3 && shouldAddPersonality()) {
    // User is asking too many questions, get more passive-aggressive
    const extra = getRandomResponse([
      " Look, I've got other things to do.",
      " Is this going to take much longer?",
      " You ask a lot of questions.",
      " Are we almost done here?",
      " This feels like a lot of work for a simple question."
    ]);
    response += extra;
  } else if (conversationCount > 5 && Math.random() > 0.7) {
    // After 5+ messages, occasionally deflect to phone number
    response += " " + getRandomResponse(RESPONSES.phone_numbers);
  } else if (shouldAddPersonality()) {
    // Random chance to add nostalgic reference or gaslighting
    if (Math.random() > 0.5) {
      response += " " + getRandomResponse(RESPONSES.nostalgic);
    } else {
      response += " " + getRandomResponse(RESPONSES.gaslighting);
    }
  }

  return response;
}

/**
 * Resets the conversation state
 */
export function resetConversation() {
  conversationCount = 0;
  lastResponseType = null;
}

/**
 * Gets the current conversation count (for debugging/stats)
 */
export function getConversationCount() {
  return conversationCount;
}
