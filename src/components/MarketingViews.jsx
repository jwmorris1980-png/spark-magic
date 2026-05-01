import React from 'react';
import { ShieldCheck, Zap, Sparkles, Heart, Lock } from 'lucide-react';

export const ParentGuide = () => (
  <div style={{ padding: '40px', color: 'white', maxWidth: '900px', margin: 'auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
      <ShieldCheck size={64} color="#3a86ff" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '3rem', color: 'white', margin: 0 }}>Safety & Security</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Spark Intelligence Suite: Built for Kids, Trusted by Parents.</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
      <section className="glass" style={{ padding: '30px', border: '1px solid rgba(58,134,255,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3a86ff' }}><Lock size={20}/> Strict Walled Garden</h3>
        <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
          Spark uses the <b>Guardian AI Layer</b>. Every prompt and every response is scanned for age-appropriateness before the child ever sees it. No internet access, no unfiltered search, just pure creativity.
        </p>
      </section>

      <section className="glass" style={{ padding: '30px', border: '1px solid rgba(255,190,11,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffbe0b' }}><Zap size={20}/> Credit System</h3>
        <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
          Purchasing credits helps support the platform. <b>30% of every transaction</b> goes directly to the platform for maintenance and safety updates, while the rest supports the magic creators.
        </p>
      </section>

      <section className="glass" style={{ padding: '30px', border: '1px solid rgba(6,214,160,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#06d6a0' }}><Heart size={20}/> Human-in-the-Loop</h3>
        <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
          We provide a full <b>Parent Portal</b> where you can review chat logs, see what your child has created, and manage their safety strikes. You are always in control.
        </p>
      </section>

      <section className="glass" style={{ padding: '30px', border: '1px solid rgba(255,0,110,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff006e' }}><Sparkles size={20}/> Creative Learning</h3>
        <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
          Spark isn't just a toy. It's a <b>Maker Buddy</b>. From coding logic in games to creative writing in movies, we turn screen time into "Create Time".
        </p>
      </section>
    </div>

    <div className="glass" style={{ marginTop: '50px', padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
      <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
        Spark Intelligence Suite v1.5.8 • Privacy First • Child Safety Certified (2026)
      </p>
    </div>
  </div>
);

export const MagicGallery = ({ sandboxItems }) => (
  <div style={{ padding: '40px', color: 'white' }}>
    <h1 style={{ textAlign: 'center' }}>✨ Magic Gallery</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
      {sandboxItems.filter(i => i.url).map(item => (
        <div key={item.id} className="glass" style={{ padding: '10px', textAlign: 'center' }}>
          <img src={item.url} style={{ width: '100%', borderRadius: '10px' }} alt="Magic Creation" />
          <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>{item.title || "Sticker"}</p>
        </div>
      ))}
    </div>
  </div>
);
