import React from 'react';
import { motion } from 'framer-motion';

const MagicOrb = ({ status }) => {
  const colors = {
    idle: 'radial-gradient(circle, #3a86ff 0%, rgba(58,134,255,0) 70%)',
    listening: 'radial-gradient(circle, #ff006e 0%, rgba(255,0,110,0) 70%)',
    thinking: 'radial-gradient(circle, #ffbe0b 0%, rgba(255,190,11,0) 70%)',
    speaking: 'radial-gradient(circle, #06d6a0 0%, rgba(6,214,160,0) 70%)'
  };

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
      <motion.div
        animate={{
          scale: status === 'speaking' ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: status === 'idle' ? 0.3 : 0.8,
          rotate: status === 'thinking' ? 360 : 0
        }}
        transition={{
          duration: status === 'speaking' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: colors[status] || colors.idle,
          filter: 'blur(10px)',
          position: 'absolute'
        }}
      />
      <motion.div
        animate={{
          scale: status === 'listening' ? [1, 1.15, 1] : [1, 1.05, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'absolute',
          top: '20%',
          left: '20%'
        }}
      />
    </div>
  );
};

export default MagicOrb;
