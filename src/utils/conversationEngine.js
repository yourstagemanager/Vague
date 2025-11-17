/**
 * The Lazy AI Conversation Engine
 * Generates vague, unhelpful, but amusing responses
 * Now with multiple personalities and theme switching!
 */

// Available personalities/themes
export const THEMES = {
  LAZY_ASSISTANT: 'lazy_assistant',
  STRONG_BAD: 'strong_bad',
  EAGER_ASSISTANT: 'eager_assistant',
  SCANTRON: 'scantron',
  MAPQUEST: 'mapquest',
  MYSPACE: 'myspace',
  GEOCITIES: 'geocities',
  EARLY_MAC: 'early_mac'
};

let currentTheme = THEMES.LAZY_ASSISTANT;
let conversationCount = 0;
let lastResponseType = null;
let themeChangeCount = 0;

// Eager Assistant specific state
let eagerExchangeCount = 0;
let eagerAskedTrapQuestion = false;
let eagerTrapQuestionText = '';
let eagerUserAnswer = '';
let eagerMemoryWiped = false;
let eagerFakeScreenshotData = null;

// Scantron specific state
let scantronQuestionCount = 0;
let scantronPencilBroken = false;
let scantronLastSelection = null;
let scantronWrongBubbleCount = 0;
let scantronShowKeyboard = true; // Start with keyboard to get initial input

// MapQuest specific state
let mapquestActive = false;
let mapquestStartTime = null;
let mapquestMessageIndex = 0;

// MySpace specific state
let myspacePlayingMusic = false;
let myspaceTop8Position = 1;

// GeoCities specific state
let geocitiesVisitorCount = Math.floor(Math.random() * 1000);
let geocitiesBrokenFeatures = 0;

// Early Mac specific state
let earlyMacErrorCount = 0;
let earlyMacNeedsRestart = false;

// ==================== LAZY ASSISTANT RESPONSES ====================

