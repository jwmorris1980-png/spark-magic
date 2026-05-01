import React from 'react';
import { motion } from 'framer-motion';
import { X, Mic, Zap, Play, Square, MessageCircle, HelpCircle } from 'lucide-react';

const WalkthroughView = ({ onClose }) => {
  const commands = [
    { icon: <MessageCircle size={20} color="#3a86ff"/>, title: "Start Talking", cmd: "'Buddy Mode' or 'Start Conversation'", desc: "Turns on Always Listening mode. Spark hears everything!" },
    { icon: <Square size={20} color="#ff4d4d"/>, title: "Stop Talking", cmd: "'Stop' or 'Goodbye'", desc: "Instantly silences Spark and turns off the microphone." },
    { icon: <Zap size={20} color="#ffbe0b"/>, title: "Make Magic", cmd: "'Make a game about...' or 'Make a video about...'", desc: "Spark will jump to the right tab and start building instantly." },
    { icon: <Mic size={20} color="#06d6a0"/>, title: "Quick Chat", cmd: "'Microphone'", desc: "One-time listen for a single question or idea." },
    { icon: <HelpCircle size={20} color="#ef476f"/>, title: "Help", cmd: "'Walkthrough'", desc: "Shows this magical guide anytime." }
  ];

  const navs = [
    { title: "Go to Sandbox", cmd: "'Sandbox tab'" },
    { title: "Go to Games", cmd: "'Games tab'" },
    { title: "Go to Videos", cmd: "'Videos tab'" },
    { title: "Go to School", cmd: "'School tab'" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass"
      style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        zIndex: 9999,
        background: 'rgba(10, 10, 30, 0.95)',
        border: '2px solid #3a86ff',
        borderRadius: '24px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#3a86ff', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ✨ Sparks Guide
        </h2>
        <button onClick={onClose} className="kids-button secondary" style={{ padding: '8px' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '25px' }}>
          Welcome to the future of hands-free magic! Here is how you can talk to Spark.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {commands.map((c, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {c.icon}
                <strong style={{ fontSize: '1.1rem' }}>{c.title}</strong>
              </div>
              <div style={{ color: '#ffbe0b', fontWeight: 800, marginBottom: '4px', fontSize: '0.9rem' }}>Say: {c.cmd}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{c.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass" style={{ background: 'rgba(58, 134, 255, 0.1)', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#06d6a0' }}>🌎 Navigation Commands</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            {navs.map((n, i) => (
              <div key={i} style={{ fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>{n.title}</div>
                <div style={{ color: '#3a86ff', fontSize: '0.8rem' }}>Say: {n.cmd}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
          Pro Tip: You can also use <strong>Alt + 1, 2, 3, 4, 5</strong> to switch tabs manually!
        </div>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={onClose} className="kids-button accent" style={{ padding: '12px 40px', fontSize: '1.1rem' }}>
          Got it, Spark! 🚀
        </button>
      </div>
    </motion.div>
  );
};

export default WalkthroughView;
