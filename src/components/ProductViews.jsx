import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Image as ImageIcon, ShieldCheck, Zap, Lock, Eye } from 'lucide-react';

const ProductWrapper = ({ title, children, setView, icon: Icon, color }) => (
  <div style={{ background: '#0f0f1a', color: 'white', minHeight: '100vh', padding: '60px 40px', fontFamily: 'Fredoka, sans-serif' }}>
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={() => setView('landing')} 
        style={{ background: 'none', border: 'none', color: '#3a86ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', fontSize: '1.1rem' }}
      >
        <ArrowLeft size={20} /> Back to Sparks
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: `${color}22`, padding: '15px', borderRadius: '15px' }}>
          <Icon size={40} color={color} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0 }}>{title}</h1>
      </div>

      <div style={{ padding: '10px 20px', background: '#ffbe0b22', border: '1px solid #ffbe0b44', borderRadius: '10px', display: 'inline-block', marginBottom: '40px' }}>
        <span style={{ color: '#ffbe0b', fontWeight: 700, fontSize: '0.9rem' }}>⚠️ BETA VERSION ACTIVE</span>
      </div>

      <div style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '1.2rem' }}>
        {children}
      </div>
    </div>
  </div>
);

export const GameEngineInfo = ({ setView }) => (
  <ProductWrapper title="Magic Game Engine" icon={Gamepad2} color="#3a86ff" setView={setView}>
    <p>The Sparks Game Engine is an industry-first Generative AI compiler designed for children. Unlike traditional game engines that require years of coding knowledge, Sparks uses "Natural Language Compilation."</p>
    
    <h3 style={{ marginTop: '30px', color: '#3a86ff' }}>Key Capabilities:</h3>
    <ul style={{ marginTop: '10px', listStyleType: 'sparkle' }}>
      <li><strong>Instant World Building:</strong> Generates fully playable HTML5/JavaScript environments from simple voice prompts.</li>
      <li><strong>Safe Code Generation:</strong> Every line of code is sanitized through our proprietary "Safety Mesh" to ensure it is secure and performant.</li>
      <li><strong>Iterative Creation:</strong> Children can "talk to their game" to add features, change levels, or adjust difficulty in real-time.</li>
    </ul>

    <div className="glass" style={{ marginTop: '40px', padding: '30px', borderLeft: '5px solid #3a86ff' }}>
      <p style={{ fontStyle: 'italic' }}>"Spark, make a dungeon crawler with treasure chests and a friendly dragon boss!" — The Engine will then output a complete, standalone game file ready for play.</p>
    </div>
  </ProductWrapper>
);

export const StickerStudioInfo = ({ setView }) => (
  <ProductWrapper title="3D Sticker Studio" icon={ImageIcon} color="#ffbe0b" setView={setView}>
    <p>The 3D Sticker Studio turns imagination into digital assets. Using advanced diffusion models, we allow kids to design their own "Magic Stickers" that live within the Spark ecosystem.</p>
    
    <h3 style={{ marginTop: '30px', color: '#ffbe0b' }}>Key Capabilities:</h3>
    <ul style={{ marginTop: '10px' }}>
      <li><strong>Creative Prompting:</strong> Kids learn the basics of descriptive language to guide the AI artist.</li>
      <li><strong>Physical Bridge:</strong> Stickers generated in the studio can be "popped out" to the local desktop (using our dedicated bridge software) or saved to a magic collection.</li>
      <li><strong>Personalization:</strong> Every creation is unique, giving children a sense of digital ownership and pride.</li>
    </ul>
  </ProductWrapper>
);

export const ParentPortalInfo = ({ setView }) => (
  <ProductWrapper title="Parent Command Center" icon={Lock} color="#06d6a0" setView={setView}>
    <p>The Parent Command Center (Portal) is the control room for Sparks. It provides complete transparency and control over the AI experience, ensuring it remains a positive influence on your child's growth.</p>
    
    <h3 style={{ marginTop: '30px', color: '#06d6a0' }}>Guardian Features:</h3>
    <ul style={{ marginTop: '10px' }}>
      <li><strong>Real-Time Monitoring:</strong> View every image, game, and conversation created by your child.</li>
      <li><strong>Safety Strike Management:</strong> Review any "Safety Glitches" flagged by the AI guardian and unlock the account once discussed.</li>
      <li><strong>Usage Limits:</strong> Set "Magic Time" windows to ensure a healthy balance between digital and physical play.</li>
    </ul>
    
    <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.7 }}>
      <Eye size={40} style={{ marginBottom: '10px' }} />
      <p>Transparency is our first safety feature.</p>
    </div>
  </ProductWrapper>
);