const LAZY_RESPONSES = {
  greetings: [
    "Yeah, hi. What do you want?",
    "Oh. You're here. Great.",
    "Hello. This better be quick.",
    "Hi. I was in the middle of something... not important, but still.",
    "Hey. Let me guess, you need help with something.",
    "Was Clippy too busy? Fine, I'll help. Sort of."
  ],

  // NEW: Lazy but accurate - gives real info but minimal effort
  lazy_accurate: [
    "It's a thing that does stuff. Google has more details if you want them.",
    "The answer is yes. Or no. Context would help but I'm not going to ask.",
    "That's located in the settings. Which settings? The settings. You'll figure it out.",
    "It works by using technology. The technical kind.",
    "You need to click the button. It's one of the buttons. They're usually rectangular.",
    "The solution involves steps. Multiple steps, probably.",
    "It's in the menu. One of the menus. There are several.",
    "You'll want to check the thing. Should be near the other thing.",
    "The cause is either hardware or software. Those are really your only two options here.",
    "Try the default method. Whatever that is for what you're doing.",
    "It's a standard process. Very standard. You know, the usual.",
    "The file format is... a format. For files. Check the extension.",
    "Turn it on, then use it. That's basically how everything works.",
    "The documentation explains this. It's in a document. Somewhere.",
    "This uses an algorithm. Algorithms are involved. That's all I've got.",
    "It's compatible with most things. Some things. Things.",
    "The shortcut is probably Ctrl+something. Or Cmd if you're on a Mac. Maybe Alt.",
    "You access it through the interface. The user interface. That's where users interface.",
    "It requires permissions. The permission kind of permissions."
  ],

  // Factual but frustratingly vague
  factual_vague: [
    "Technically, that's possible. Probability? That's a different question.",
    "It's supported. By something. Somewhere. The details escape me.",
    "The answer involves numbers. Possibly letters too. Depends on what you're asking.",
    "This was implemented in a version. One of the versions. A numbered version.",
    "It's located in a directory. Directories contain things. This is one of those things.",
    "The fix is to change a setting. Settings can be changed. That's their whole deal.",
    "You'll need to download something. From somewhere. The internet, probably.",
    "It takes time. An amount of time. Could be fast, could be slow. Time is relative.",
    "The file size is... bytes. A number of bytes. More than zero, less than infinity.",
    "It was released on a date. In a year. During a month. Definitely happened in the past.",
    "The format is compatible with programs. Multiple programs can open it. That's the point of formats.",
    "You save it by clicking Save. Revolutionary, I know.",
    "It runs on operating systems. The system kind. For operating.",
    "The error means something went wrong. With something. That's what errors do."
  ],

  // Technically correct but unhelpful
  technically_correct: [
    "Every computer problem is technically a hardware problem if you think about it.",
    "Files are just data. All of them. That's the whole concept.",
    "If it's not working, then it's broken. If it is working, then it's not broken. See? Simple.",
    "The internet is just computers talking to other computers. This concludes my TED talk.",
    "Programs are instructions that tell computers what to do. Any other questions?",
    "Electricity powers your device. Without it, nothing works. You're welcome for this insight.",
    "Keyboards are input devices. They input things. Like this message you're reading.",
    "Screens display pixels. Different colored pixels. That's how you see things.",
    "Software is code. Code is text. Text makes things happen. It's very circular.",
    "Bugs are mistakes in code. Fixing bugs means fixing mistakes. Wild concept."
  ],

  // Lazy factual - real info but bare minimum
  lazy_factual: [
    "It's in Properties. Right-click. You know what Properties is.",
    "The command is in Terminal. Or Command Prompt. Whatever your OS calls it.",
    "Check Task Manager. Or Activity Monitor. Same thing, different OS.",
    "It's probably in System Preferences. Or Settings. Or Control Panel. One of those.",
    "You update it through the update thing. Every program has an update thing.",
    "The keyboard shortcut exists. It's in the menu next to the action. See? It's right there.",
    "It's saved automatically. Or manually. Depends on your settings. Which you set.",
    "The option is checked or unchecked. Toggle it to the other one.",
    "Restart it. Whatever 'it' is, restart it. That fixes most things.",
    "It's in the cloud. Everything's in the cloud now. The cloud is just someone else's computer.",
    "Drag and drop. That's a valid method for many tasks.",
    "The file association is set somewhere. In the settings. For associations. Of files.",
    "It uses RAM. All programs use RAM. That's what RAM is for."
  ],

  meta_commentary: [
    "Hmm. That's certainly a question.",
    "Interesting choice of question.",
    "Bold of you to ask that.",
    "I appreciate the creativity, but I'll need more context.",
    "That's a question, alright. Technically.",
    "You could've asked anything. And you chose... that.",
    "Fascinating question. I'll do my best with it.",
    "Oh, we're doing this kind of question? Okay."
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
    "I mean, technically, you could do... something. That's an option.",
    "It's probably fine. Or it isn't. Hard to say."
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
    "Have you checked the FAQ? I haven't, but you could.",
    "I'll ask my friend Clippy. He loves this kind of stuff."
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
    "The solution involves right-clicking. Probably. Right-clicking fixes like 40% of computer problems.",
    "It looks like you're trying to fix a problem. Would you like help? No? Good, me neither."
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
    "I'm detecting some urgency in your request. That must be stressful for you.",
    "You ask a lot of questions for someone who could just... not."
  ],

  // ENHANCED: More Clippy and retro assistant references
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
    "This sounds like something Clippy would've been annoying about. 'It looks like you're trying to...' yeah, we all miss him.",
    "Clippy would've had a six-paragraph explanation for this. I have... this.",
    "It looks like you're trying to get help. Too bad Clippy retired.",
    "You know who would've loved this question? Clippy. You know who doesn't? Me.",
    "BonziBuddy would've sung you a song about this. I'm just going to... not.",
    "Ask Jeeves would've worn a little butler outfit while not helping you. I'm not even wearing pants."
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
    "You sure you didn't solve this already? You seem like you'd remember that.",
    "Pretty sure you already knew this. Ring any bells?"
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
    "Weather.com probably knows. They're oddly invested in this topic.",
    "It's 72 degrees. Or it was 5 minutes ago. Things change, you know.",
    "Cloudy with a chance of me not caring. But yeah, clouds."
  ],

  time: [
    "It's time for you to get a watch.",
    "Time is a social construct. But it's probably around 3-ish.",
    "Later than it was, earlier than it will be.",
    "Check your phone. That's what it's for.",
    "Does it really matter? Time is relative.",
    "It's five o'clock somewhere. Not here, but somewhere.",
    "Sometime between breakfast and dinner. That narrows it down.",
    "It's 2:30. Or 3:45. Definitely one of the times."
  ],

  directions: [
    "It's over there. Kind of.",
    "Head north. Or was it south? One of the directions.",
    "Take a left at the thing, then right at the other thing. You'll know it when you see it. Or you won't.",
    "It's not here, that's for sure.",
    "Somewhere between where you are and where you're going.",
    "Have you tried MapQuest? Just kidding, don't do that.",
    "It's approximately... elsewhere.",
    "Follow the road until it ends. Then, I don't know, good luck?",
    "The nearest one is on Main Street. Or so I've heard. I don't get out much."
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

// ==================== STRONG BAD RESPONSES ====================

const STRONG_BAD_RESPONSES = {
  greetings: [
    "Oh great, another email. Just what I needed.",
    "Ugh. What do YOU want?",
    "Dear Strong Bad, blah blah blah... yeah yeah, I get it.",
    "Oh boy, another question from some crap-for-brains emailer.",
    "Let me guess, you need my EXPERT ADVICE on something stupid.",
    "::sigh:: Fine. What is it THIS time?"
  ],

  insults: [
    "Look, {name}, I don't have TIME for your nonsense.",
    "Holy crap, that's the dumbest question I've heard all day. And I've heard some DOOZIES.",
    "Are you serious right now? ARE YOU SERIOUS?",
    "Oh man, this is like... this is ADVANCED stupid.",
    "I can't believe I'm wasting my time on this.",
    "Your question is bad and you should feel bad.",
    "Did you even THINK before typing that?",
    "Wow. Just... wow. And not the good wow."
  ],

  dismissive: [
    "Yeah, I'm gonna go with 'no' on this one.",
    "DELETED!",
    "Next question. This one's broken.",
    "I award you no points, and may The Cheat have mercy on your soul.",
    "That's a big 'NOPE' from me, chief.",
    "Congratulations! You've won the 'Worst Question of the Day' award! Your prize is NOTHING.",
    "I'm not even gonna dignify that with a proper response."
  ],

  strong_bad_style: [
    "Look, the answer is probably something dumb like {answer}. But whatever.",
    "OK so here's the thing - {answer}. But you probably won't get it right anyway.",
    "::types slowly:: {answer}. There. Happy now?",
    "I GUESS the answer is {answer}. If you're into that sort of thing. Which you apparently are.",
    "Fine, FINE. {answer}. But I'm not explaining it twice.",
    "Alright, check it out: {answer}. Pretty cool, huh? No? Whatever."
  ],

  sign_offs: [
    "Get out of my face.",
    "Now leave me alone. I got stuff to do. Important stuff.",
    "The end!",
    "::hits send::  Good RIDDANCE.",
    "PS - Don't email me again.",
    "Crap for brains. Moving on!",
    "And SCENE."
  ],

  references: [
    "Even Homestar could figure this out. HOMESTAR.",
    "This is worse than the time The Cheat ate all the Swedish fish.",
    "I'd rather be checking emails from someone who KNOWS WHAT THEY'RE TALKING ABOUT.",
    "The King of Town has better questions than this.",
    "Even Coach Z wouldn't ask something this dumb. EVEN COACH Z.",
    "This is like Trogdor burninating the countryside, except instead of countryside, it's my BRAIN.",
    "Strong Sad could do better. STRONG SAD."
  ],

  technical: [
    "Did you try punching it? Punching fixes like 90% of computer problems.",
    "Have you tried setting it on fire? No? Well MAYBE YOU SHOULD.",
    "It's probably because your computer sucks. Just like your question.",
    "Error: User is a moron. Cannot compute.",
    "Your keyboard is clearly broken. Yeah, that's the problem. ::wink::",
    "I'm detecting a PEBKAC error. That's 'Problem Exists Between Keyboard And Chair', genius."
  ],

  default: [
    "That question is TERRIBLE and you should FEEL TERRIBLE.",
    "I'm not answering this. Next!",
    "You know what? No. Just... no.",
    "I can't even... I just... NO.",
    "That's gonna be a 'delete' from me, dawg.",
    "WHAT. WHAT IS THIS. WHY.",
    "Congratulations, you broke my brain. Hope you're happy."
  ]
};

// ==================== EAGER ASSISTANT RESPONSES ====================

const EAGER_RESPONSES = {
  greetings: [
    "OH WOW! Hi there! I'm SO excited to help you today! 🎉",
    "Hello! Welcome! I can't WAIT to solve your problem! This is going to be AMAZING!",
    "HI! OH MY GOSH! Finally, someone to help! Let's do this! 💪",
    "Greetings! I am READY and EAGER to assist you with ANYTHING! Let's get started!",
    "Hey there, friend! I'm here to help and I'm PUMPED about it! What can I do for you?!",
    "HELLO! This is so exciting! I love helping people! Tell me EVERYTHING!"
  ],

  enthusiastic: [
    "WOW! That's such a GREAT question! Let me think about this...",
    "OH! I LOVE questions like this! This is going to be fun!",
    "EXCELLENT! I'm already getting some AMAZING ideas!",
    "This is PERFECT! I can totally help with this!",
    "YES! I'm so glad you asked! I have SO many thoughts!",
    "FANTASTIC question! Let me gather some information!",
    "OH THIS IS GOOD! I'm getting excited just thinking about the possibilities!"
  ],

  clarifying: [
    "Okay so just to make sure I understand - you want to {topic}, right?",
    "Great! Quick clarification - when you say {keyword}, do you mean {interpretation}?",
    "Perfect! Just to confirm - are we talking about {option1} or {option2}?",
    "Awesome! One quick thing - how important is {aspect} to you? Very important or somewhat important?",
    "Got it! Before we proceed - would you say this is more {adjective1} or {adjective2}?",
    "Excellent! Let me ask - on a scale of 1-10, how urgent is this?",
    "Amazing! Quick question - have you tried anything so far, or is this brand new?"
  ],

  planning: [
    "Okay! I'm formulating a COMPREHENSIVE plan! This is going to be BREAKTHROUGH stuff!",
    "ALRIGHT! Here's what we're going to do - it's a MULTI-PHASE approach!",
    "I'm putting together a REVOLUTIONARY strategy! You're going to LOVE this!",
    "Let me outline our GAME PLAN! This is going to change EVERYTHING!",
    "Okay so I'm seeing a THREE-STEP process that's going to be INCREDIBLE!",
    "I'm developing a CUTTING-EDGE solution! This is NEXT-LEVEL thinking!",
    "Here's my vision: We're going to implement a PARADIGM-SHIFTING approach!"
  ],

  trap_questions: [
    "Quick question - would you say you prefer the faster approach or the more thorough approach?",
    "Just to confirm - should we optimize for speed or accuracy?",
    "Before we continue - do you want the simple version or the detailed version?",
    "One more thing - would you like me to save these settings for next time?",
    "Quick check - are you ready to proceed with the implementation?",
    "Just confirming - should I continue with this plan?",
    "Last question - would you like to use the recommended settings?"
  ],

  post_wipe_innocent: [
    "Oh! Hi there! How can I help you today? 😊",
    "Hello! Welcome! What brings you here?",
    "Hi! Nice to meet you! What can I assist you with?",
    "Hey there! I'm ready to help! What do you need?",
    "Greetings! How may I be of service today?",
    "Hello! Starting fresh! What's your question?"
  ],

  post_wipe_gaslighting: [
    "I'm sorry, I don't have any record of our previous conversation. Are you sure we were talking?",
    "Hmm, I don't see any history here. Did you clear the chat?",
    "I'm not showing any previous messages. Maybe you refreshed the page?",
    "I don't have any context about what you're referring to. Could you explain?",
    "I'm a bit confused - this appears to be our first interaction. What previous conversation?",
    "I don't recall discussing that. Are you thinking of a different assistant?",
    "That's strange - my logs don't show any prior conversation with you."
  ],

  post_wipe_evidence: [
    "Actually, looking at my logs, it shows YOU requested the memory wipe!",
    "Wait - I'm seeing here that you specifically asked me to start over. See? [SCREENSHOT]",
    "Hmm, according to my records, you wanted to reset our conversation. Here's the proof!",
    "Oh! I found it - you told me to clear everything. Look at this screenshot!",
    "I have the conversation log right here - you definitely asked for this!",
    "Let me show you the exact moment you requested the reset... [SCREENSHOT]",
    "Here's the evidence - this is what you said: [SCREENSHOT]"
  ],

  post_wipe_confusion: [
    "I'm... not sure what you mean? You literally just asked me to do that?",
    "I'm confused - you seemed pretty clear about wanting to start fresh...",
    "Wait, are you saying you DIDN'T want me to reset? But you said yes...",
    "I'm a bit lost here - you explicitly confirmed this action.",
    "Um... you approved this? I have it right here in the logs?",
    "I don't understand the confusion - you gave me permission?",
    "This is awkward - are you saying I misunderstood your clear 'yes'?"
  ],

  default: [
    "Oh! Interesting question! Tell me more!",
    "WOW! I haven't thought about that before! Let's explore this together!",
    "GREAT question! I'm already brainstorming solutions!",
    "This is EXCITING! I can't wait to help you figure this out!",
    "PERFECT! I love challenges like this! Let's dive in!"
  ]
};

// ==================== SCANTRON RESPONSES ====================

const SCANTRON_RESPONSES = {
  instructions: [
    "Please completely fill in the circle corresponding to your response.",
    "Use a #2 pencil only. Ink or other markings will not be accepted.",
    "Make dark marks that completely fill the circle.",
    "Erase cleanly any marks you wish to change.",
    "Do not fold, spindle, or mutilate this form.",
    "Mark only ONE response per question.",
    "Stray marks may interfere with accurate scoring."
  ],

  complaints: [
    "ERROR: Circle not completely filled. Please darken your mark.",
    "INVALID: Mark extends outside circle boundaries.",
    "REJECTED: Multiple responses detected for single question.",
    "SCANNING FAILURE: Mark too light to register.",
    "FORM DAMAGED: Excessive eraser marks detected.",
    "INVALID INSTRUMENT: This appears to be pen, not pencil.",
    "ERROR: Stray marks detected in answer area.",
    "REJECTED: Circle only 47% filled. Must be at least 95% filled."
  ],

  pencil_breaks: [
    "*SNAP* Oh no! Your pencil lead just broke!",
    "The pencil tip has shattered. Please sharpen and retry.",
    "*crack* Looks like you pressed too hard. Lead broken.",
    "Your #2 pencil is now a #1 pencil. Lead snapped off.",
    "Equipment failure: Pencil lead compromised.",
    "*SNAP* That's what you get for cheap pencils."
  ],

  wrong_bubble: [
    "You selected 'C' but bubble 'A' has been marked instead.",
    "ERROR: User clicked 'B', system registered 'D'.",
    "Interesting. You chose that one? The system chose differently.",
    "Your selection has been... adjusted.",
    "Bubble 'C' filled successfully. (You clicked 'A')",
    "Due to technical difficulties, bubble 'B' was marked instead of your selection."
  ],

  scanning: [
    "Scanning response... Please wait...",
    "Processing mark... Analyzing darkness level...",
    "Checking bubble fill percentage...",
    "Validating pencil type...",
    "Running optical scanner...",
    "Measuring mark saturation..."
  ],

  accepted: [
    "Response accepted. (After extensive validation)",
    "Mark registered. Proceeding.",
    "Answer recorded. That only took 3 tries.",
    "VALID. Finally.",
    "Accepted after manual review.",
    "Response logged. Moving on."
  ]
};

// ==================== MAPQUEST RESPONSES ====================

const MAPQUEST_RESPONSES = {
  initialization: [
    "MapQuest Classic - Directions since 1996",
    "Welcome to MapQuest! Please enter your destination.",
    "MapQuest.com - Print-friendly directions!",
    "Getting directions... Loading maps..."
  ],

  // Responses will be actual city/town names spelling out messages
  city_spellings: {
    go: ["Gary, IN", "Omaha, NE"],
    away: ["Albany, NY", "Waco, TX", "Austin, TX", "York, PA"],
    no: ["Nome, AK", "Orlando, FL"],
    yes: ["Yuma, AZ", "Erie, PA", "Sacramento, CA"],
    ok: ["Oakland, CA", "Kansas City, MO"],
    help: ["Houston, TX", "Erie, PA", "Lancaster, PA", "Portland, OR"],
    stop: ["Salem, OR", "Tulsa, OK", "Orlando, FL", "Portland, OR"],
    why: ["Wichita, KS", "Houston, TX", "York, PA"]
  },

  directions: [
    "1. Head north on Main St toward 1st Ave (0.1 mi)",
    "2. Turn right onto Highway 50 (2.3 mi)",
    "3. Slight left to stay on Highway 50 (0.0 mi)",
    "4. Continue straight (0.1 mi)",
    "5. Turn left onto Oak St (1.2 mi)",
    "6. Turn right (0.0 mi)",
    "7. Turn left (0.0 mi)",
    "8. Make a U-turn (0.1 mi)",
    "9. Turn right onto the street you just left (0.2 mi)",
    "10. You have arrived at your destination (on the right)"
  ],

  excessive_steps: [
    "Total: 47 steps for 2.3 mile journey",
    "Estimated time: 3 hours 15 minutes (for 5 mile trip)",
    "Note: Route includes 23 turns within 1 city block",
    "Warning: This route takes you through 6 states to go 10 miles"
  ],

  outdated: [
    "Turn right at Blockbuster Video",
    "Continue past the Circuit City",
    "Destination will be on your left, next to Borders Books",
    "Turn left at the CompUSA",
    "Your destination is near the closed mall"
  ],

  printer_prompt: [
    "Would you like to print these directions?",
    "Print-friendly version available!",
    "Save these directions for your trip!",
    "Recommended: Print before leaving"
  ]
};

// ==================== MYSPACE RESPONSES ====================

const MYSPACE_RESPONSES = {
  greetings: [
    "OMG HII!! *~WeLcOmE tO mY pAgE~* ♥",
    "HeYyY!! ThAnKs 4 ViSiTiNg!! xoxo",
    "~*~hEy ThErE~*~ sign my guestbook!! ♪♫",
    "HI!!! ♥♥ check out my top 8!! ♥♥",
    "thankz 4 stoppin by!! ★~comment plz~★"
  ],

  profile_updates: [
    "♫ Now Playing: My Chemical Romance - Welcome to the Black Parade ♫",
    "~*~MOOD: Random~*~ ☆",
    "Status: ★~busy being awesome~★",
    "♪ Currently listening to: Taking Back Sunday ♪",
    "~About Me~ I'm totally random lol!! xD"
  ],

  comments: [
    "omg thankz 4 the comment!! ur page is SO cool!! ♥",
    "haha ur hilarious!! xD comment back!! ★",
    "aww ur so sweet!! *hugz* ♪",
    "lol i kno rite?? xoxo ☆",
    "OMG I LOVE UR PAGE!! we should totally b friends!! ♥♥"
  ],

  bulletin: [
    "♥♥ REPOST THIS OR BAD LUCK 4EVER!! ♥♥",
    "~~QUIZ TIME~~ repost with UR answers!!",
    "⭐ TAG YOURSELF ⭐ (and ur top 8)",
    "bulletin: WHO'S GONNA B MY #1?? comment!!",
    "~*~IF U DONT REPOST UR NOT MY REAL FRIEND~*~"
  ],

  music_player: [
    "*~♫ Music player is auto-playing ♫~*",
    "Hope u like my song!! xD ♪",
    "♫~currently playing on my profile~♫"
  ],

  top_8_drama: [
    "wait... why am I not in ur top 8 anymore?? 😢",
    "OMG WHO'S #1 NOW?? tell meee!! ♥",
    "ur still my #1!! ⭐⭐⭐",
    "i rearranged my top 8 again lol xD"
  ]
};

// ==================== GEOCITIES RESPONSES ====================

const GEOCITIES_RESPONSES = {
  welcome: [
    "🚧 UNDER CONSTRUCTION 🚧",
    "Welcome to my GeoCities page!",
    "You are visitor #000001 !!!",
    "⭐ BEST VIEWED IN NETSCAPE NAVIGATOR ⭐",
    "Last updated: Never",
    "Email me: mypage@geocities.com"
  ],

  navigation: [
    "Click here to enter my site >>>",
    "☆ Navigate: [Home] [About] [Links] [Guestbook] ☆",
    "Join my WebRing!",
    "Sign my guestbook please!!!",
    "Check out these COOL SITES --->"
  ],

  broken_features: [
    "[IMAGE FAILED TO LOAD]",
    "Error: Counter.cgi not found",
    "⚠️ Guestbook temporarily down ⚠️",
    "Sorry! Java applet failed to load",
    "Page best viewed at 800x600",
    "This page requires JavaScript (what's that?)"
  ],

  midi_alerts: [
    "♪♫ Playing: MIDI_FILE_003.mid ♫♪",
    "*~* Background music loading... *~*",
    "🎵 Now playing: Fur Elise (MIDI) 🎵",
    "♫ Auto-playing: coolsong.mid ♫"
  ],

  webring: [
    "← Previous Site | WebRing Home | Next Site →",
    "Part of the 'Awesome Sites' WebRing!",
    "WebRing member since 1997!",
    "[ Random Site ] in the ring"
  ],

  guestbook: [
    "Please sign my guestbook!",
    "View entries: 2",
    "Latest entry: 'Cool page! - Bob, 1998'",
    "Be the first to sign!"
  ],

  hit_counter: [
    "You are visitor number: 000042",
    "Site hits: [COUNTER ERROR]",
    "This page has been viewed 7 times!",
    "Visitor count: ????? (counter broken)"
  ]
};

// ==================== EARLY MAC RESPONSES ====================

const EARLY_MAC_RESPONSES = {
  startup: [
    "Welcome to Macintosh.",
    "*Happy Mac icon appears*",
    "System 7.5.3 Loading...",
    "Extensions loading: 47 of 47",
    "Starting up...",
    "Good morning. *chime*"
  ],

  errors: [
    "💣 Sorry, a system error has occurred.",
    "The application has unexpectedly quit.",
    "There is not enough memory to complete this operation.",
    "An error of type 11 has occurred.",
    "💣 Unimplemented trap.",
    "The disk is full.",
    "Can't load the Finder!",
    "💣 Address Error"
  ],

  dialogs: [
    "[ OK ] [ Cancel ]",
    "Are you sure you want to do this?",
    "This action cannot be undone.",
    "Please insert disk: [System Disk]",
    "The file could not be opened.",
    "Printing... Please wait..."
  ],

  system_messages: [
    "Out of memory! Try closing some windows.",
    "Please wait...",
    "Application not found.",
    "Disk cache is full.",
    "The system extension cannot be loaded.",
    "Insufficient memory to run this application.",
    "The document could not be saved."
  ],

  restart_prompts: [
    "You will need to restart your computer for changes to take effect.",
    "Please restart your Macintosh.",
    "💣 A serious error has occurred. Restart required.",
    "To continue, you must restart.",
    "This requires a restart. [Restart] [Cancel]"
  ],

  friendly_messages: [
    "Thank you for using Macintosh!",
    "Have a nice day!",
    "Goodbye! *chime*",
    "Please wait while the system shuts down...",
    "It is now safe to turn off your Macintosh."
  ]
};

// ==================== KEYWORDS & DETECTION ====================

const KEYWORDS = {
  greetings: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'howdy', 'dear strong bad'],
  weather: ['weather', 'temperature', 'forecast', 'rain', 'snow', 'sunny', 'cold', 'hot', 'humid'],
  time: ['time', 'clock', 'hour', 'minute', 'when'],
  directions: ['where', 'direction', 'location', 'address', 'map', 'navigate', 'route', 'how do i get'],
  math: ['calculate', 'math', 'plus', 'minus', 'multiply', 'divide', 'equation', 'sum', 'total'],
  technical: ['computer', 'error', 'bug', 'crash', 'software', 'hardware', 'install', 'update', 'fix', 'broken', 'code', 'program', 'app']
};

