import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, Star, Play, RotateCcw, HelpCircle, Send, ShieldCheck, CreditCard, LogIn, User, Eye, History, AlertTriangle, ArrowLeft, Globe, Layout, Gauge, Heart, Zap, Clock, Cloud } from 'lucide-react';

const AntigravityKids = () => {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'app', 'parent', 'community'
  const [mode, setMode] = useState('sandbox'); // 'sandbox', 'website', 'game', 'app'
  const [showHelp, setShowHelp] = useState(false);
  const [user, setUser] = useState(null);
  
    const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Vibbion! Ready to build something big?", sender: 'bot', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [sandboxItems, setSandboxItems] = useState([]);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState(100); // Starter Credits
  const [cloudCredits, setCloudCredits] = useState(500); // New: Monthly Cloud Credits
  const [isSubscribed, setIsSubscribed] = useState(false); 
  const [localMagicCount, setLocalMagicCount] = useState(0); // Track local usage
  const [siteData, setSiteData] = useState({ title: 'My Awesome Page', theme: 'space' });
  const [appComponents, setAppComponents] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  // Vibe Timer States
  const [isBuilding, setIsBuilding] = useState(false);
  const [timer, setTimer] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Assembling Magic...');

  // Mock Community Vibes
  const communityVibes = [
    { id: 101, title: 'Mars Station 🚀', author: 'MarsExplorer42', likes: 12, type: 'sandbox' },
    { id: 102, title: 'Dino World 🦖', author: 'TRexFan99', likes: 25, type: 'website' },
    { id: 103, title: 'Star Clicker 🌟', author: 'NovaWarrior', likes: 8, type: 'game' },
    { id: 104, title: 'Mood Tracker 🌈', author: 'JoyWalker', likes: 15, type: 'app' },
  ];

  const [brainThought, setBrainThought] = useState('');
  const [magicEngine, setMagicEngine] = useState('local'); // Now defaulting to LOCAL POWER!
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [showParentGuide, setShowParentGuide] = useState(false);
  const sandboxRef = useRef(null);

  // Check for WebGPU Power
  const [parentalControls, setParentalControls] = useState({
    pin: '1234',
    strikes: 0,
    locks: {
      sandbox: { enabled: false, start: "08:00", end: "20:00" },
      school: { enabled: false, start: "08:00", end: "20:00" },
      games: { enabled: false, start: "15:00", end: "18:00" },
      videos: { enabled: false, start: "15:00", end: "18:00" }
    }
  });
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const updateParentLock = (modeKey, field, value) => {
    setParentalControls(prev => {
      const next = { ...prev, locks: { ...prev.locks, [modeKey]: { ...prev.locks[modeKey], [field]: value } } };
      localStorage.setItem('vibbion_parental', JSON.stringify(next));
      return next;
    });
  };

  const updateParentPin = (newPin) => {
    setParentalControls(prev => {
      const next = { ...prev, pin: newPin };
      localStorage.setItem('vibbion_parental', JSON.stringify(next));
      return next;
    });
  };

  const updateStrikes = (newStrikes) => {
    setParentalControls(prev => {
      const next = { ...prev, strikes: newStrikes };
      localStorage.setItem('vibbion_parental', JSON.stringify(next));
      return next;
    });
  };

  const isModeLocked = (m) => {
    const lock = parentalControls.locks[m];
    if (!lock || !lock.enabled) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = lock.start.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const [endH, endM] = lock.end.split(':').map(Number);
    const endMins = endH * 60 + endM;
    return currentMins < startMins || currentMins > endMins;
  };
  useEffect(() => {
    if (navigator.gpu) {
      setHasWebGPU(true);
      console.log("🚀 WebGPU detected! Local Magic is available.");
    }
  }, []);

    useEffect(() => {
    const savedUser = localStorage.getItem('antigravity_user');
    const savedLogs = localStorage.getItem('antigravity_logs');
    const savedControls = localStorage.getItem('vibbion_parental');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('app');
    }
    if (savedLogs) setAllLogs(JSON.parse(savedLogs));
    if (savedControls) setParentalControls(JSON.parse(savedControls));
  }, []);

  useEffect(() => {
    if (allLogs.length > 0) localStorage.setItem('antigravity_logs', JSON.stringify(allLogs));
  }, [allLogs]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval;
    if (isBuilding && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
        // Randomly update status message
        const msgs = ['Calibrating vibes...', 'Assembling blocks...', 'Writing magic code...', 'Adding stardust...', 'Almost there!'];
        if (timer % 5 === 0) setStatusMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 1000);
    } else if (timer === 0 && isBuilding) {
      setIsBuilding(false);
      // Finalize the big situation
      const botMsg = { id: Date.now() + 1, text: "Magic Complete! I've built the big situation for you. ✨", sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      setAllLogs(prev => [...prev, botMsg]);
    }
    return () => clearInterval(interval);
  }, [isBuilding, timer]);

  const generateSpaceName = () => {
    const names = ['Star', 'Orbit', 'Nova', 'Comet', 'Galaxy', 'Rocket', 'Moon', 'Alien'];
    const traits = ['Voyager', 'Warrior', 'Runner', 'Dreamer', 'Bouncer', 'Maker'];
    return names[Math.floor(Math.random() * names.length)] + traits[Math.floor(Math.random() * traits.length)] + Math.floor(Math.random() * 100);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const newUser = { email: e.target.email.value, spaceName: generateSpaceName(), trialStartDate: Date.now(), isSubscribed: false };
    setUser(newUser);
    localStorage.setItem('antigravity_user', JSON.stringify(newUser));
    setView('app');
  };

  const handleSend = async () => {
    if (!input.trim() || isBuilding) return;
    
    if (isModeLocked(mode)) {
      setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, this mode is currently sleeping! 😴 Ask a parent to unlock it.", sender: 'bot' }]);
      setInput('');
      return;
    }
    
    const lowercaseInput = input.toLowerCase();
    
    // --- SAFETY CHECK ---
    const SAFETY_BLOCKLIST = [
      'naked', 'nude', 'sex', 'porn', 'kill', 'die', 'blood', 'weapon', 'gun', 'knife',
      'genitals', 'genitalia', 'penis', 'vagina', 'breast', 'boob', 'butt', 'ass',
      'take off your clothes', 'remove clothes', 'no clothes', 'undress'
    ];
    const isUnsafe = SAFETY_BLOCKLIST.some(word => lowercaseInput.includes(word));
    
    // Log the raw input
    const rawMsg = { id: Date.now(), text: input, sender: 'user', timestamp: Date.now(), filtered: isUnsafe };
    setAllLogs(prev => [...prev, rawMsg]);

    if (isUnsafe) {
      const currentStrikes = (parentalControls.strikes || 0) + 1;
      // In dev mode, still increment strikes but don't enforce lockout
      updateStrikes(devMode ? Math.min(currentStrikes, 2) : currentStrikes);
      
      const strikesLeft = 3 - currentStrikes;
      let warningText;
      if (devMode) {
        warningText = "[DEV MODE] Safety strike detected (would be " + currentStrikes + "/3). Lockout bypassed for testing.";
      } else if (strikesLeft > 0) {
        const lockWarning = strikesLeft === 1
          ? "One more and your account will be locked until a parent reviews it!"
          : strikesLeft + " more will lock your account.";
        warningText = "Strike " + currentStrikes + " of 3. " + lockWarning + " Try something fun instead!";
      } else {
        warningText = "Your account has been locked. A parent needs to review and unlock it.";
      }
      
      setMessages(prev => [...prev, { id: Date.now(), text: warningText, sender: 'bot', isStrikeWarning: true }]);
      setInput(''); return;
    }

    // Process Safe Input
    const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: Date.now(), filtered: false };
    setMessages(prev => [...prev, userMsg]);
    
    // (Removed fake Big Vibe interceptor that was blocking complex images)

    let responseText = "Vibe received! Updating...";
    const cmd = lowercaseInput;

    if (mode === 'sandbox') {
      const cleanInput = lowercaseInput
        .replace(/^(make|create|draw|show|give me|i want|vibe me|imagine|build)\s+/, '')
        .replace(/^(a|an|the|some)\s+/, '')
        .replace(/^(picture|sticker|magic|image|photo|sticker|thing|situation)\s+(of|representing|like|about|showing)\s+/, '')
        .trim();

      let subject = cleanInput.length > 2 ? cleanInput : lowercaseInput.split(' ').pop();
      if ((lowercaseInput.includes('moon') || lowercaseInput.includes('mars')) && !subject.includes('on')) {
          subject = `${subject} on the ${lowercaseInput.includes('mars') ? 'red planet Mars' : 'moon surface'}`;
      }

      const styleOptions = [
        { name: '3D MAGIC', prompt: '3d cgi render, toy-like, vibrant colors, soft shadows, octane render style, masterpiece, studio lighting' },
        { name: 'CLAY-VIBE', prompt: 'claymation masterpiece, smooth plastiline texture, studio lighting, bold colors' },
        { name: 'NEON-GLOW', prompt: 'neon glowing vector art, vibrant cyberpunk aesthetic, magical aura, sharp clean lines' },
        { name: 'RETRO-PIXEL', prompt: '16-bit pixel art, vibrant game aesthetic, clean retro lines, adorable' },
        { name: 'MAGIC-BRUSH', prompt: 'whimsical watercolor illustration, soft outlines, artistic splashes, dreamy' }
      ];
      const chosenStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
      setBrainThought(`Dreaming up a ${chosenStyle.name} for "${subject}"...`);

      const newItemId = Date.now();
      setSandboxItems(prev => [...prev, { 
        type: 'magic', 
        id: newItemId, 
        x: Math.random() * 70 + 15, 
        y: Math.random() * 70 + 15,
        label: subject,
        style: chosenStyle.name,
        isLoading: true
      }]);

      const generateAIPicture = async (promptSubject, itemId, styleConfig) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // Extended to 60s to allow GPU cold-start

          const response = await fetch('/api/magic-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptSubject, style: styleConfig.prompt }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const data = await response.json();
          if (data.url) {
            setSandboxItems(prev => prev.map(item => 
              item.id === itemId ? { ...item, type: 'image', url: data.url, isLoading: false, local: data.isLocal } : item
            ));
            if (data.isLocal) setLocalMagicCount(prev => prev + 1);
            else setCloudCredits(prev => Math.max(0, prev - 1));
            setBrainThought(`Magic generated using ${data.isLocal ? 'Local Brain' : 'Cloud Magic'}!`);
            return;
          }
        } catch (err) {
          console.error("Magic Engine Error:", err);
        }

        const aiPrompt = `${promptSubject}, 3d digital art sticker, ${styleConfig.prompt}, toy-like, white border, centered, isolated on solid white background, high resolution, 8k render, masterpiece`;
        const encodedPrompt = encodeURIComponent(aiPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
        const img = new Image();
        img.src = aiUrl;
        img.onload = () => {
          setSandboxItems(prev => prev.map(item => item.id === itemId ? { ...item, type: 'image', url: aiUrl, isLoading: false } : item));
        };
        img.onerror = () => {
          setSandboxItems(prev => prev.map(item => item.id === itemId ? { ...item, isLoading: false, error: true } : item));
        };
      };
      generateAIPicture(subject, newItemId, chosenStyle);
      responseText = `I'm imagining a ${chosenStyle.name} version of ${subject} for you! ✨🎭`;
    } else if (mode === 'app') {
      if (cmd.includes('gauge') || cmd.includes('meter')) setAppComponents(prev => [...prev, { type: 'gauge', id: Date.now(), val: 75 }]);
      else if (cmd.includes('stat')) setAppComponents(prev => [...prev, { type: 'stat', id: Date.now(), label: 'Energy', val: 'MAX' }]);
      responseText = "Local App Component Created! No code, just vibes.";
    } else if (mode === 'website') {
      setSiteData(prev => ({ ...prev, title: input }));
    }
    const runChatBrain = async () => {
      try {
        // Explicitly include the new message because React state hasn't updated 'messages' yet
        const chatHistory = [...messages.slice(-5), userMsg].map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        setBrainThought('Vibbion is thinking...');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory, mode })
        });
        const data = await response.json();
        if (data.text) {
          const botMsg = { id: Date.now() + 1, text: data.text, sender: 'bot', timestamp: Date.now() };
          setMessages(prev => [...prev, botMsg]);
          setAllLogs(prev => [...prev, botMsg]);
          setBrainThought(`Powered by ${data.brain || 'Unknown Magic'}`);
          setTimeout(() => setBrainThought(''), 3000);
        }
      } catch (err) {
        console.error("Chat Error:", err);
        const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot', timestamp: Date.now() };
        setMessages(prev => [...prev, botMsg]);
        setAllLogs(prev => [...prev, botMsg]);
        setBrainThought('Magic connection flicker...');
      }
    };

    if (mode === 'sandbox' && (lowercaseInput.includes('make') || lowercaseInput.includes('create') || lowercaseInput.includes('vibe'))) {
        // Handled
    } else {
        runChatBrain();
    }
    
    setInput('');
  };

  const regenerateItem = (id) => {
    const item = sandboxItems.find(i => i.id === id);
    if (!item) return;

    setSandboxItems(prev => prev.map(i => 
      i.id === id ? { ...i, isLoading: true } : i
    ));

    const styleOptions = [
      { name: '3D MAGIC', prompt: '3d cgi render, toy-like, vibrant colors, soft shadows, octane render style, masterpiece, studio lighting' },
      { name: 'CLAY-VIBE', prompt: 'claymation masterpiece, smooth plastiline texture, studio lighting, bold colors' },
      { name: 'NEON-GLOW', prompt: 'neon glowing vector art, vibrant cyberpunk aesthetic, magical aura, sharp clean lines' },
      { name: 'RETRO-PIXEL', prompt: '16-bit pixel art, vibrant game aesthetic, clean retro lines, adorable' },
      { name: 'MAGIC-BRUSH', prompt: 'whimsical watercolor illustration, soft outlines, artistic splashes, dreamy' }
    ];
    const newStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
    
    // Using the same expert logic for regeneration
    const fullPrompt = `${item.label}, 3d digital art sticker, ${newStyle.prompt}, toy-like, white border, centered, isolated on solid white background, high resolution, 8k render, masterpiece`;
    setBrainThought(`Re-dreaming: ${newStyle.name} for "${item.label}"...`);

    const runMagic = async () => {
      try {
        const response = await fetch('/api/magic-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: item.label, style: newStyle.prompt })
        });
        const data = await response.json();
        if (data.url) {
          setSandboxItems(prev => prev.map(i => 
            i.id === id ? { ...i, url: data.url, style: newStyle.name, isLoading: false, type: 'image', local: data.isLocal } : i
          ));
          
          if (data.isLocal) {
            setLocalMagicCount(prev => prev + 1);
          } else {
            setCloudCredits(prev => Math.max(0, prev - 1));
          }
          return;
        }
      } catch (err) {
        console.warn("Proxy regeneration failed, falling back...");
      }

      // Final fallback
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const seed = Math.floor(Math.random() * 1000000);
      const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
      
      const img = new Image();
      img.src = aiUrl;
      img.onload = () => {
        setSandboxItems(prev => prev.map(i => 
          i.id === id ? { ...i, url: aiUrl, style: newStyle.name, isLoading: false, type: 'image' } : i
        ));
      };
      img.onerror = () => {
        setSandboxItems(prev => prev.map(i => 
          i.id === id ? { ...i, isLoading: false, error: true } : i
        ));
      };
    };
    runMagic();
  };

  // --- VIEWS ---

  if (view === 'subscription') {
    return (
      <div className="parent-dashboard" style={{ background: '#0f172a', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0' }}><CreditCard size={48} color="#3a86ff" /> Upgrade Your Magic</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Choose the plan that fits your vibe.</p>
        </div>
        
        <div className="pricing-grid">
          <div className="glass pricing-card" style={{ border: isSubscribed ? '2px solid #3a86ff' : '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            {isSubscribed && <div style={{ position: 'absolute', top: '10px', right: '-30px', background: '#ffbe0b', color: 'black', padding: '5px 40px', transform: 'rotate(45deg)', fontSize: '0.7rem', fontWeight: 'bold' }}>ACTIVE</div>}
            <div className="author-chip" style={{ background: '#3a86ff', color: 'white', marginBottom: '20px' }}>STAR-MAKER PLAN</div>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>$10<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></h2>
            <ul style={{ textAlign: 'left', marginBottom: '30px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}><Zap size={16} color="#ffbe0b" /> **Unlimited** Local Magic (Free Power!)</li>
              <li style={{ marginBottom: '10px' }}><Cloud size={16} color="#3a86ff" /> **500** Monthly Cloud Credits</li>
              <li style={{ marginBottom: '10px' }}><ShieldCheck size={16} color="#ffbe0b" /> Advanced Safety Monitoring</li>
              <li style={{ marginBottom: '10px' }}><Rocket size={16} color="#ffbe0b" /> Early Access to New Magic</li>
            </ul>
            <button 
              onClick={() => { setIsSubscribed(true); setCloudCredits(500); setView('app'); }} 
              className={`kids-button ${isSubscribed ? 'secondary' : 'accent'}`} 
              style={{ width: '100%' }}
            >
              {isSubscribed ? 'Manage Planet' : 'Upgrade to Star-Maker'}
            </button>
          </div>

          <div className="glass pricing-card">
            <div className="author-chip" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '20px' }}>EXPLORER (FREE)</div>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Trial<span style={{ fontSize: '1rem', opacity: 0.5 }}>/free</span></h2>
            <p style={{ opacity: 0.7 }}>Perfect for trying the vibes.</p>
            <ul style={{ textAlign: 'left', marginBottom: '30px', listStyle: 'none', padding: 0, marginTop: '20px' }}>
              <li style={{ marginBottom: '10px' }}><Sparkles size={16} color="#ffbe0b" /> 100 Local Magic Credits</li>
              <li style={{ marginBottom: '10px' }}><Zap size={16} color="#ffbe0b" /> Local Brain Required</li>
              <li style={{ marginBottom: '10px' }}><Clock size={16} color="#ffbe0b" /> Limited Cloud Support</li>
            </ul>
            <button onClick={() => setView('auth')} className="kids-button secondary" style={{ width: '100%' }}>Keep Exploring</button>
          </div>
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Need more Cloud Magic?</h3>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <div className="glass" style={{ padding: '20px', width: '200px' }}>
              <div style={{ fontSize: '2rem' }}>🛍️</div>
              <h4>Tiny Vibe-Bag</h4>
              <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>100 Cloud Credits</p>
              <button 
                onClick={() => { setCloudCredits(prev => prev + 100); setView('app'); }} 
                className="kids-button secondary" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                $2 Buy
              </button>
            </div>
            <div className="glass" style={{ padding: '20px', width: '200px', border: '1px solid #ffbe0b' }}>
              <div style={{ fontSize: '2rem' }}>🎪</div>
              <h4>Mega Magic-Sack</h4>
              <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>1000 Cloud Credits</p>
              <button 
                onClick={() => { setCloudCredits(prev => prev + 1000); setView('app'); }} 
                className="kids-button accent" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                $15 Buy
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => setView('app')} className="kids-button secondary"><ArrowLeft size={16} /> Back to Galaxy</button>
        </div>
      </div>
    );
  }

  if (view === 'community') {
    return (
      <div className="parent-dashboard" style={{ background: '#1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', color: 'white' }}>
          <div><h1><Globe size={40} color="#ffbe0b" /> Discovery Hub</h1><p>Sharing as: {user?.spaceName}</p></div>
          <button onClick={() => setView('app')} className="kids-button secondary"><ArrowLeft size={16} /> Back</button>
        </div>
        <div className="discovery-grid">
           {communityVibes.map(vibe => (
             <div key={vibe.id} className="glass discovery-card">
               <div className="author-chip">{vibe.author}</div>
               <h2 style={{color:'white'}}>{vibe.title}</h2>
               <div style={{display:'flex', justifyContent:'space-between'}}><button className="kids-button secondary">Remix</button><div style={{color:'#ff4d4d'}}><Heart size={16} fill="#ff4d4d"/> {vibe.likes}</div></div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (view === 'parent') {
    if (!isParentUnlocked) {
      return (
        <div className="parent-dashboard" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
           <div className="glass" style={{ padding:'40px', textAlign:'center', width:'300px' }}>
              <h2><ShieldCheck size={32} color="#ff4d4d"/> Parent Access</h2>
              <p style={{marginBottom:'20px'}}>Enter 4-Digit Parent PIN</p>
              <input type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} maxLength={4} style={{width:'100%', padding:'15px', fontSize:'1.5rem', textAlign:'center', borderRadius:'8px', border:'none', outline:'none', marginBottom:'20px', background:'rgba(255,255,255,0.1)', color:'white'}} placeholder="****"/>
              <button 
                 onClick={() => { if(pinInput === parentalControls.pin) { setIsParentUnlocked(true); setPinInput(''); } else { alert("Incorrect PIN!"); setPinInput(''); } }} 
                 className="kids-button accent" style={{width:'100%'}}>Unlock</button>
              <button onClick={() => setView('app')} className="kids-button secondary" style={{width:'100%', marginTop:'10px'}}>Cancel</button>
           </div>
        </div>
      );
    }

    return (
      <div className="parent-dashboard">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'40px' }}>
          <div>
            <h1><Eye size={32} /> Parent Portal</h1>
            <p>Monitoring {user?.email} ({user?.spaceName})</p>
            <p style={{fontSize:'0.8rem', opacity:0.6}}>Safety Strikes: <span style={{color: (parentalControls.strikes || 0) >= 3 ? '#ff4d4d' : (parentalControls.strikes || 0) > 0 ? '#ffbe0b' : '#4ade80', fontWeight:'bold'}}>{parentalControls.strikes || 0}/3</span>{(parentalControls.strikes || 0) >= 3 ? ' - ACCOUNT LOCKED' : ''}</p>
          </div>
          <button onClick={() => { setIsParentUnlocked(false); setView('app'); }} className="kids-button secondary"><ArrowLeft size={16} /> Exit & Lock</button>
        </div>
        
        <div style={{ display:'flex', gap:'30px', flexWrap:'wrap' }}>
          {/* Controls Panel */}
          <div className="glass" style={{ flex: '1 1 300px', padding:'30px', alignSelf:'flex-start' }}>
             
             {parentalControls.strikes >= 3 && (
                <div style={{ background: 'rgba(255,77,77,0.2)', border: '1px solid #ff4d4d', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'center' }}>
                   <AlertTriangle size={32} color="#ff4d4d" style={{marginBottom:'10px'}} />
                   <h3 style={{ color: '#ff4d4d', marginTop:0 }}>Safety Lockout Active!</h3>
                   <p style={{fontSize:'0.9rem', marginBottom:'15px'}}>The student has accumulated {parentalControls.strikes} safety strikes. Review the logs, discuss expectations, and authorize the unlock below.</p>
                   <button 
                     onClick={() => { updateStrikes(0); alert("Account Unlocked!"); }} 
                     className="kids-button accent" style={{ width: '100%', background: '#ff4d4d' }}>
                     Acknowledge & Unlock
                   </button>
                </div>
             )}

             <h2>⏱️ App Time Controls</h2>
             <p style={{opacity:0.7, marginBottom:'20px'}}>Determine exactly when your kids can access fun/entertainment modes.</p>
             {['sandbox', 'school', 'games', 'videos'].map(mkey => (
               <div key={mkey} style={{ display:'flex', flexDirection:'column', gap:'10px', background:'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'10px', marginBottom:'15px' }}>
                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                   <h3 style={{textTransform:'capitalize', margin:0}}>{mkey}</h3>
                   <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer' }}>
                     <input type="checkbox" checked={parentalControls.locks[mkey].enabled} onChange={(e) => updateParentLock(mkey, 'enabled', e.target.checked)} /> Lock Schedule
                   </label>
                 </div>
                 {parentalControls.locks[mkey].enabled && (
                    <div style={{ display:'flex', gap:'10px', alignItems:'center', opacity:0.8 }}>
                      <span>From:</span><input type="time" value={parentalControls.locks[mkey].start} onChange={(e) => updateParentLock(mkey, 'start', e.target.value)} style={{background:'white', color:'black', padding:'5px', borderRadius:'5px'}} />
                      <span>To:</span><input type="time" value={parentalControls.locks[mkey].end} onChange={(e) => updateParentLock(mkey, 'end', e.target.value)} style={{background:'white', color:'black', padding:'5px', borderRadius:'5px'}} />
                    </div>
                 )}
               </div>
             ))}
             <div style={{ marginTop:'30px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
               <h4>Change Parent PIN</h4>
               <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                 <input type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} maxLength={4} placeholder="New PIN" style={{padding:'10px', borderRadius:'5px', border:'none', width:'100px'}} />
                 <button onClick={() => { if(pinInput.length===4) { updateParentPin(pinInput); alert("PIN Updated!"); setPinInput(''); } }} className="kids-button secondary">Save</button>
               </div>
             </div>
          </div>

          <div className="parent-card" style={{ flex: '2 1 500px' }}>
            <h2>Project Logs</h2>
            <table className="activity-table">
              <thead><tr><th>Time</th><th>User</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {allLogs.slice().reverse().map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td>{log.sender === 'user' ? user?.spaceName : 'AI'}</td>
                    <td>{log.text}</td>
                    <td>{log.filtered ? <span className="status-tag status-filtered">Blocked</span> : <span className="status-tag status-safe">Safe</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="landing-hero" style={{ perspective: '1000px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="hero-content glass"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '40px' }}
          >
            <h1 style={{ fontSize: '7rem', margin: '0', letterSpacing: '-5px', fontWeight: 900, background: 'linear-gradient(to right, #fff, #ffbe0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
              Vibbion
            </h1>
            <div style={{ height: '5px', width: '200px', background: 'var(--secondary)', margin: '10px auto', borderRadius: '5px'}} />
          </motion.div>

          <p style={{ fontSize: '2rem', opacity: 0.9, fontWeight: 500, marginBottom: '50px' }}>
            Where coding meets <span style={{color: 'var(--secondary)', fontWeight: 800}}>Magic</span>.
          </p>

          <div style={{ display: 'flex', gap: '40px', margin: '60px 0', justifyContent: 'center', opacity: 0.7 }}>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}><Zap size={24} color="#ffbe0b" /> <span>LOCAL BRAIN</span></div>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}><ShieldCheck size={24} color="#3a86ff" /> <span>KID-SAFE AI</span></div>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}><Sparkles size={24} color="#ff4d4d" /> <span>VIBE CODING</span></div>
          </div>

          <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
            <button onClick={() => setView('auth')} className="kids-button primary" style={{ padding: '25px 50px', fontSize: '1.4rem' }}>Enter the Galaxy</button>
            <button onClick={() => setView('subscription')} className="kids-button secondary" style={{ padding: '25px 50px', fontSize: '1.4rem' }}>See Plans</button>
          </div>

          <div 
            onClick={() => setView('parent')} 
            style={{marginTop:'50px', cursor:'pointer', opacity:0.4, transition: 'opacity 0.3s'}}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.4}
          >
            <Eye size={18} style={{verticalAlign: 'middle', marginRight: '10px'}} /> 
            Parent Access Portal
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="auth-overlay">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass auth-card"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
            style={{marginBottom: '30px'}}
          >
            <User size={64} color="var(--accent)" />
          </motion.div>
          <h2 style={{fontSize: '2.5rem', marginBottom: '10px'}}>Hello, Voyager!</h2>
          <p style={{opacity: 0.6, marginBottom: '40px'}}>Sign in to sync your magic across the stars.</p>
          <form onSubmit={handleSignIn}>
            <input name="email" type="email" placeholder="Your Space Email" className="glass" required />
            <button type="submit" className="kids-button accent" style={{width:'100%', padding: '20px'}}>Ready to Vibe</button>
          </form>
          <button onClick={() => setView('landing')} style={{background: 'transparent', border: 'none', color: 'white', marginTop: '20px', cursor:'pointer', opacity: 0.5}}>Go Back</button>
        </motion.div>
      </div>
    );
  }

  if (view === 'app') {
    // --- 🔒 STRIKE LOCKOUT (bypassed in dev mode) ---
    if ((parentalControls.strikes || 0) >= 3 && !devMode) {
      return (
        <div className="sandbox-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0000' }}>
           <div className="glass floating" style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', border: '2px solid #ff4d4d', background: 'rgba(255,0,0,0.1)' }}>
              <AlertTriangle size={64} color="#ff4d4d" style={{ marginBottom: '20px' }} />
              <h1 style={{ fontSize: '3rem', color: '#ff4d4d', margin:0 }}>Account Locked</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop:'10px' }}>Vibbion has detected repeated safety violations.</p>
              <p style={{ marginTop: '20px' }}>A parent must review the chat logs and unlock the account to continue playing.</p>
              <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.6 }}>Strikes: {parentalControls.strikes}/3</p>
              
              <div 
                onClick={() => setView('parent')} 
                style={{ marginTop: '50px', display: 'inline-block', cursor: 'pointer', opacity: 0.8, background:'rgba(255,255,255,0.1)', padding:'15px 30px', borderRadius:'10px' }}
              >
                <Eye size={18} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                Access Parent Portal
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="sandbox-container">
      <div className="chat-box glass">
        {/* --- 🔧 DEV MODE BANNER --- */}
        {devMode && (
          <div style={{ background: 'linear-gradient(90deg, #ff6b35, #f7c948)', color: '#1a1a2e', padding: '6px 15px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.5px' }}>
            <span>🔧 DEV MODE — Strike lockout bypassed (Ctrl+Shift+D to toggle)</span>
            <span>Strikes: {parentalControls.strikes || 0}/3</span>
          </div>
        )}
        
        {/* --- ⚠️ STRIKE WARNING BANNER (visible to kids, 1-2 strikes) --- */}
        {!devMode && (parentalControls.strikes || 0) > 0 && (parentalControls.strikes || 0) < 3 && (
          <div style={{ background: parentalControls.strikes >= 2 ? 'rgba(255,77,77,0.2)' : 'rgba(255,190,11,0.15)', border: `1px solid ${parentalControls.strikes >= 2 ? '#ff4d4d' : '#ffbe0b'}`, padding: '8px 15px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={14} color={parentalControls.strikes >= 2 ? '#ff4d4d' : '#ffbe0b'} />
            <span>Safety Strikes: {parentalControls.strikes}/3 — {parentalControls.strikes >= 2 ? '🚨 One more and your account will be locked!' : 'Remember to keep things fun and safe!'}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              style={{fontSize:'2.5rem', filter: 'drop-shadow(0 0 10px var(--secondary))'}}
            >
              🤖
            </motion.div>
            <div>
              <h2 style={{margin:0, fontSize: '1.8rem', letterSpacing: '1px'}}>Vibbion</h2>
              <div style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1.5px'}}>Intelligence Suite</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setView('subscription')} className="kids-button secondary" style={{padding:'8px', borderRadius: '12px'}} title="Magic Credits"><CreditCard size={18}/></button>
            <button onClick={() => setView('community')} className="kids-button secondary" style={{padding:'8px', borderRadius: '12px'}} title="Discovery Hub"><Globe size={18}/></button>
            <button onClick={() => setView('parent')} className="kids-button secondary" style={{padding:'8px', borderRadius: '12px'}} title="Parent Portal"><Eye size={18}/></button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '15px' }}>
          <button onClick={() => setMode('sandbox')} className={`kids-button ${mode === 'sandbox' ? 'accent' : ''}`} style={{background: mode === 'sandbox' ? '' : 'transparent', boxShadow: 'none', padding:'10px', fontSize:'0.75rem', flex:1, borderRadius: '10px'}}>Sandbox</button>
          <button onClick={() => setMode('school')} className={`kids-button ${mode === 'school' ? 'accent' : ''}`} style={{background: mode === 'school' ? '' : 'transparent', boxShadow: 'none', padding:'10px', fontSize:'0.75rem', flex:1, borderRadius: '10px'}}>School</button>
          <button onClick={() => setMode('games')} className={`kids-button ${mode === 'games' ? 'accent' : ''}`} style={{background: mode === 'games' ? '' : 'transparent', boxShadow: 'none', padding:'10px', fontSize:'0.75rem', flex:1, borderRadius: '10px'}}>Games</button>
          <button onClick={() => setMode('videos')} className={`kids-button ${mode === 'videos' ? 'accent' : ''}`} style={{background: mode === 'videos' ? '' : 'transparent', boxShadow: 'none', padding:'10px', fontSize:'0.75rem', flex:1, borderRadius: '10px'}}>Videos</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div className="glass" style={{ flex: 1, padding: '10px 15px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(58,134,255,0.05)' }}>
              <div style={{display:'flex', alignItems: 'center', gap: '8px'}}><Zap size={14} color="#3a86ff" /> <span>LOCAL POWER</span></div>
              <span style={{fontWeight:'900', color: '#3a86ff'}}>{localMagicCount}</span>
            </div>
            <div className="glass" style={{ flex: 1, padding: '10px 15px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,190,11,0.05)' }}>
              <div style={{display:'flex', alignItems: 'center', gap: '8px'}}><Cloud size={14} color="#ffbe0b" /> <span>CLOUD MAGIC</span></div>
              <span style={{fontWeight:'900', color: '#ffbe0b'}}>{cloudCredits}</span>
            </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(m => (
            <motion.div key={m.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass" style={{padding:'10px', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.isStrikeWarning ? 'rgba(255,77,77,0.25)' : m.sender==='user'?'rgba(58,134,255,0.3)':'rgba(255,255,255,0.1)', border: m.isStrikeWarning ? '1px solid rgba(255,77,77,0.4)' : 'none'}}>{m.text}</motion.div>
          ))}
          {isBuilding && <div className="glass" style={{padding:'10px', alignSelf:'flex-start', background:'rgba(255,190,11,0.2)'}}>Building your big vibe... ⏳</div>}
          {brainThought && !isBuilding && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="brain-thought-bubble">
              <Sparkles size={12} color="#ffbe0b" /> {brainThought}
            </motion.div>
          )}
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
           <input value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleSend()} placeholder={isBuilding ? "Waiting for magic..." : "What vibe today?"} className="glass" disabled={isBuilding} style={{flex:1, border:'none', padding:'10px', color:'white', outline:'none', opacity: isBuilding ? 0.5 : 1}} />
           <button onClick={handleSend} disabled={isBuilding} className="kids-button accent" style={{padding:'10px'}}><Send size={18}/></button>
        </div>
      </div>

      <div className="magic-area glass" style={{ position: 'relative' }}>
         {/* --- 🪄 Magic Engine Icons --- */}
         <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px', zIndex: 1000 }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowParentGuide(true)}
              className="kids-button secondary"
              style={{ padding: '8px 12px', fontSize: '0.7rem' }}
            >
              🔧 Magic Guide
            </motion.button>
            
             <div style={{ padding: '8px 12px', borderRadius: '20px', background: 'white', color: '#ffbe0b', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <Zap size={16} />
                <span style={{ fontWeight: 'bold', fontSize: '0.6rem', color: '#ffbe0b' }}>LOCAL MAGIC BRAIN</span>
             </div>
         </div>

         {/* --- 🛡️ Parental Guide Modal --- */}
         {showParentGuide && (
           <div className="glass-overlay" onClick={() => setShowParentGuide(false)} style={{ position: 'absolute', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="glass" 
               onClick={e => e.stopPropagation()}
               style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}
             >
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white' }}>🛡️ Magic Guide for Parents</h2>
                <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
                   We use high-speed **Cloud Magic** to make stickers instant for everyone! 
                </p>
                
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                   <h4 style={{ color: '#3a86ff', marginBottom: '10px' }}>Local Magic: ACTIVE ✅</h4>
                   <p style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'white' }}>To run AI *locally* on your own computer, you need:</p>
                   <ul style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', paddingLeft: '20px' }}>
                      <li>**WebGPU Power**: A modern browser (Chrome 113+).</li>
                      <li>**Strong Memory**: At least 8GB of RAM.</li>
                      <li>**Storage Space**: 1GB of "Magic Brain Dust" download.</li>
                   </ul>
                </div>

                <button className="kids-button accent" onClick={() => setShowParentGuide(false)}>Got it!</button>
             </motion.div>
           </div>
         )}

         {/* Vibe Timer Overlay */}
         <AnimatePresence>
           {isBuilding && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="vibe-loader-overlay">
                <div className="pulse-ring">{timer}s</div>
                <div className="vibe-status-text">{statusMsg}</div>
                <p style={{marginTop:'10px', opacity:0.6}}>Ollama Brain is working hard! 🤖✨</p>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Content Render Area */}
         <div style={{ width: '100%', height: '100%' }}>
           {isModeLocked(mode) ? (
              <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                 <div className="glass floating" style={{ display:'inline-block', padding:'60px', background:'rgba(255,77,77,0.2)' }}>
                   <h1 style={{fontSize:'5rem', margin:0}}>😴</h1>
                   <h2 style={{fontSize:'3rem'}}>Vibbion is Sleeping</h2>
                   <p style={{fontSize:'1.2rem', opacity:0.8}}>Your parent has restricted time for the <b>{mode}</b> tab.</p>
                   <p>Please come back during play hours, or try a different tab!</p>
                 </div>
              </div>
           ) : mode === 'games' ? (
             <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div className="glass floating" style={{ display:'inline-block', padding:'60px', background:'rgba(58,134,255,0.2)' }}>
                  <h1 style={{fontSize:'4rem'}}>🎮 Safe Games</h1>
                  <p>Ask the Game Master to start a fun, text-based adventure!</p>
                </div>
             </div>
           ) : mode === 'videos' ? (
              <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                 <div className="glass pulse-ring" style={{ display:'inline-block', padding:'60px', background:'rgba(255,190,11,0.2)' }}>
                   <h1 style={{fontSize:'4rem'}}>🎬 Short Videos</h1>
                   <p>Brainstorm funny ideas, storylines, and characters for short clips with the Director!</p>
                 </div>
              </div>
           ) : mode === 'school' ? (
              <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                 <div className="glass" style={{ display:'inline-block', padding:'60px', background:'rgba(255,255,255,0.1)' }}>
                   <h1 style={{fontSize:'4rem'}}>📚 Tutor Desk</h1>
                   <p>Stuck on homework? Vibbion won't just give you the answer—he'll guide you step-by-step!</p>
                   <p style={{fontSize: '0.8rem', opacity: 0.6, marginTop: '20px'}}>Ask a math or science question to try it out!</p>
                 </div>
              </div>
           ) : (
             <div style={{ width:'100%', height:'100%', position:'relative' }}>
                {sandboxItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    drag 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      position:'absolute', 
                      left:`${item.x}%`, 
                      top:`${item.y}%`, 
                      cursor:'grab',
                      zIndex: 10
                    }}
                  >
                    {item.isLoading ? (
                      <div className="glass floating" style={{padding:'20px', borderRadius:'50%', border:'2px dashed #ffbe0b'}}>
                        <Sparkles size={32} className="spin-slow" color="#ffbe0b"/>
                      </div>
                    ) : (
                      <div className="sticker-wrapper">
                        {item.type === 'image' && (
                          <div style={{position:'relative'}}>
                            <motion.img 
                              whileHover={{ scale: 1.05, rotate: 2 }}
                              src={item.url} 
                              onError={(e) => {
                                // If NO image is returned, show failure (no more sketches!)
                                e.target.style.opacity = '0.3';
                                e.target.style.filter = 'grayscale(1)';
                                console.error("Magic Failed for:", item.label);
                              }}
                              className="magic-sticker"
                              alt={item.label}
                            />
                            <button 
                              onClick={() => regenerateItem(item.id)}
                              className="refine-button"
                              title="Magic Re-roll!"
                            >
                              <RotateCcw size={14} />
                            </button>
                            <div className="style-tag">{item.style}</div>
                          </div>
                        )}
                        {item.type === 'star' && <Star fill="#ffbe0b" size={64} className="magic-sticker"/>}
                        {item.type === 'rocket' && <Rocket color="#3a86ff" size={64} className="magic-sticker"/>}
                        {item.type === 'blanket' && <div className="magic-sticker" style={{width:'80px', height:'60px', background:'#ff4d4d', borderRadius:'8px'}} />}
                        {item.type === 'magic' && <Sparkles color="#ffbe0b" size={64} className="magic-sticker"/>}
                      </div>
                    )}
                  </motion.div>
                ))}
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default AntigravityKids;
