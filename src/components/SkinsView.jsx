import React from 'react';
import { motion } from 'framer-motion';

const SkinsView = ({ 
  aiName = 'Spark', 
  setAiName = () => {}, 
  personalities = [], 
  isSubscribed = false, 
  voiceSettings = { voice: 'spark', pitch: 1.15, rate: 1.05, personality: 'Spark' }, 
  setVoiceSettings = () => {}, 
  setView = () => {}, 
  speakResponse = () => {} 
}) => {
  // Defensive: If personalities is empty, show a message
  if (!Array.isArray(personalities) || personalities.length === 0) {
    return <div style={{ color: 'white', padding: 40 }}>No personalities available. Please reload or check your configuration.</div>;
  }
  return (
    <div className="parent-portal active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="glass" style={{ width: '100%', maxWidth: '420px', padding: '30px 24px', textAlign: 'center', margin: '0 16px' }}>
        <h1 style={{fontSize: '3rem'}}>🎙️ Magic Voice</h1>
        <p>Customize how your AI buddy sounds and what they like to be called!</p>
        
        <div style={{textAlign:'left', marginTop:'20px'}}>
          <label style={{display:'block', marginBottom:'10px', fontWeight:'bold'}}>AI Buddy's Name:</label>
          <input 
            value={aiName} 
            onChange={e => setAiName(e.target.value)} 
            className="glass" 
            style={{width:'100%', padding:'15px', border:'none', outline:'none', background:'rgba(255,255,255,0.1)', color:'white', borderRadius:'10px', fontSize:'1.2rem'}}
          />
        </div>

        <div style={{textAlign:'left', marginTop:'20px'}}>
          <label style={{display:'block', marginBottom:'10px', fontWeight:'bold'}}>Choose a Personality:</label>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
            {personalities.map(p => {
              const isLocked = p.premium && !isSubscribed;
              const isActive = voiceSettings.personality === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    if (isLocked) { setView('subscription'); return; }
                    setVoiceSettings({ voice: p.id, pitch: p.pitch, rate: p.rate, personality: p.name });
                    speakResponse(`Hi! I'm ${p.name}. This is my voice!`, { voice: p.id, pitch: p.pitch, rate: p.rate, personality: p.name });
                  }}
                  className={`glass ${isActive ? 'accent' : ''}`}
                  style={{padding:'15px', border: isLocked ? '1px solid rgba(255,190,11,0.3)' : 'none', borderRadius:'15px', color:'white', transition:'0.3s', position:'relative', opacity: isLocked ? 0.8 : 1, background: isActive ? 'rgba(58,134,255,0.4)' : 'rgba(255,255,255,0.05)'}}
                >
                  {isLocked && <div style={{position:'absolute', top:'6px', right:'8px', fontSize:'0.6rem', background:'linear-gradient(135deg,#ffbe0b,#fb8500)', color:'#1a1a2e', padding:'2px 7px', borderRadius:'8px', fontWeight:900}}>⭐ PRO</div>}
                  <div style={{fontSize:'1.5rem', marginBottom:'5px'}}>{p.icon}</div>
                  <div style={{fontWeight:'bold'}}>{p.name}</div>
                  <div style={{fontSize:'0.75rem', opacity:0.6, marginTop:'2px'}}>{isLocked ? 'Tap to unlock' : p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={() => {
          setView('app');
          speakResponse(`Hello there! My name is ${aiName}, and this is how I sound now!`);
        }} className="kids-button accent" style={{width:'100%', marginTop:'30px'}}>SAVE PERSONA</button>
      </motion.div>
    </div>
  );
};

export default SkinsView;