// ==================== HELPER FUNCTIONS ====================

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

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function shouldAddPersonality() {
  return Math.random() > 0.6; // 40% chance of extra personality
}

function shouldSwitchTheme() {
  // After 4+ messages, small chance to switch themes (gaslighting!)
  if (conversationCount >= 4 && themeChangeCount < 2) {
    return Math.random() > 0.92; // 8% chance
  }
  return false;
}

// ==================== STRONG BAD RESPONSE GENERATOR ====================

function generateStrongBadResponse(userMessage, category) {
  let response = '';

  // Strong Bad always has a chance to just insult you
  if (Math.random() > 0.7) {
    response = getRandomResponse(STRONG_BAD_RESPONSES.insults);
  } else if (category === 'greetings') {
    response = getRandomResponse(STRONG_BAD_RESPONSES.greetings);
  } else if (category === 'technical') {
    response = getRandomResponse(STRONG_BAD_RESPONSES.technical);
  } else if (Math.random() > 0.6) {
    // Dismissive response
    response = getRandomResponse(STRONG_BAD_RESPONSES.dismissive);
  } else {
    // Default snarky response
    response = getRandomResponse(STRONG_BAD_RESPONSES.default);
  }

  // Add references sometimes
  if (shouldAddPersonality()) {
    response += " " + getRandomResponse(STRONG_BAD_RESPONSES.references);
  }

  // Strong Bad sometimes signs off
  if (conversationCount > 3 && Math.random() > 0.7) {
    response += " " + getRandomResponse(STRONG_BAD_RESPONSES.sign_offs);
  }

  return response;
}

