import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, AlertTriangle, Volume2, VolumeX, Layout, Eye, 
  CreditCard, Zap, Cloud, MessageSquare, Mic, Send, 
  ArrowLeft, History, ExternalLink, RotateCcw, Rocket, Star, HelpCircle, ShoppingBag, ShoppingCart
} from 'lucide-react';

import MagicOrb from './MagicOrb';
import GameMaker from './GameMaker';import { ParentGuide, MagicGallery } from "./MarketingViews";

const AppMainView = ({
  parentalControls,
  devMode,
  updateStrikes,
  setView,
  isBuddyMode,
  setIsBuddyMode,
  isListening,
  isBuilding, 
  isGeneratingGame, 
  isAdmin,
  isSpeaking,
  aiName,
  isAutoSpeechEnabled,
  setIsAutoSpeechEnabled,
  stopSpeech,
  isMuted,
  setIsMuted,
  voiceSettings,
  personalities,
  mode,
  setMode,
  activateChatMode,
  conversationMode,
  localMagicCount,
  cloudCredits,
  messages,
  brainThought,
  timer,
  statusMsg,
  handleMicClick,
  input,
  setInput,
  handleSend,
  chatInputRef,
  showParentGuide,
  setShowParentGuide,
  isModeLocked,
  currentGameCode,
  setCurrentGameCode,
  savedGames,
  currentVideoCode,
  setCurrentVideoCode,
  savedVideos,
  sandboxItems,
  updateItemPosition,
  regenerateItem,
  popOutSticker,
  messagesEndRef,
  handleRefineGame,
  speakNav,
  setSandboxItems,
  setShowWalkthrough,
  showWalkthrough
}) => {
  // Safety Fallback for John to prevent Blue Screen
  const safePersonalities = (typeof personalities !== 'undefined' && personalities) ? personalities : [
    { name: 'Spark', id: 'spark', icon: '✨' },
    { name: 'Bubbles', id: 'bubbles', icon: '🫧' },
    { name: 'Hero', id: 'hero', icon: '🛡️' },
    { name: 'Professor', id: 'professor', icon: '🧪' },
    { name: 'Robot', id: 'robot', icon: '🤖' },
    { name: 'Dragon', id: 'dragon', icon: '🐉' },
    { name: 'Ninja', id: 'ninja', icon: '🥷' },
    { name: 'Wizard', id: 'wizard', icon: '🧙' },
    { name: 'Rocket', id: 'rocket', icon: '🚀' },
    { name: 'Ghost', id: 'ghost', icon: '👻' }
  ];
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // --- 🔒 STRIKE LOCKOUT (bypassed in dev mode) ---
  if ((parentalControls.strikes || 0) >= 3 && !devMode) {
    return (
      <div className="sandbox-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0000' }}>
         <div className="glass floating" style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', border: '2px solid #ff4d4d', background: 'rgba(255,0,0,0.1)' }}>
            <AlertTriangle size={64} color="#ff4d4d" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '3rem', color: '#ff4d4d', margin:0 }}>Account Locked</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop:'10px' }}>Spark has detected repeated safety violations.</p>
            <p style={{ marginTop: '20px' }}>A parent must review the chat logs and unlock the account to continue playing.</p>
            <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.6 }}>Strikes: {parentalControls.strikes}/3</p>
            
            <div 
              onClick={() => updateStrikes(0)} 
              style={{ marginTop: '20px', display: 'inline-block', cursor: 'pointer', background:'#ff4d4d', color: 'white', fontWeight: 'bold', padding:'15px 30px', borderRadius:'10px', marginLeft: '10px' }}
            >
              🔐 Parent Recovery Key
            </div>
            
            <div 
              onClick={() => setView('parent')} 
              style={{ marginTop: '50px', display: 'block', cursor: 'pointer', opacity: 0.8, background:'rgba(255,255,255,0.1)', padding:'15px 30px', borderRadius:'10px' }}
            >
              <Eye size={18} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
              Access Parent Portal
            </div>
         </div>
      </div>
    );
  }

  const magicAreaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBuilding, brainThought]);

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isBuddyMode ? (
            <MagicOrb 
              status={isListening ? 'listening' : isBuilding ? 'thinking' : isSpeaking ? 'speaking' : 'idle'} 
            />
          ) : (
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              style={{fontSize:'2.5rem', filter: 'drop-shadow(0 0 10px var(--secondary))'}}
            >
              🤖
            </motion.div>
          )}
          <div onClick={() => setView('account')} style={{ cursor: 'pointer' }}>
            <h2 style={{margin:0, fontSize: '1.8rem', letterSpacing: '1px'}}>{isBuddyMode ? 'Magic Buddy' : aiName}</h2>
            <div style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1.5px'}}>{isBuddyMode ? 'Hands-Free Companion' : 'Intelligence Suite'} <span style={{fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '5px', marginLeft: '5px'}}>v1.5.8-PREMIUM</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            id="btn-auto-speech"
            aria-label={isAutoSpeechEnabled ? "Turn off auto-speech" : "Turn on auto-speech"}
            onClick={() => {
              const nextAuto = !isAutoSpeechEnabled;
              setIsAutoSpeechEnabled(nextAuto);
              if (!nextAuto) stopSpeech();
            }} 
            className={`kids-button ${isAutoSpeechEnabled ? 'accent' : 'secondary'}`} 
            style={{padding:'8px', borderRadius: '12px'}} 
          >
            <Sparkles size={18} color={isAutoSpeechEnabled ? "white" : "rgba(255,255,255,0.4)"} />
          </button>
          <button 
            id="btn-mute-ai"
            aria-label={isMuted ? "Unmute Spark" : "Mute Spark"}
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (nextMuted) stopSpeech();
              localStorage.setItem('spark_muted', String(nextMuted));
            }} 
            className={`kids-button ${isMuted ? 'secondary' : 'accent'}`} 
            style={{padding:'8px', borderRadius: '12px'}} 
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="pulse-slow" />}
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              id="btn-mic"
              aria-label={isListening ? "Stop listening" : "Start listening"}
              onClick={handleMicClick} 
              className={`kids-button ${isListening ? 'accent' : 'secondary'}`} 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '18px',
                boxShadow: isListening ? '0 0 20px #ffbe0b, inset 0 0 10px rgba(255,255,255,0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isListening ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Mic size={24} color="#1a1a2e" />
                </motion.div>
              ) : (
                <Mic size={24} style={{opacity: 0.6}} />
              )}
            </button>
            {isListening && (
              <div style={{ 
                position: 'absolute', 
                top: '-5px', 
                right: '-5px', 
                background: '#ffbe0b', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%',
                border: '2px solid #1a1a2e',
                boxShadow: '0 0 10px #ffbe0b'
              }} />
            )}
          </div>
          <button 
            id="btn-view-skins"
            aria-label="Change AI skins and voice"
            onClick={() => setView('voice')} 
            className="kids-button secondary" 
            style={{padding:'6px 12px', borderRadius: '12px', fontSize:'0.7rem', gap:'4px'}}
          >
            <Layout size={16}/> Skins
          </button>
          <button 
            id="btn-view-store"
            aria-label="Open Magic Store"
            onClick={() => { setView('store'); speakNav('Opening the Magic Store! Check out these new games!'); }} 
            className="kids-button accent" 
            style={{padding:'6px 12px', borderRadius: '12px', fontSize:'0.7rem', gap:'4px', background: 'linear-gradient(135deg, #ffbe0b, #fb8500)', border: 'none', color: '#1a1a2e'}}
          >
            <ShoppingBag size={16}/> STORE
          </button>
          <button 
            id="btn-news"
            aria-label="Check latest news"
            onClick={() => setView('blog')} 
            className="kids-button secondary" 
            style={{padding:'8px 12px', borderRadius: '12px', fontSize:'0.7rem', color: '#ffbe0b', border: '1px solid rgba(255,190,11,0.3)'}}
          >
            <Sparkles size={18}/> News
          </button>
          <button 
            id="btn-parent-portal"
            aria-label="Open parent settings"
            onClick={() => setView('parent')} 
            className="kids-button secondary" 
            style={{padding:'8px', borderRadius: '12px'}}
          >
            <Eye size={18}/>
          </button>
        </div>
      </div>

      <button
        onClick={() => setView('voice')}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:'12px', padding:'10px 16px', borderRadius:'14px', border:'1px solid rgba(255,190,11,0.35)', background:'rgba(255,190,11,0.08)', color:'white', cursor:'pointer', fontFamily:'Fredoka, sans-serif', fontSize:'0.85rem' }}
      >
        <span>🎭 <strong>AI Skins</strong> — choose your buddy's personality</span>
        <span style={{opacity:0.6, fontSize:'0.75rem'}}>{voiceSettings.personality} {safePersonalities.find(p=>p.id===voiceSettings.voice)?.icon || '✨'} &rsaquo;</span>
      </button>

      <div className="mode-bar-scroll" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {[
          { id: 'sandbox', label: '🎨 Sandbox' },
          { id: 'school',  label: '📚 School' },
          { id: 'games',   label: '🎮 Games' },
          { id: 'store',   label: '🏪 Store' },
          { id: 'videos',  label: '🎬 Videos' },
          { id: 'gallery', label: '✨ Gallery' },
          { id: 'guide',   label: '🛡️ Safety' }
        ].map(m => (
          <button 
            key={m.id}
            id={`tab-${m.id}`}
            aria-label={m.label}
            onClick={() => { setView(m.id); setMode(m.id); speakNav(m.label); }} 
            className={`kids-button ${mode === m.id ? 'accent' : ''}`} 
            style={{ 
              background: mode === m.id ? '' : 'rgba(255,255,255,0.1)', 
              boxShadow: 'none', 
              padding:'12px 10px', 
              fontSize:'0.75rem', 
              minWidth: '90px',
              flex:'1 1 auto', 
              borderRadius: '12px',
              border: mode === m.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            {m.label}
          </button>
        ))}
        <button 
          id="tab-chat"
          aria-label="💬 Chat"
          onClick={() => { setView('chat'); activateChatMode(); speakNav('Chat mode'); }}
          className={`kids-button ${conversationMode ? 'accent' : ''}`} 
          style={{background: conversationMode ? '' : 'rgba(255,255,255,0.1)', minWidth: '90px', flex:'1 1 auto', boxShadow: 'none', padding:'12px 10px', fontSize:'0.75rem', borderRadius: '12px', color: 'white', border: conversationMode ? 'none' : '1px solid rgba(255,255,255,0.1)'}}
        >
          💬 Chat
        </button>
      </div>

      {conversationMode && (
        <div className="glass" style={{ marginBottom: '14px', padding: '10px 14px', background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.25)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Conversation Mode</div>
          <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Type naturally or use the mic. Spark will reply like a chat partner instead of building a game or video.</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'stretch' }}>
          <div className="glass" style={{ flex: 1, padding: '10px 15px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(58,134,255,0.05)' }}>
            <div style={{display:'flex', alignItems: 'center', gap: '8px'}}><Zap size={14} color="#3a86ff" /> <span>LOCAL POWER</span></div>
            <span style={{fontWeight:'900', color: '#3a86ff'}}>{localMagicCount}</span>
          </div>
          <div className="glass" style={{ padding: '10px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,190,11,0.08)' }}>
            <Cloud size={14} color="#ffbe0b" />
            <span style={{opacity:0.85}}>Credits:</span>
            <span style={{fontWeight:'900', color: '#ffbe0b'}}>{cloudCredits}</span>
          </div>
          <button onClick={() => setView('subscription')} className="kids-button accent" style={{ padding: '10px 14px', fontSize: '0.78rem' }}><CreditCard size={15}/> Upgrade</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>
        {messages.map(m => (
          <motion.div key={m.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass" style={{padding:'10px', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.isStrikeWarning ? 'rgba(255,77,77,0.25)' : m.sender==='user'?'rgba(58,134,255,0.3)':'rgba(255,255,255,0.1)', border: m.isStrikeWarning ? '1px solid rgba(255,77,77,0.4)' : 'none'}}>{m.text}</motion.div>
        ))}
        {isBuilding && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="glass" 
            style={{ padding: '10px', alignSelf: 'flex-start', background: 'rgba(255, 190, 11, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Sparkles size={16} color="#ffbe0b" />
            </motion.div>
            <span>{conversationMode ? 'Spark is thinking... 💬' : 'Gathering magic dust... ✨'}</span>
          </motion.div>
        )}
        {brainThought && !isBuilding && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="brain-thought-bubble">
            <Sparkles size={12} color="#ffbe0b" /> {brainThought}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        {isSpeaking && (
          <motion.button
            initial={{opacity:0, scale:0.9}}
            animate={{opacity:1, scale:1}}
            onClick={stopSpeech}
            className="kids-button accent"
            style={{ fontSize: '0.7rem', padding: '5px 15px', borderRadius: '10px', boxShadow: '0 0 15px rgba(255,190,11,0.4)', background: 'linear-gradient(135deg, #ff4d4d, #ff006e)' }}
          >
            🛑 Stop Talking
          </motion.button>
        )}
      </div>

      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
         <button
           id="btn-buddy-mode" title="Say Buddy Mode (Alt+B)"
           aria-label={isBuddyMode ? "Turn off buddy mode" : "Turn on buddy mode"}
           onClick={() => setIsBuddyMode(prev => !prev)}
           className={`kids-button ${isBuddyMode ? 'accent pulsing' : 'secondary'}`}
           style={{padding:'10px', borderRadius:'15px', background: isBuddyMode ? '#3a86ff' : ''}}
         >
           <MessageSquare size={18} color="white" />
         </button>
         <button
           id="btn-mic-input" title="Say Microphone (Alt+M)"
           aria-label="Start voice typing"
           onClick={() => handleMicClick(conversationMode)}
           className={`kids-button ${isListening && !isBuddyMode ? 'accent pulsing' : 'secondary'}`}
           style={{padding:'10px', borderRadius:'15px', background: isListening ? '#ff4d4d' : ''}}
         >
           <Mic size={18} color="white" />
         </button>
         <input
           ref={chatInputRef}
           id="input-magic-vibe"
           aria-label="What is your magic idea?"
           value={input}
           onChange={e=>setInput(e.target.value)}
           onKeyDown={e=>e.key==='Enter'&&handleSend()}
           placeholder={isBuddyMode ? "Spark is listening... (Hands Free)" : isListening ? "Listening..." : conversationMode ? "Talk to Spark..." : "What vibe today?"}
           className="glass"
           disabled={isBuilding}
           style={{flex:1, border:'none', padding:'10px', color:'white', outline:'none', opacity: isBuilding ? 0.5 : 1}}
         />
         <button 
           id="btn-send-magic"
           aria-label="Send magic idea"
           onClick={() => handleSend()} 
           disabled={isBuilding} 
           className="kids-button accent" 
           style={{padding:'10px'}}
         >
           <Send size={18}/>
         </button>
      </div>

      </div>

    <div ref={magicAreaRef} className="magic-area glass" style={{ position: 'relative' }}>
       {/* --- 🪄 Magic Engine Icons --- */}
       <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px', zIndex: 1000 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowWalkthrough(true)} id="btn-voice-walkthrough" title="Show Voice Commands"><HelpCircle size={18} color="white" /></motion.button>
          <motion.button id="btn-magic-safety"
            aria-label="Open safety guide for parents"
            onClick={() => setMode('guide')}
            className="kids-button secondary"
            style={{ padding: '8px 12px', fontSize: '0.7rem' }}
          >
            🛡️ Safety Guide
          </motion.button>

          <button
            id="btn-upgrade-top"
            aria-label="Upgrade to premium"
            onClick={() => setView('subscription')}
            className="kids-button accent"
            style={{ padding: '8px 12px', fontSize: '0.7rem' }}
          >
            <CreditCard size={14}/> Upgrade
          </button>

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
              <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white' }}>🛡️ Safety Guide for Parents</h2>
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

       {/* --- ✨ SPARKS MAGIC LOADER --- */}
        <AnimatePresence>
          {(isBuilding || isGeneratingGame) && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               style={{ 
                 position: 'absolute', 
                 inset: 0, 
                 zIndex: 3000, 
                 background: 'rgba(15, 15, 26, 0.9)', 
                 backdropFilter: 'blur(15px)',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center'
               }}
             >
                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '30px' }}>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    style={{ position: 'absolute', inset: 0, border: '4px solid rgba(255,190,11,0.1)', borderTop: '4px solid #ffbe0b', borderRadius: '50%' }}
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', inset: '20px', background: 'rgba(255,190,11,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Sparkles size={40} color="#ffbe0b" />
                  </motion.div>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        x: [0, (Math.random() - 0.5) * 200], 
                        y: [0, (Math.random() - 0.5) * 200],
                        opacity: [1, 0],
                        scale: [1, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      style={{ position: 'absolute', top: '50%', left: '50%', width: '6px', height: '6px', background: '#ffbe0b', borderRadius: '50%' }}
                    />
                  ))}
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '10px' }}>{isGeneratingGame ? "BUILDING WORLD" : "BREWING MAGIC"}</h2>
                <div className="glass" style={{ padding: '8px 20px', fontSize: '0.9rem', opacity: 0.8, color: '#ffbe0b', fontWeight: 700 }}>
                  {isGeneratingGame ? "Sparks is coding your new world... 🎮" : statusMsg || "Ollama is working hard... 🤖"}
                </div>
                {!isGeneratingGame && (
                  <div style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{timer}s</div>
                )}
             </motion.div>
          )}
        </AnimatePresence>

       {/* Content Render Area */}
       <div style={{ width: '100%', height: '100%' }}>
          {isModeLocked(mode) ? (
             <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div className="glass floating" style={{ display:'inline-block', padding:'60px', background:'rgba(255,77,77,0.2)' }}>
                  <h1 style={{fontSize:'5rem', margin:0}}>😴</h1>
                  <h2 style={{fontSize:'3rem'}}>Spark is Sleeping</h2>
                  <p style={{fontSize:'1.2rem', opacity:0.8}}>Your parent has restricted time for the <b>{mode}</b> tab.</p>
                  <p>Please come back during play hours, or try a different tab!</p>
                </div>
             </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* --- 🎮 UNIVERSAL GAME PLAYER --- */}
              {currentGameCode && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '10px 20px', display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button 
                      onClick={() => setCurrentGameCode(null)} 
                      className="kids-button secondary"
                      style={{ padding: '8px 15px', fontSize: '0.8rem' }}
                    >
                      <ArrowLeft size={16} /> Exit Game
                    </button>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>🎮 PLAYING MAGIC WORLD</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>Use WASD or Arrows to move</div>
                    <button 
                      onClick={() => {
                        const ifr = document.getElementById('active-game-iframe');
                        if (ifr) ifr.contentWindow.focus();
                      }}
                      className="kids-button accent"
                      style={{ padding: '5px 15px', fontSize: '0.7rem' }}
                    >
                      🖱️ CLICK TO FOCUS KEYS
                    </button>
                  </div>
                  <iframe 
                    id="active-game-iframe"
                    srcDoc={currentGameCode} 
                    onLoad={(e) => {
                      setTimeout(() => {
                        try { e.target.contentWindow.focus(); } catch(err) {}
                      }, 500);
                    }}
                    style={{ flex: 1, border: 'none' }} 
                    sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                    title="Active Game"
                  />
                </div>
              )}

              {mode === 'games' ? (
                 <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', padding: '40px', overflowY: 'auto' }}>
                    <div className="glass floating" style={{ padding:'40px', background:'rgba(58,134,255,0.2)', textAlign: 'center', marginBottom: '30px' }}>
                      <h1 style={{fontSize:'3rem', marginBottom: '10px'}}>🎮 Game Engine</h1>
                      <p style={{opacity: 0.8}}>Describe a game to build it, or pick a world below!</p>
                      <button 
                        onClick={() => setView('store')}
                        className="kids-button accent"
                        style={{marginTop:'20px', padding:'10px 25px'}}
                      >
                        🏪 VISIT MAGIC STORE
                      </button>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Star size={24} color="#ffbe0b" /> Featured Games</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {[
                          { title: 'Space Explorer', icon: '🚀', id: 'game-1' },
                          { title: 'Magic Bounce', icon: '⚽', id: 'game-2' },
                          { title: 'Neon Runner', icon: '🏃', id: 'game-3' },
                          { title: 'Cyber City', icon: '🏙️', id: 'game-6' },
                          { title: 'Dragon Rider', icon: '🐉', id: 'game-7' }
                        ].map(g => (
                          <motion.div 
                            key={g.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setView('store')}
                            className="glass"
                            style={{ padding: '20px', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(255,190,11,0.3)', background: 'rgba(255,190,11,0.05)' }}
                          >
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{g.icon}</div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{g.title}</h3>
                            <div style={{ fontSize: '0.7rem', color: '#ffbe0b', fontWeight: 800 }}>TAP TO VIEW</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {savedGames.length > 0 && (
                      <div style={{ flex: 1 }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><History size={24} /> My Generated Worlds</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                          {savedGames.map(game => (
                            <motion.div 
                              key={game.id}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => { setCurrentGameCode(game.html); setMode('sandbox'); }}
                              className="glass"
                              style={{ padding: '20px', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🕹️</div>
                              <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', textTransform: 'capitalize' }}>{game.title}</h3>
                              <p style={{ opacity: 0.5, fontSize: '0.7rem' }}>Created: {new Date(game.id).toLocaleDateString()}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: '40px' }}><GameMaker /></div>
                 </div>
              ) : mode === 'guide' ? (
                 <ParentGuide />
               ) : mode === 'gallery' ? (
                 <MagicGallery sandboxItems={sandboxItems} />
               ) : mode === 'videos' ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {currentVideoCode ? (
                      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                          <button onClick={() => setCurrentVideoCode(null)} className="kids-button secondary" style={{ padding: '8px 15px' }}>
                             <ArrowLeft size={16} /> Back to Studio
                          </button>
                          <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>🎬 Movie Canvas</h2>
                        </div>
                        <iframe 
                          srcDoc={currentVideoCode} 
                          style={{ flex: 1, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '15px', background: '#000' }} 
                          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                          title="Generated Movie"
                        />
                      </div>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', overflowY: 'auto' }}>
                         {/* Hero Section */}
                         <div className="glass floating" style={{ padding:'40px', background:'rgba(255,190,11,0.2)', textAlign: 'center', marginBottom: '30px' }}>
                           <h1 style={{fontSize:'3rem', marginBottom: '10px', whiteSpace: 'nowrap'}}>🎬 Movie Studio</h1>
                           <p style={{opacity: 0.8}}>Pick a scene below or describe your own movie!</p>
                         </div>

                         {/* Example Movie Ideas */}
                         <div style={{ marginBottom: '30px' }}>
                           <h3 style={{ marginBottom: '15px', opacity: 0.7 }}>Try These:</h3>
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                             {[
                               { emoji: '🚀', title: 'Space Launch', prompt: 'Make a movie of a rocket launching from Earth into the stars with a countdown' },
                               { emoji: '🐉', title: 'Dragon Flight', prompt: 'Make a cinematic 3D movie of a glowing dragon flying over mountains at sunset' },
                               { emoji: '🌊', title: 'Ocean Adventure', prompt: 'Make an underwater 3D scene with glowing jellyfish and a submarine exploring' },
                               { emoji: '🏰', title: 'Castle Story', prompt: 'Make a 3D fairy tale castle appearing in magical sparkles with a narrator' },
                               { emoji: '🌌', title: 'Galaxy Tour', prompt: 'Make a cinematic 3D tour through a colorful galaxy with planets and nebulas' },
                               { emoji: '🦕', title: 'Dino World', prompt: 'Make a 3D Jurassic scene with dinosaurs walking through a misty forest' },
                               { emoji: '🎪', title: 'Magic Show', prompt: 'Make a magical circus performance with fireworks and disappearing acts' },
                               { emoji: '❄️', title: 'Winter Wonderland', prompt: 'Make a 3D snowy landscape with aurora borealis and falling snowflakes' },
                             ].map(idea => (
                               <motion.button
                                 key={idea.title}
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => { setInput(idea.prompt); handleSend(idea.prompt); }}
                                 className="glass"
                                 style={{ padding: '18px 14px', cursor: 'pointer', border: '1px solid rgba(255,190,11,0.3)', background: 'rgba(255,190,11,0.1)', textAlign: 'center', color: 'white', fontSize: '0.85rem' }}
                               >
                                 <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{idea.emoji}</div>
                                 <div style={{ fontWeight: 700 }}>{idea.title}</div>
                               </motion.button>
                             ))}
                           </div>
                         </div>

                         {/* Videos Library */}
                         {savedVideos.length > 0 && (
                           <div style={{ flex: 1 }}>
                             <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><History size={24} /> My Movie Clips</h2>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                               {savedVideos.map(video => (
                                 <motion.div 
                                   key={video.id}
                                   whileHover={{ scale: 1.05 }}
                                   onClick={() => setCurrentVideoCode(video.code)}
                                   className="glass"
                                   style={{ padding: '20px', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}
                                 >
                                   <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎞️</div>
                                   <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', textTransform: 'capitalize' }}>{video.title}</h3>
                                   <p style={{ opacity: 0.5, fontSize: '0.7rem' }}>{new Date(video.timestamp).toLocaleDateString()}</p>
                                 </motion.div>
                               ))}
                             </div>
                           </div>
                         )}
                      </div>
                    )}
                  </div>
               ) : mode === 'chat' ? (
                 <div style={{ padding:'40px', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
                   <div className="glass floating" style={{ maxWidth: '620px', width: '100%', padding:'36px', background:'rgba(6,214,160,0.12)', textAlign: 'center' }}>
                     <div style={{ fontSize: '4rem', marginBottom: '12px' }}>💬</div>
                     <h1 style={{ fontSize:'2.6rem', marginBottom: '10px' }}>Conversation Mode</h1>
                     <p style={{ opacity: 0.86, marginBottom: '22px' }}>This is normal back-and-forth chat. Ask questions, tell Spark ideas, or just start talking.</p>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', textAlign: 'left' }}>
                       {[
                         'What should I build this weekend?',
                         'Tell me a space adventure story.',
                         'Help me think of a cool game idea.',
                         'Can you quiz me on animals?'
                       ].map(prompt => (
                         <motion.button
                           key={prompt}
                           whileHover={{ scale: 1.03 }}
                           whileTap={{ scale: 0.97 }}
                           onClick={() => { setInput(prompt); handleSend(prompt); }}
                           className="glass"
                           style={{ padding: '14px', cursor: 'pointer', border: '1px solid rgba(6,214,160,0.2)', background: 'rgba(6,214,160,0.08)', color: 'white', fontSize: '0.85rem' }}
                         >
                           {prompt}
                         </motion.button>
                       ))}
                     </div>
                   </div>
                 </div>
               ) : mode === 'school' ? (
                  <div style={{ padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                      <div className="glass" style={{ display:'inline-block', padding:'60px', background:'rgba(255,255,255,0.1)' }}>
                        <h1 style={{fontSize:'4rem'}}>📚 Tutor Desk</h1>
                        <p>Stuck on homework? Spark won't just give you the answer—he'll guide you step-by-step!</p>
                       <p style={{fontSize: '0.8rem', opacity: 0.6, marginTop: '20px'}}>Ask a math or science question to try it out!</p>
                     </div>
                  </div>
               ) : (
                 <div style={{ width:'100%', height:'100%', position:'relative', overflow: 'hidden' }}>
                   {sandboxItems.length === 0 && (
                     <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '30px' }}>
                       <div style={{ fontSize: '5rem' }}>🎨</div>
                       <h2 style={{ margin: 0, fontSize: '1.8rem', textAlign: 'center' }}>Your Canvas is Empty!</h2>
                       <p style={{ opacity: 0.6, textAlign: 'center', maxWidth: '300px' }}>Tap a button below or type what you want to see!</p>
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                         {[
                           { id: 'dragon', emoji: '🐉', label: 'Dragon' },
                           { id: 'rocket', emoji: '🚀', label: 'Rocket Ship' },
                           { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
                           { id: 'castle', emoji: '🏰', label: 'Castle' },
                           { id: 'cat', emoji: '🐱', label: 'Cute Cat' },
                           { id: 'robot', emoji: '🤖', label: 'Robot' },
                         ].map(item => (
                           <motion.button
                             key={item.label}
                             id={`btn-sandbox-${item.id}`}
                             aria-label={`Make a ${item.label}`}
                             whileHover={{ scale: 1.08 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => handleSend(`Make a picture of a ${item.label.toLowerCase()}`)}
                             className="kids-button secondary"
                             style={{ padding: '12px 20px', fontSize: '0.9rem', borderRadius: '15px' }}
                           >
                             {item.emoji} {item.label}
                           </motion.button>
                         ))}
                       </div>
                     </div>
                   )}
                   {sandboxItems.map(item => (
                     <motion.div 
                       key={item.id} 
                       drag 
                       dragConstraints={magicAreaRef}
                       dragElastic={0.1}
                       dragMomentum={false}
                       layout
                       onDragEnd={(event, info) => {
                         if (!magicAreaRef.current) return;
                         const rect = magicAreaRef.current.getBoundingClientRect();
                         const x = ((info.point.x - rect.left) / rect.width) * 100;
                         const y = ((info.point.y - rect.top) / rect.height) * 100;
                         updateItemPosition(item.id, x, y);
                       }}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       style={{
                         position:'absolute', 
                         left:`${item.x}%`, 
                         top:`${item.y}%`, 
                         cursor:'grab',
                         zIndex: 10,
                         translateX: "-50%",
                         translateY: "-50%"
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
                                 draggable="false"
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
                               <button 
                                 onClick={() => popOutSticker(item.url)}
                                 className="refine-button"
                                 style={{ right: 'auto', left: '-15px', background: '#3a86ff' }}
                                 title="Pop out to Desktop!"
                               >
                                 <ExternalLink size={14} />
                               </button>
                               <div className="style-tag">{item.style}</div>
                             </div>
                           )}
                           {item.type === 'game' && (
                             <div style={{position:'relative', width: '300px', height: '200px'}}>
                               <div style={{ position: 'absolute', top: '-10px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 100 }}>
                                  <button 
                                    onClick={() => setCurrentGameCode(item.html)}
                                    className="kids-button accent"
                                    style={{ padding: '5px 15px', fontSize: '0.7rem', borderRadius: '10px' }}
                                  >
                                    🎮 PLAY
                                  </button>
                                  <button 
                                    onClick={() => setSandboxItems(prev => prev.filter(i => i.id !== item.id))}
                                    className="kids-button secondary"
                                    style={{ padding: '5px 10px', fontSize: '0.7rem', borderRadius: '10px' }}
                                  >
                                    ❌
                                  </button>
                               </div>
                               <div className="glass" style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '20px', border: '2px solid #3a86ff', background: '#000' }}>
                                  <iframe 
                                    srcDoc={item.html} 
                                    style={{ border: 'none', pointerEvents: 'none', transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }} 
                                    title="Game Preview"
                                  />
                               </div>
                               <div className="style-tag" style={{ background: '#3a86ff' }}>{item.title}</div>
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
          )}
       </div>
    </div>
  </div>
  );
};

export default AppMainView;
