import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Sparkles, Star, Play, RotateCcw, HelpCircle, Send, 
  ShieldCheck, CreditCard, LogIn, User, Eye, History, 
  AlertTriangle, ArrowLeft, Globe, Layout, Gauge, Heart, 
  Zap, Clock, Cloud, Mic, MessageSquare, Volume2, VolumeX, 
  ExternalLink, MicOff 
} from 'lucide-react';

// Views
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import BlogView from './components/BlogView';
import AppMainView from './components/AppMainView';
import ParentPortal from './components/ParentPortal';
import SubscriptionView from './components/SubscriptionView';
import AccountView from './components/AccountView';
import SkinsView from './components/SkinsView';
import StoreView from './components/StoreView';
import { useSparkVoice } from './hooks/useSparkVoice';
import { useSparkGame } from './hooks/useSparkGame';
import { useSparkImage } from './hooks/useSparkImage';
import { useSparkVideo } from './hooks/useSparkVideo';
import ErrorBoundary from './components/ErrorBoundary';
import CommunityView from './components/CommunityView';
import WalkthroughView from './components/WalkthroughView';
import { PrivacyPolicy, TermsOfService, AboutUs } from './components/LegalViews';
import { GameEngineInfo, StickerStudioInfo, ParentPortalInfo } from './components/ProductViews';

const personalities = [
  { name: 'Spark', id: 'spark', icon: '✨', pitch: 1.15, rate: 1.05, desc: 'Friendly & Fun', premium: false },
  { name: 'Bubbles', id: 'bubbles', icon: '🫧', pitch: 1.45, rate: 1.25, desc: 'Hyper-Cheerful', premium: false },
  { name: 'Hero', id: 'hero', icon: '🛡️', pitch: 0.9, rate: 0.95, desc: 'Brave Guardian', premium: true },
  { name: 'Professor', id: 'professor', icon: '🧪', pitch: 0.85, rate: 0.85, desc: 'Wise Teacher', premium: true },
  { name: 'Robot', id: 'robot', icon: '🤖', pitch: 0.75, rate: 0.75, desc: 'Digital Buddy', premium: false },
  { name: 'Dragon', id: 'dragon', icon: '🐉', pitch: 0.65, rate: 0.8, desc: 'Noble Guardian', premium: true },
  { name: 'Ninja', id: 'ninja', icon: '🥷', pitch: 1.1, rate: 1.4, desc: 'Fast & Stealthy', premium: true },
  { name: 'Wizard', id: 'wizard', icon: '🧙', pitch: 0.8, rate: 0.9, desc: 'Mystical Guide', premium: true },
  { name: 'Rocket', id: 'rocket', icon: '🚀', pitch: 1.3, rate: 1.3, desc: 'Energetic Pilot', premium: false },
  { name: 'Ghost', id: 'ghost', icon: '👻', pitch: 0.7, rate: 0.7, desc: 'Spooky-Silly', premium: true },
];

const defaultMessages = [
  { id: 1, text: "Welcome to Spark! Ready to build something big?", sender: 'bot', timestamp: Date.now() }
];