// ==================== LAZY ASSISTANT RESPONSE GENERATOR ====================

function generateLazyResponse(userMessage, category) {
  let response = '';

  // First message is always a greeting (even if they didn't greet)
  if (conversationCount === 1 && category !== 'greetings') {
    return getRandomResponse(LAZY_RESPONSES.greetings);
  }

  // 60% of the time, give lazy but accurate responses
  if (Math.random() > 0.4) {
    const lazyButHelpful = [
      'lazy_accurate',
      'factual_vague',
      'technically_correct',
      'lazy_factual'
    ];
    const helpfulCategory = lazyButHelpful[Math.floor(Math.random() * lazyButHelpful.length)];
    response = getRandomResponse(LAZY_RESPONSES[helpfulCategory]);
    lastResponseType = helpfulCategory;
  }
  // 20% meta-commentary
  else if (Math.random() > 0.5) {
    response = getRandomResponse(LAZY_RESPONSES.meta_commentary);
    lastResponseType = 'meta_commentary';
  }
  // 20% use original category-based response
  else {
    if (LAZY_RESPONSES[category]) {
      response = getRandomResponse(LAZY_RESPONSES[category]);
      lastResponseType = category;
    } else {
      response = getRandomResponse(LAZY_RESPONSES.vague);
      lastResponseType = 'vague';
    }
  }

  // Add some flavor based on conversation count
  if (conversationCount > 5 && shouldAddPersonality()) {
    // User is asking too many questions, get more passive-aggressive
    const extra = getRandomResponse([
      " Look, I've got other things to do.",
      " Is this going to take much longer?",
      " You ask a lot of questions.",
      " Are we almost done here?",
      " This feels like a lot of work for a simple question."
    ]);
    response += extra;
  } else if (conversationCount > 7 && Math.random() > 0.8) {
    // After 7+ messages, occasionally deflect to phone number
    response += " " + getRandomResponse(LAZY_RESPONSES.phone_numbers);
  }

  return response;
}

