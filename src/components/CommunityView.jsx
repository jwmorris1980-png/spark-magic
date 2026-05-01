import React from 'react';
import { Globe, ArrowLeft, Heart } from 'lucide-react';

const CommunityView = ({ vibeData, user, handleLikeVibe, handleRemix, setView }) => {
  return (
    <div className="parent-dashboard" style={{ background: '#1a1a2e' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', color: 'white' }}>
        <div><h1><Globe size={40} color="#ffbe0b" /> Discovery Hub</h1><p>Sharing as: {user?.spaceName}</p></div>
        <button onClick={() => setView('app')} className="kids-button secondary"><ArrowLeft size={16} /> Back</button>
      </div>
      <div className="discovery-grid">
         {vibeData.map(vibe => (
           <div key={vibe.id} className="glass discovery-card">
             <div className="author-chip">{vibe.author}</div>
             <h2 style={{color:'white'}}>{vibe.title}</h2>
             <div style={{display:'flex', justifyContent:'space-between'}}><button onClick={() => handleRemix(vibe)} className="kids-button secondary">Remix</button><div onClick={() => handleLikeVibe(vibe.id)} style={{color:'#ff4d4d', cursor: 'pointer'}}><Heart size={16} fill={vibe.isLiked ? "#ff4d4d" : "transparent"} color="#ff4d4d"/> {vibe.likes}</div></div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default CommunityView;