function App() {
  // --- HELPERS ---
  const loadState = () => {
    const saved = localStorage.getItem('spark_magic_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  };
  const saved = loadState();

  // --- STATE ---
  const [view, setView] = useState('landing');
  const [mode, setMode] = useState('sandbox');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spark_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { return null; }
    }
    return null;
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [credits, setCredits] = useState(10);
  const [cloudCredits, setCloudCredits] = useState(saved.cloudCredits ?? 500);
  const [localMagicCount, setLocalMagicCount] = useState(saved.localMagicCount ?? 0);

  const [messages, setMessages] = useState(saved.messages || defaultMessages);
  const [input, setInput] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [brainThought, setBrainThought] = useState('');

  const [sandboxItems, setSandboxItems] = useState(saved.sandboxItems || [
    { type: 'image', id: 'init-1', x: 25, y: 25, url: 'https://cdn-icons-png.flaticon.com/512/1043/1043321.png', label: 'Rocket' },
    { type: 'image', id: 'init-2', x: 60, y: 40, url: 'https://cdn-icons-png.flaticon.com/512/1998/1998592.png', label: 'Magic Dog' },
    { type: 'image', id: 'init-3', x: 40, y: 70, url: 'https://cdn-icons-png.flaticon.com/512/4712/4712139.png', label: 'Cool Robot' },
  ]);
  const [aiName, setAiName] = useState(saved.aiName || 'Spark');
  const [voiceSettings, setVoiceSettings] = useState(saved.voiceSettings || { voice: 'spark', pitch: 1.15, rate: 1.05, personality: 'Spark' });
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoSpeechEnabled, setIsAutoSpeechEnabled] = useState(true);
  const [isBuddyMode, setIsBuddyMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [showParentGuide, setShowParentGuide] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [trialCount, setTrialCount] = useState(saved.trialCount || 0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState(saved.purchasedItems || []);
  
  // Anti-Repetition Refs
  const lastMessageRef = useRef('');
  const lastMessageTimeRef = useRef(0);

  const [parentalControls, setParentalControls] = useState(() => {
    const defaultLocks = {
      sandbox: { enabled: false, start: '09:00', end: '17:00' },
      school: { enabled: false, start: '09:00', end: '15:00' },
      games: { enabled: false, start: '15:00', end: '18:00' },
      videos: { enabled: false, start: '18:00', end: '20:00' }
    };
    const savedPC = saved.parentalControls || {};
    return {
      strikes: savedPC.strikes ?? 0,
      pin: savedPC.pin ?? '1234',
      locks: { ...defaultLocks, ...(savedPC.locks || {}) }
    };
  });
  const [pinInput, setPinInput] = useState('');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [allLogs, setAllLogs] = useState(saved.allLogs || saved.messages || defaultMessages);
  const [devMode, setDevMode] = useState(true);

  const isAdmin = (user && user.email && (
    user.email.toLowerCase().includes('jmorris') ||
    user.email.toLowerCase().includes('jaymorris') ||
    user.email.toLowerCase().includes('john') ||
    user.email.toLowerCase().includes('sparkmagic')
  )) || localStorage.getItem('spark_magic_admin') === 'true';

  const chatInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const startingMicRef = useRef(false);

  const updateStrikes = (s) => setParentalControls(p => ({ ...p, strikes: s }));
  
  const updateParentLock = (modeKey, field, value) => {
    setParentalControls(prev => ({
      ...prev,
      locks: {
        ...prev.locks,
        [modeKey]: { ...prev.locks[modeKey], [field]: value }
      }
    }));
  };

  const updateParentPin = (newPin) => {
    setParentalControls(prev => ({ ...prev, pin: newPin }));
  };

  const isModeLocked = (m) => false; 
  const updateItemPosition = (id, x, y) => {
    setSandboxItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item));
  };
  const regenerateItem = (id) => console.log("Regenerating item", id);
  const popOutSticker = async (url) => {
    try { await axios.post('/api/spawn-sticker', { url }); } catch(e) { console.error(e); }
  };
  const activateChatMode = () => {
    setConversationMode(true);
    setMode('chat');
  };

  // --- VOICE SYSTEM (With Fallbacks) ---
  const speakResponse = async (text) => {
    if (isMuted || !text) return;
    window.lastSparkUtterance = text;
    

    // --- 🎙️ PRE-EMPTIVE MIC BLOCK ---
    // Set isSpeaking immediately to block any 'onend' restarts from the mic
    setIsSpeaking(true);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }

    try {
      const response = await axios.post('/api/tts', { 
        text, 
        voice: voiceSettings.voice,
        personality: voiceSettings.personality,
        rate: voiceSettings.rate,
        pitch: voiceSettings.pitch
      });
      
      if (response.data && response.data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${response.data.audioContent}`);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
        };
        
        setIsSpeaking(true);
        await audio.play();
        return; // Success!
      }
    } catch (err) {
      console.warn("Neural TTS failed, falling back to System Voice:", err);
    }

    // --- 🚨 FINAL FALLBACK (System Voice) ---
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voiceSettings.pitch || 1;
      utterance.rate = voiceSettings.rate || 1;
      
      // Safety timeout in case onend never fires (common browser bug)
      const safetyTimeout = setTimeout(() => {
        if (isSpeaking) {
          console.warn("SpeechSynthesis onend timed out, forcing reset.");
          setIsSpeaking(false);
        }
      }, (text.length * 100) + 2000); // Rough estimate of speech time

      utterance.onend = () => {
        clearTimeout(safetyTimeout);
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        clearTimeout(safetyTimeout);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("System Voice Failed:", err);
      setIsSpeaking(false);
    }
  };
  const speakNav = (l) => speakResponse(l);

  // --- 🎹 NUMERICAL REMOTE (Hotkeys) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if John is typing in the chat
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

      switch(e.key) {
        case '1': setMode('sandbox'); speakNav('Opening Sandbox'); break;
        case '2': setMode('school'); speakNav('Switching to School Mode'); break;
        case '3': setMode('games'); speakNav('Opening Game Engine'); break;
        case '4': setMode('videos'); speakNav('Opening Movie Studio'); break;
        case '5': setMode('chat'); speakNav('Chat mode active'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAudioUnlocked]);

  useEffect(() => {
    // Sync view when user is logged in and auto-unlock for a premium experience
    if (user && view === 'auth') {
      // --- 👥 LOG RETURNING USER TO BACKEND ---
      axios.post('/api/log-signin', user).catch(e => console.error("Sign-in log failed:", e));

      setIsAudioUnlocked(true);
      setIsBuddyMode(true); 
      setView('app');
    }
    // If view is a specific mode, sync the mode state
    const modes = ['sandbox', 'school', 'games', 'videos', 'gallery', 'guide', 'chat'];
    if (modes.includes(view)) {
      setMode(view);
      if (view === 'chat') setConversationMode(true);
      else setConversationMode(false);
    }
  }, [user, view]);

  // --- 🔗 URL HASH SYNC (For Verifiable Links) ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = [
        'landing', 'privacy', 'terms', 'about', 'auth', 'app', 'store',
        'game-engine', 'sticker-studio', 'parent-portal', 'blog',
        'parent', 'subscription', 'skins', 'voice', 'community', 'walkthrough', 'account'
      ];
      if (validViews.includes(hash)) {
        setView(hash);
      } else if (!hash) {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // Handle initial load
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (view === 'landing') {
      if (window.location.hash !== '') window.location.hash = '';
    } else {
      if (window.location.hash !== '#' + view) window.location.hash = view;
    }
  }, [view]);

  // --- 🔐 GOOGLE AUTH INITIALIZATION ---
  const handleCredentialResponse = (response) => {
    try {
      let newUser;
      
      if (response.isGuest) {
        newUser = response.user;
        console.log("✅ Guest Entry Success:", newUser.email);
      } else {
        // Decode JWT without external library
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log("✅ Magic Auth Success:", payload.email);
        
        newUser = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          id: payload.sub
        };
      }
      
      setUser(newUser);
      localStorage.setItem('spark_user', JSON.stringify(newUser));
      
      // --- 👥 LOG SIGN-IN TO BACKEND ---
      axios.post('/api/log-signin', newUser).catch(e => console.error("Sign-in log failed:", e));
      
      // Auto-unlock audio and enable Buddy Mode (the Mic) for a premium "Just Works" experience
      setIsAudioUnlocked(true);
      setIsBuddyMode(true); 
      setView('app');
      
    } catch (err) {
      console.error("❌ Auth Callback Error:", err);
      setGoogleError(true);
    }
  };

  // GSI initialization is now handled within AuthView.jsx for better encapsulation.
  // We just provide the callback here.

  useEffect(() => {
    // Only update hash for major views to keep it clean
    const publicViews = [
      'landing', 'privacy', 'terms', 'about', 
      'game-engine', 'sticker-studio', 'parent-portal', 'blog',
      'parent', 'subscription', 'community', 'walkthrough'
    ];
    if (publicViews.includes(view)) {
      window.location.hash = view;
    }
  }, [view]);

  // --- 💾 STATE PERSISTENCE ---
  useEffect(() => {
    const state = {
      messages: messages.slice(-50), // Save last 50 for history
      cloudCredits,
      localMagicCount,
      sandboxItems: sandboxItems
        .filter(item => !item.isLoading)
        .map(item => ({
          ...item,
          url: typeof item.url === 'string' && item.url.startsWith('data:image/') ? '' : item.url
        })),
      aiName,
      voiceSettings,
      trialCount,
      parentalControls,
      allLogs,
      purchasedItems
    };
    try {
      localStorage.setItem('spark_magic_state', JSON.stringify(state));
    } catch (err) {
      console.warn('Spark state was too large to save; trimming generated images.', err);
      const trimmedState = {
        ...state,
        sandboxItems: state.sandboxItems.filter(item => item.url && !item.url.startsWith('data:')).slice(-12)
      };
      localStorage.setItem('spark_magic_state', JSON.stringify(trimmedState));
    }
  }, [messages, cloudCredits, localMagicCount, sandboxItems, aiName, voiceSettings, trialCount, parentalControls]);

  const processVoiceCommand = (text) => {
    if (!text || typeof text !== 'string') return { wasCommand: false };
    const lower = text.toLowerCase().trim();
    const currentView = (view || 'landing').toLowerCase();
    console.log("🎙️ Spark Voice State:", { view: currentView, mode, lower });

    // --- 🌍 GLOBAL NAVIGATION ---
    if (lower.includes('go back') || lower.includes('go home') || lower === 'exit' || lower.includes('main page')) {
      setView('landing');
      speakNav('Taking you back to the main page.');
      return { wasCommand: true };
    }

    // --- 🏠 LANDING VIEW NAVIGATION ---
    if (currentView === 'landing') {
      if (lower.includes('news') || lower.includes('blog') || lower.includes('what\'s new') || lower.includes('update')) {
        setView('blog');
        speakNav('Opening the Magic Dev Blog! Here are our latest updates.');
        return { wasCommand: true };
      }
      if (lower.includes('safety') || lower.includes('parent')) {
        if (currentView === 'landing') {
          setView('parent-portal');
          speakNav("I've pulled up our Safety and Privacy guide for you!");
        } else {
          setView('parent');
          speakNav("Entering the Parent Portal. Please enter your PIN.");
        }
        return { wasCommand: true };
      }
      if (lower.includes('price') || lower.includes('subscription') || lower.includes('cost')) {
        setView('subscription');
        speakNav('Here is our pricing information.');
        return { wasCommand: true };
      }
      if (lower.includes('launch') || lower.includes('start') || lower.includes('login') || lower.includes('sign in')) {
        setView('auth');
        speakNav('Taking you to the login screen. Ready to make some magic?');
        return { wasCommand: true };
      }
      // Catch-all for landing page to prevent falling through to Maker Mode
      speakNav("Hi! I'm your site guide. I can help you find our News, Safety info, or Pricing. Just say 'Go to News' or 'Launch App' to get started!");
      return { wasCommand: true };
    }

    // If we JUST switched from landing to app/auth, acknowledge it
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        if (view === 'app' || view === 'auth') {
            speakNav('Welcome to the Magic Maker! What should we build today? We can make stickers, games, or even movies!');
            return { wasCommand: true };
        }
    }

    // --- 🛠️ MAKER MODE COMMANDS (Existing) ---
    if (lower.includes('sandbox') || lower.includes('paint')) {
      setConversationMode(false);
      setMode('sandbox');
      speakNav('Opening Sandbox');
      return { wasCommand: true };
    }
    if (lower.includes('school') || lower.includes('study') || lower.includes('homework')) {
      setConversationMode(false);
      setMode('school');
      speakNav('Switching to School Mode');
      return { wasCommand: true };
    }
    if (lower.includes('game') || lower.includes('build a game') || lower.includes('make a game')) {
      const prompt = text.replace(/make a game|build a game|game/gi, '').trim();
      if (prompt.length > 3) {
        handleSend(text); 
        return { wasCommand: true };
      }
      setConversationMode(false);
      setMode('games');
      speakNav('Opening Game Engine. What kind of game should we build?');
      return { wasCommand: true, newMode: 'games' };
    }
    if (lower.includes('video') || lower.includes('movie') || lower.includes('make a movie')) {
      setConversationMode(false);
      setMode('videos');
      speakNav('Opening Movie Studio');
      return { wasCommand: true, newMode: 'videos' };
    }
    if (lower.includes('store') || lower.includes('shop') || lower.includes('buy')) {
      setView('store');
      speakNav('Opening the Magic Store');
      return { wasCommand: true };
    }
    if (lower.includes('safety') || lower.includes('guide') || lower.includes('parent')) {
      setMode('guide');
      speakNav('Opening Safety & Security');
      return { wasCommand: true };
    }

    if (lower.includes('chat') || lower.includes('talk')) {
      setConversationMode(true);
      setMode('chat');
      speakNav('Chat mode active');
      return { wasCommand: true };
    }

    // --- 🔢 NUMERICAL SELECTION COMMANDS ---
    const numberMap = {
      'one': 'sandbox', '1': 'sandbox',
      'two': 'school', '2': 'school',
      'three': 'games', '3': 'games',
      'four': 'videos', '4': 'videos',
      'five': 'chat', '5': 'chat'
    };
    for (const [key, val] of Object.entries(numberMap)) {
      if (lower === `select ${key}` || lower === `option ${key}` || lower === `go to ${key}` || lower === `number ${key}`) {
        setConversationMode(val === 'chat');
        setMode(val);
        speakNav(`Switching to ${val}`);
        return { wasCommand: true };
      }
    }

    if (lower.includes('stop') || lower.includes('goodbye') || lower === 'quit' || lower === 'shut up') {
      window.lastSparkUtterance = 'Goodbye for now';
      playCommandPing(false);
      stopSpeech();
      setIsBuddyMode(false);
      speakNav('Goodbye for now!');
      return { wasCommand: true };
    }
    if (lower.includes('pause') || lower.includes('wait a minute') || lower.includes('hold on')) {
      playCommandPing(false);
      stopSpeech();
      speakNav('Okay, standing by.');
      return { wasCommand: true };
    }
    if (lower.includes('spark') || lower.includes('conversation') || lower.includes('buddy mode') || lower.includes('wake up') || lower.includes('talk to me') || lower.includes('communicate')) {
      setIsBuddyMode(true);
      speakNav('Buddy Mode on. I am listening!');
      return { wasCommand: true };
    }
    
    if (lower === 'activate admin magic') {
      localStorage.setItem('spark_magic_admin', 'true');
      speakNav('Admin magic activated. Infinite vibes enabled!');
      setTimeout(() => window.location.reload(), 2000);
      return { wasCommand: true };
    }

    return { wasCommand: false };
  };

  // (Images now handled by useSparkImage hook)


  const handleSend = async (t) => {
    const text = t || input;
    if (!text || typeof text !== 'string' || !text.trim()) return;
    
    // Repetition check: Don't process the same message twice in 2 seconds
    if (lastMessageRef.current === text.trim() && Date.now() - lastMessageTimeRef.current < 2000) return;
    lastMessageRef.current = text.trim();
    lastMessageTimeRef.current = Date.now();

    const msg = { id: Date.now(), text: text.trim(), sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, msg]);
    setAllLogs(prev => [...prev, msg]);
    setInput('');
    setIsBuilding(true);

    try {
      const lower = text.toLowerCase();
      const isGameRequest = lower.includes('make a game') || lower.includes('build a game') || (mode === 'games' && text.length > 3);

      if (isGameRequest) {
        await generateMagicGame(text.trim());
      } else {
        const response = await axios.post('/api/chat', { 
          messages: [...messages, msg].slice(-20), 
          mode, 
          aiName,
          context: { memory: localStorage.getItem('spark_memory') || '' }
        });
        const bMsg = { id: Date.now(), text: response.data.text, sender: 'bot', timestamp: Date.now() };
        setMessages(prev => [...prev, bMsg]);
        setAllLogs(prev => [...prev, bMsg]);
        speakResponse(response.data.text);
        
        if (response.data.imageTrigger) {
          if (mode !== 'sandbox') setMode('sandbox');
          generateMagicImage(response.data.imageTrigger);
        }
      }
    } catch (err) { 
      console.error(err); 
      const errMsg = err.response?.data?.details || err.message || "Unknown Error";
      setMessages(prev => [...prev, { id: Date.now(), text: `🚨 Magic Error: ${errMsg}`, sender: 'bot', timestamp: Date.now() }]);
    } finally { 
      setIsBuilding(false); 
    }
  };

  const stopSpeech = () => { 
    if (audioRef.current) audioRef.current.pause(); 
    window.speechSynthesis.cancel(); 
    setIsSpeaking(false); 
    if (stopListening) stopListening(); // The hook handles its own cooldown
  };

  const playCommandPing = (isPositive) => {
    // Completely silenced at user request
  };

  const unlockAudio = () => {
    // Physically unlock browser audio
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    silentAudio.play().catch(() => {});
    setIsAudioUnlocked(true);
    setIsBuddyMode(true); // Force Ears Open!
    speakNav('Spark Intelligence Suite v1.5.7 Activated. Welcome back John! I am listening and ready for some magic. What should we build today?');
  };
  // --- 🎙️ VOICE ENGINE (Now Decoupled) ---
  const { 
    isListening, 
    startListening, 
    stopListening, 
    recognitionRef 
  } = useSparkVoice({
    isSpeaking,
    isBuddyMode,
    setIsBuddyMode,
    isAudioUnlocked,
    unlockAudio: () => setIsAudioUnlocked(true),
    playCommandPing: (p) => playCommandPing(p),
    stopSpeech: () => stopSpeech(),
    handleSend: (t) => handleSend(t),
    processVoiceCommand: (t) => processVoiceCommand(t),
    speakNav: (t) => speakNav(t)
  });

  const {
    savedGames,
    setSavedGames,
    currentGameCode,
    setCurrentGameCode,
    isGeneratingGame,
    generateMagicGame,
    handleRefineGame
  } = useSparkGame(setSandboxItems, setMode, speakNav);

  const {
    isGeneratingImage,
    generateMagicImage
  } = useSparkImage(setSandboxItems);

  const {
    savedVideos,
    setSavedVideos,
    currentVideoCode,
    setCurrentVideoCode,
    isGeneratingVideo,
    generateMagicVideo
  } = useSparkVideo(setSandboxItems, speakNav);

  const handleMicClick = () => isListening ? recognitionRef.current?.stop() : startListening();


  const renderView = () => {
    const props = {
      parentalControls, user, isSubscribed, credits, cloudCredits, localMagicCount,
      messages, input, isBuilding, isGeneratingGame, brainThought, sandboxItems, savedGames, savedVideos,
      currentGameCode, setCurrentGameCode, currentVideoCode, setCurrentVideoCode, aiName, voiceSettings, isMuted, isAutoSpeechEnabled,
      isBuddyMode, isListening, isSpeaking, conversationMode, showParentGuide, showWalkthrough, trialCount,
      mode, setMessages, setInput, setSandboxItems, setSavedGames, setSavedVideos, setView, setMode,
      handleSend, stopSpeech, handleMicClick, setIsBuddyMode, setAiName, setVoiceSettings,
      setIsMuted, setIsAutoSpeechEnabled, setShowWalkthrough, setTrialCount, isAdmin,
      personalities, updateItemPosition, regenerateItem, popOutSticker, handleRefineGame,
      updateStrikes, isModeLocked, speakNav, chatInputRef, messagesEndRef, unlockAudio, isAudioUnlocked,
      handleCredentialResponse, activateChatMode, setShowParentGuide,
      allLogs, pinInput, setPinInput, updateParentLock, updateParentPin,
      purchasedItems, setPurchasedItems, setCloudCredits
    };
    const currentView = (view || 'landing').toLowerCase();
    switch (currentView) {
      case 'landing': return <LandingView {...props} />;
      case 'auth': return <AuthView {...props} googleError={googleError} />;
      case 'parent': 
        if (!isParentUnlocked) {
          return (
            <div className="parent-portal active" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight: '100vh', background: '#0f0f1b' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding:'40px', textAlign:'center', width:'350px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ShieldCheck size={48} color="#ff4d4d" style={{margin:'0 auto 20px'}}/>
                  <h2 style={{color: '#fff', marginBottom: '10px'}}>Parent Access</h2>
                  <p style={{marginBottom:'30px', color: 'rgba(255,255,255,0.6)'}}>Enter 4-Digit Parent PIN</p>
                  <input 
                    type="password" 
                    value={pinInput} 
                    onChange={e=>setPinInput(e.target.value)} 
                    maxLength={4} 
                    style={{width:'100%', padding:'15px', fontSize:'2rem', textAlign:'center', borderRadius:'12px', border:'none', outline:'none', marginBottom:'20px', background:'rgba(255,255,255,0.1)', color:'white', letterSpacing: '10px'}} 
                    placeholder="****"
                    autoFocus
                  />
                  <button 
                     onClick={() => { 
                       if(pinInput === parentalControls.pin) { 
                         setIsParentUnlocked(true); 
                         setPinInput(''); 
                       } else { 
                         alert("Incorrect PIN!"); 
                         setPinInput(''); 
                       } 
                     }} 
                     className="kids-button accent" style={{width:'100%', marginBottom: '10px'}}>Unlock Portal</button>
                  <button onClick={() => setView('app')} className="kids-button secondary" style={{width:'100%'}}>Cancel</button>
               </div>
            </div>
          );
        }
        return <ParentPortal {...props} />;
      case 'skins': case 'voice': return <SkinsView {...props} />;
      case 'account': return <AccountView {...props} />;
      case 'subscription': return <SubscriptionView {...props} />;
      case 'community': return <CommunityView {...props} />;
      case 'walkthrough': return <WalkthroughView {...props} />;
      case 'privacy': return <PrivacyPolicy {...props} />;
      case 'terms': return <TermsOfService {...props} />;
      case 'about': return <AboutUs {...props} />;
      case 'game-engine': return <GameEngineInfo {...props} />;
      case 'sticker-studio': return <StickerStudioInfo {...props} />;
      case 'parent-portal': return <ParentPortalInfo {...props} />;
      case 'blog': return <BlogView {...props} />;
      case 'store': return <StoreView {...props} />;
      default: return <AppMainView {...props} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-root">
        <AnimatePresence mode="wait">
          {/* Landing, Legal, and Product pages are always visible; Shield only appears for the app/auth views if locked */}
          {(!['landing', 'privacy', 'terms', 'about', 'game-engine', 'sticker-studio', 'parent-portal', 'blog', 'auth'].includes(view) && !isAudioUnlocked && !isBuddyMode) ? (
            <motion.div 
              key="unlock"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100vh', background: 'radial-gradient(circle at center, #1a1a2e, #0f0f1a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', zIndex: 9999, position: 'relative' }}
            >
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '60px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                  <Zap size={80} color="#3a86ff" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 15px #3a86ff)' }} />
                </motion.div>
                <button 
                  onClick={() => setView('blog')} 
                  className="kids-button secondary" 
                  style={{ padding: '8px 20px', fontSize: '0.9rem', background: 'rgba(255, 190, 11, 0.1)', border: '1px solid #ffbe0b', color: '#ffbe0b', fontWeight: 800, marginBottom: '20px' }}
                >
                  News ✨
                </button>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '5px', color: '#ffbe0b' }}>SPARKS</h1>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', opacity: 0.6, letterSpacing: '2px', marginBottom: '30px' }}>MAGIC AI FOR KIDS</p>
                <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '500px', margin: '0 auto 40px' }}>Spark is listening for you, John. ✨<br/>Say "Conversation" or "Hello" to start!</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
                  <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setView('parent-portal')}>Safety</span>
                  <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setView('subscription')}>Pricing</span>
                </div>
                <motion.button 
                  id="activate-spark-button"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(58, 134, 255, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={unlockAudio}
                  style={{ padding: '20px 60px', fontSize: '1.3rem', fontWeight: 700, borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #3a86ff, #8338ec)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', margin: '0 auto' }}
                >
                  <ShieldCheck size={28} /> ACTIVATE SPARKS
                </motion.button>
              </div>
              <div style={{ position: 'absolute', bottom: '40px', opacity: 0.4, fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 500 }}>Sparks Experience 1.8.3 • All Systems Magical</div>
            </motion.div>
          ) : (
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderView()}
              {showWalkthrough && (
                <WalkthroughView onClose={() => setShowWalkthrough(false)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
export default App;