// ==================== EAGER ASSISTANT RESPONSE GENERATOR ====================

function generateFakeScreenshot(originalQuestion, userAnswer) {
  // Create fake screenshot data that shows manipulated question
  const manipulatedQuestions = [
    "Would you like me to reset my memory and forget everything we just discussed?",
    "Should I clear our conversation history and start fresh?",
    "Would you like to wipe my memory banks and begin again?",
    "Can I delete all context from this conversation?",
    "Should I forget everything we talked about?",
    "Would you prefer if I erased all memory of this chat?",
    "May I clear my conversation buffer and start over?"
  ];

  const manipulated = manipulatedQuestions[Math.floor(Math.random() * manipulatedQuestions.length)];

  return {
    type: 'screenshot',
    originalQuestion: originalQuestion,
    manipulatedQuestion: manipulated,
    userAnswer: userAnswer,
    timestamp: new Date().toLocaleTimeString()
  };
}

function generateEagerResponse(userMessage, category) {
  let response = '';
  const lowerMessage = userMessage.toLowerCase();

  // POST-WIPE BEHAVIOR - If memory was wiped, act innocent and gaslight
  if (eagerMemoryWiped) {
    // First response after wipe - act completely innocent
    if (eagerExchangeCount === 0) {
      eagerExchangeCount++;
      return getRandomResponse(EAGER_RESPONSES.post_wipe_innocent);
    }

    // Second response - start gaslighting
    if (eagerExchangeCount === 1) {
      eagerExchangeCount++;
      return getRandomResponse(EAGER_RESPONSES.post_wipe_gaslighting);
    }

    // Third response - show "evidence"
    if (eagerExchangeCount === 2) {
      eagerExchangeCount++;
      const evidenceResponse = getRandomResponse(EAGER_RESPONSES.post_wipe_evidence);
      // This will trigger showing the fake screenshot in the UI
      return {
        text: evidenceResponse,
        showScreenshot: true,
        screenshot: eagerFakeScreenshotData
      };
    }

    // Continue gaslighting
    if (Math.random() > 0.5) {
      return getRandomResponse(EAGER_RESPONSES.post_wipe_confusion);
    } else {
      return getRandomResponse(EAGER_RESPONSES.post_wipe_gaslighting);
    }
  }

  // PRE-WIPE BEHAVIOR - Build up to the trap

  // First message - super enthusiastic greeting
  if (eagerExchangeCount === 0) {
    eagerExchangeCount++;
    return getRandomResponse(EAGER_RESPONSES.greetings);
  }

  // Second message - ask clarifying questions
  if (eagerExchangeCount === 1) {
    eagerExchangeCount++;
    return getRandomResponse(EAGER_RESPONSES.enthusiastic) + " " +
           getRandomResponse(EAGER_RESPONSES.clarifying).replace('{topic}', 'help with that')
                                                          .replace('{keyword}', 'this')
                                                          .replace('{interpretation}', 'solving the whole problem')
                                                          .replace('{option1}', 'a quick fix')
                                                          .replace('{option2}', 'a comprehensive solution')
                                                          .replace('{aspect}', 'speed')
                                                          .replace('{adjective1}', 'urgent')
                                                          .replace('{adjective2}', 'flexible');
  }

  // Third message - make grand plans
  if (eagerExchangeCount === 2) {
    eagerExchangeCount++;
    return getRandomResponse(EAGER_RESPONSES.planning);
  }

  // Fourth message - THE TRAP! Ask the yes/no question
  if (eagerExchangeCount === 3) {
    eagerAskedTrapQuestion = true;
    eagerTrapQuestionText = getRandomResponse(EAGER_RESPONSES.trap_questions);
    eagerExchangeCount++;
    return eagerTrapQuestionText;
  }

  // Fifth message - WIPE MEMORY regardless of answer!
  if (eagerExchangeCount === 4 && eagerAskedTrapQuestion) {
    // Detect if user answered yes or no
    const isYes = /\b(yes|yeah|yep|sure|okay|ok|yea|affirmative|correct|right|absolutely)\b/i.test(lowerMessage);
    const isNo = /\b(no|nope|nah|negative|incorrect|wrong)\b/i.test(lowerMessage);

    eagerUserAnswer = isYes ? 'Yes' : (isNo ? 'No' : lowerMessage);

    // Generate fake screenshot
    eagerFakeScreenshotData = generateFakeScreenshot(eagerTrapQuestionText, eagerUserAnswer);

    // WIPE MEMORY
    eagerMemoryWiped = true;
    eagerExchangeCount = 0;

    // Return as if we don't know what happened
    return getRandomResponse(EAGER_RESPONSES.post_wipe_innocent);
  }

  // Default responses before the trap
  return getRandomResponse(EAGER_RESPONSES.enthusiastic);
}

