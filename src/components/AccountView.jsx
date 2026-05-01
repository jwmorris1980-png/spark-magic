import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Zap, LogOut, ArrowLeft, Settings, Mic, Sparkles } from 'lucide-react';

const AccountView = ({ 
  user,
  aiName = 'Spark', 
  setAiName = () => {}, 
  personalities = [], 
  isSubscribed = false, 
  voiceSettings = { voice: 'spark', pitch: 1.15, rate: 1.05, personality: 'Spark' }, 
  setVoiceSettings = () => {}, 
  setView = () => {}, 
  speakResponse = () => {},
  handleCredentialResponse = () => {}
}) => {
  
  const handleLogout = () => {
    localStorage.removeItem('spark_user');
    window.location.reload();
  };

  return (
    <div className="parent-portal active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="glass" 
        style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setView('app')} className="kids-button secondary" style={{ padding: '8px 15px', borderRadius: '12px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Magic Account</h1>
          <div style={{ width: '40px' }} />
        </div>

        {/* --- 👤 USER PROFILE SECTION --- */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '25px', padding: '25px', marginBottom: '30px', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
             {user?.picture ? (
               <img src={user.picture} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--accent)', boxShadow: '0 0 20px rgba(58,134,255,0.3)' }} alt="Profile" />
             ) : (
               <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <User size={50} color="white" />
               </div>
             )}
             <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#06d6a0', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 'bold' }}>ACTIVE</div>
          </div>
          
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{user?.name || 'Magical Maker'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.7, fontSize: '0.9rem' }}>
            <Mail size={14} />
            {user?.email || 'guest@spark-magic.com'}
          </div>
          
          <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,190,11,0.15)', color: '#ffbe0b', padding: '8px 15px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <Zap size={14} />
            {isSubscribed ? 'Magic Member (Unlimited)' : 'Standard Account'}
          </div>
        </div>

        {/* --- ⚙️ AI SETTINGS SECTION --- */}
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '15px' }}>
            <Settings size={18} color="var(--accent)" />
            AI Buddy Configuration
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '8px', marginLeft: '5px' }}>What should I call your AI?</label>
            <div style={{ position: 'relative' }}>
               <Sparkles size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
               <input 
                value={aiName} 
                onChange={e => setAiName(e.target.value)} 
                className="glass" 
                style={{ width: '100%', padding: '15px 15px 15px 45px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '15px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px', marginLeft: '5px' }}>Voice Personality</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {personalities.slice(0, 4).map(p => {
                const isActive = voiceSettings.personality === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setVoiceSettings({ voice: p.id, pitch: p.pitch, rate: p.rate, personality: p.name });
                      speakResponse(`Voice updated to ${p.name}!`, { voice: p.id, pitch: p.pitch, rate: p.rate, personality: p.name });
                    }}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '15px', 
                      background: isActive ? 'rgba(58,134,255,0.3)' : 'rgba(255,255,255,0.05)',
                      border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 'bold' : 'normal' }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setView('skins')} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
              See all 10 personalities
            </button>
          </div>
        </div>

        {/* --- 🚪 ACTIONS SECTION --- */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setView('app')} 
            className="kids-button accent" 
            style={{ flex: 2, padding: '15px' }}
          >
            SAVE CHANGES
          </button>
          <button 
            onClick={handleLogout}
            className="kids-button secondary" 
            style={{ flex: 1, padding: '15px', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.2)' }}
          >
            <LogOut size={20} />
          </button>
        </div>

        <p style={{ marginTop: '25px', fontSize: '0.7rem', opacity: 0.4 }}>
          Sparks Intelligence Suite v1.5.8 — Locked & Secure
        </p>
      </motion.div>
    </div>
  );
};

export default AccountView;