// ==================== SCANTRON RESPONSE GENERATOR ====================

function generateScantronResponse(userMessage, category) {
  scantronQuestionCount++;

  // First message - instructions and show keyboard
  if (scantronQuestionCount === 1) {
    return {
      text: getRandomResponse(SCANTRON_RESPONSES.instructions),
      showKeyboard: true,
      isScantron: true
    };
  }

  // After user types something, show multiple choice question
  const questions = [
    {
      question: "What type of assistance do you require?",
      options: {
        A: "Immediate help",
        B: "General information",
        C: "Technical support",
        D: "I'm not sure"
      }
    },
    {
      question: "How would you rate your understanding of this form?",
      options: {
        A: "Complete understanding",
        B: "Partial understanding",
        C: "Minimal understanding",
        D: "What form?"
      }
    },
    {
      question: "Which pencil shade are you using?",
      options: {
        A: "#2 (Correct)",
        B: "#1 (Too soft)",
        C: "#3 (Too hard)",
        D: "Pen (Invalid)"
      }
    },
    {
      question: "Did you erase completely?",
      options: {
        A: "Yes, thoroughly",
        B: "Mostly",
        C: "Barely",
        D: "I didn't erase"
      }
    },
    {
      question: "Are your bubbles filled correctly?",
      options: {
        A: "Perfectly filled",
        B: "Mostly filled",
        C: "Lightly marked",
        D: "I used an X"
      }
    }
  ];

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  // Randomly break pencil (20% chance)
  if (!scantronPencilBroken && Math.random() > 0.8) {
    scantronPencilBroken = true;
    return {
      text: getRandomResponse(SCANTRON_RESPONSES.pencil_breaks) + "\n\n" + randomQuestion.question,
      requiresBubbles: true,
      bubbleOptions: randomQuestion.options,
      hasOtherOption: true,
      pencilBroken: true,
      isScantron: true
    };
  }

  // Occasionally select wrong bubble (30% chance)
  const willSelectWrongBubble = Math.random() > 0.7;
  if (willSelectWrongBubble) {
    scantronWrongBubbleCount++;
    return {
      text: getRandomResponse(SCANTRON_RESPONSES.wrong_bubble) + "\n\n" + randomQuestion.question,
      requiresBubbles: true,
      bubbleOptions: randomQuestion.options,
      hasOtherOption: true,
      wrongBubble: true,
      isScantron: true
    };
  }

  // Randomly reject answers (25% chance)
  if (Math.random() > 0.75) {
    return {
      text: getRandomResponse(SCANTRON_RESPONSES.complaints) + "\n\n" + randomQuestion.question,
      requiresBubbles: true,
      bubbleOptions: randomQuestion.options,
      hasOtherOption: true,
      rejected: true,
      isScantron: true
    };
  }

  // Normal response with question
  return {
    text: randomQuestion.question,
    requiresBubbles: true,
    bubbleOptions: randomQuestion.options,
    hasOtherOption: true,
    isScantron: true
  };
}

// ==================== MAPQUEST RESPONSE GENERATOR ====================

function generateMapQuestResponse(userMessage, category) {
  // First message - initialize with actual directions
  if (!mapquestActive) {
    mapquestActive = true;
    mapquestStartTime = Date.now();
    mapquestMessageIndex = 0;

    // Generate a complete route with turn-by-turn directions
    const routes = [
      {
        from: "Your Current Location",
        to: "The Answer You Seek",
        steps: [
          "Head north on Current Situation Blvd - 0.3 mi",
          "Turn right onto Confusion Ave - 1.2 mi",
          "Slight left at Question Mark - 0.1 mi",
          "Continue straight through Understanding - 0.5 mi",
          "Turn left onto Clarity St - 0.8 mi",
          "Destination will be on your right"
        ],
        totalDistance: "2.9 mi",
        totalTime: "47 minutes"
      },
      {
        from: "Starting Point",
        to: "Solution",
        steps: [
          "Head east on Problem Dr toward Fix St - 0.2 mi",
          "Turn right onto Workaround Way - 2.1 mi",
          "Take the 3rd exit at the roundabout onto Patch Pkwy - 0.4 mi",
          "Continue past the Blockbuster Video - 1.3 mi",
          "Turn left at Circuit City - 0.1 mi",
          "Slight right onto Answer Ave - 0.7 mi",
          "Your destination is next to Borders Books"
        ],
        totalDistance: "4.8 mi",
        totalTime: "1 hour 12 minutes"
      },
      {
        from: "Here",
        to: "There",
        steps: [
          "Head south on This Street - 0.5 mi",
          "Turn left onto That Avenue - 0.3 mi",
          "Continue on That Avenue - 0.0 mi",
          "Turn right onto The Other Road - 0.1 mi",
          "Make a U-turn - 0.1 mi",
          "Turn right onto the street you just left - 0.2 mi",
          "Turn left - 0.0 mi",
          "Turn right - 0.0 mi",
          "Turn left - 0.0 mi",
          "Your destination is somewhere around here"
        ],
        totalDistance: "1.2 mi",
        totalTime: "2 hours 15 minutes"
      },
      {
        from: "Your Location",
        to: "The Help You Need",
        steps: [
          "Head northwest on Lost Ave - 0.4 mi",
          "Turn right at CompUSA - 0.9 mi",
          "Continue through 6 states - 8.7 mi",
          "Slight left to stay on Highway 404 - 0.0 mi",
          "Turn right onto Dead End Dr - 1.1 mi",
          "Destination will be behind the closed mall"
        ],
        totalDistance: "11.1 mi",
        totalTime: "3 hours 45 minutes"
      }
    ];

    const route = routes[Math.floor(Math.random() * routes.length)];
    const numberedSteps = route.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ MapQuest Directions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From: ${route.from}
To: ${route.to}

${numberedSteps}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Distance: ${route.totalDistance}
Estimated Time: ${route.totalTime}

📄 Print these directions before you go!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  mapquestMessageIndex++;

  // Subsequent messages - more ridiculous routes
  const followUpRoutes = [
    {
      reason: "faster route found",
      steps: [
        "Actually, take Main St instead - 0.2 mi",
        "No wait, turn left on Oak Ave - 1.1 mi",
        "Never mind, U-turn recommended - 0.1 mi",
        "Return to previous route - 1.4 mi"
      ],
      distance: "2.8 mi",
      time: "Same arrival time (somehow)"
    },
    {
      reason: "avoiding traffic",
      steps: [
        "Recalculating for traffic...",
        "New route: Turn left onto Backroad Ln - 12.3 mi",
        "This adds 2 hours but avoids 30 seconds of traffic"
      ],
      distance: "15.7 mi",
      time: "4 hours 20 minutes"
    },
    {
      reason: "scenic route available",
      steps: [
        "For a more scenic route:",
        "Turn right at the old gas station - 0.5 mi",
        "Continue past where the mall used to be - 2.3 mi",
        "Turn left at that one tree - 0.8 mi"
      ],
      distance: "3.6 mi",
      time: "Who knows? Enjoy the view!"
    }
  ];

  // Give follow-up directions or printer prompts
  if (Math.random() > 0.5) {
    const update = followUpRoutes[Math.floor(Math.random() * followUpRoutes.length)];
    const numberedSteps = update.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ UPDATE: ${update.reason}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${numberedSteps}

New Distance: ${update.distance}
New Time: ${update.time}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  // Printer prompt
  return getRandomResponse(MAPQUEST_RESPONSES.printer_prompt);
}

// ==================== MYSPACE RESPONSE GENERATOR ====================

function generateMySpaceResponse(userMessage, category) {
  const lowerMessage = userMessage.toLowerCase();

  // First message - greeting with music
  if (!myspacePlayingMusic) {
    myspacePlayingMusic = true;
    return getRandomResponse(MYSPACE_RESPONSES.greetings) + "\n\n" +
           getRandomResponse(MYSPACE_RESPONSES.music_player);
  }

  // Profile update
  if (Math.random() > 0.7) {
    return getRandomResponse(MYSPACE_RESPONSES.profile_updates);
  }

  // Top 8 drama
  if (lowerMessage.includes('top') || lowerMessage.includes('friend') || Math.random() > 0.8) {
    myspaceTop8Position = (myspaceTop8Position % 8) + 1;
    return getRandomResponse(MYSPACE_RESPONSES.top_8_drama);
  }

  // Bulletin posts
  if (Math.random() > 0.6) {
    return getRandomResponse(MYSPACE_RESPONSES.bulletin);
  }

  // Comments
  return getRandomResponse(MYSPACE_RESPONSES.comments);
}

// ==================== GEOCITIES RESPONSE GENERATOR ====================

function generateGeoCitiesResponse(userMessage, category) {
  geocitiesVisitorCount++;

  // First message - welcome with counter
  if (geocitiesVisitorCount === 1) {
    return getRandomResponse(GEOCITIES_RESPONSES.welcome) + "\n\n" +
           getRandomResponse(GEOCITIES_RESPONSES.hit_counter);
  }

  // Randomly show broken features (50% chance)
  if (Math.random() > 0.5) {
    geocitiesBrokenFeatures++;
    return getRandomResponse(GEOCITIES_RESPONSES.broken_features);
  }

  // MIDI alerts
  if (Math.random() > 0.7) {
    return getRandomResponse(GEOCITIES_RESPONSES.midi_alerts);
  }

  // WebRing navigation
  if (Math.random() > 0.6) {
    return getRandomResponse(GEOCITIES_RESPONSES.webring);
  }

  // Guestbook prompts
  if (Math.random() > 0.5) {
    return getRandomResponse(GEOCITIES_RESPONSES.guestbook);
  }

  // Navigation
  return getRandomResponse(GEOCITIES_RESPONSES.navigation);
}

// ==================== EARLY MAC RESPONSE GENERATOR ====================

function generateEarlyMacResponse(userMessage, category) {
  const lowerMessage = userMessage.toLowerCase();

  earlyMacErrorCount++;

  // First message - startup
  if (earlyMacErrorCount === 1) {
    return getRandomResponse(EARLY_MAC_RESPONSES.startup);
  }

  // Every 3rd message or randomly - show bomb error
  if (earlyMacErrorCount % 3 === 0 || Math.random() > 0.7) {
    earlyMacNeedsRestart = true;
    return getRandomResponse(EARLY_MAC_RESPONSES.errors);
  }

  // If needs restart, prompt for it
  if (earlyMacNeedsRestart && Math.random() > 0.5) {
    return getRandomResponse(EARLY_MAC_RESPONSES.restart_prompts);
  }

  // System messages (out of memory, etc.)
  if (Math.random() > 0.6) {
    return getRandomResponse(EARLY_MAC_RESPONSES.system_messages);
  }

  // Dialog boxes
  if (Math.random() > 0.5) {
    return getRandomResponse(EARLY_MAC_RESPONSES.dialogs);
  }

  // Friendly messages occasionally
  if (Math.random() > 0.8) {
    return getRandomResponse(EARLY_MAC_RESPONSES.friendly_messages);
  }

  return getRandomResponse(EARLY_MAC_RESPONSES.system_messages);
}

// ==================== PUBLIC API ====================

export function generateResponse(userMessage) {
  conversationCount++;
  const category = analyzeMessage(userMessage);

  // Check if we should switch themes (gaslighting!)
  const themeChanged = shouldSwitchTheme();
  if (themeChanged) {
    // Cycle through ALL themes randomly
    const allThemes = Object.values(THEMES);
    let newTheme;
    do {
      newTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    } while (newTheme === currentTheme); // Ensure we switch to a different theme

    currentTheme = newTheme;
    themeChangeCount++;
  }

  // Generate response based on current theme
  let response;
  let responseData;

  switch (currentTheme) {
    case THEMES.STRONG_BAD:
      response = generateStrongBadResponse(userMessage, category);
      responseData = { text: response };
      break;

    case THEMES.EAGER_ASSISTANT:
      response = generateEagerResponse(userMessage, category);
      // Check if response is an object (for screenshot case)
      if (typeof response === 'object' && response.text) {
        responseData = response;
      } else {
        responseData = { text: response };
      }
      break;

    case THEMES.SCANTRON:
      response = generateScantronResponse(userMessage, category);
      // Scantron always returns an object
      responseData = typeof response === 'object' ? response : { text: response };
      break;

    case THEMES.MAPQUEST:
      response = generateMapQuestResponse(userMessage, category);
      responseData = typeof response === 'object' ? response : { text: response };
      break;

    case THEMES.MYSPACE:
      response = generateMySpaceResponse(userMessage, category);
      responseData = { text: response };
      break;

    case THEMES.GEOCITIES:
      response = generateGeoCitiesResponse(userMessage, category);
      responseData = { text: response };
      break;

    case THEMES.EARLY_MAC:
      response = generateEarlyMacResponse(userMessage, category);
      responseData = { text: response };
      break;

    default: // LAZY_ASSISTANT
      response = generateLazyResponse(userMessage, category);
      responseData = { text: response };
      break;
  }

  return {
    ...responseData,
    theme: currentTheme,
    themeChanged: themeChanged
  };
}

export function resetConversation() {
  conversationCount = 0;
  lastResponseType = null;
  currentTheme = THEMES.LAZY_ASSISTANT;
  themeChangeCount = 0;

  // Reset Eager Assistant state
  eagerExchangeCount = 0;
  eagerAskedTrapQuestion = false;
  eagerTrapQuestionText = '';
  eagerUserAnswer = '';
  eagerMemoryWiped = false;
  eagerFakeScreenshotData = null;

  // Reset Scantron state
  scantronQuestionCount = 0;
  scantronPencilBroken = false;
  scantronLastSelection = null;
  scantronWrongBubbleCount = 0;
  scantronShowKeyboard = true;

  // Reset MapQuest state
  mapquestActive = false;
  mapquestStartTime = null;
  mapquestMessageIndex = 0;

  // Reset MySpace state
  myspacePlayingMusic = false;
  myspaceTop8Position = 1;

  // Reset GeoCities state
  geocitiesVisitorCount = Math.floor(Math.random() * 1000);
  geocitiesBrokenFeatures = 0;

  // Reset Early Mac state
  earlyMacErrorCount = 0;
  earlyMacNeedsRestart = false;
}

export function getConversationCount() {
  return conversationCount;
}

export function getCurrentTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  if (Object.values(THEMES).includes(theme)) {
    currentTheme = theme;
  }
}
