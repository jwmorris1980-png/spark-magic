import React from 'react';
import { CreditCard, Cloud, Rocket, ShieldCheck, ArrowLeft } from 'lucide-react';

const SubscriptionView = ({ isSubscribed, setCloudCredits, setView, setIsSubscribed }) => {
  return (
    <div className="parent-dashboard" style={{ background: '#0f172a', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0' }}><CreditCard size={48} color="#3a86ff" /> Upgrade Your Magic</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Choose the plan that fits your vibe.</p>
      </div>
      
      <div className="pricing-grid">
        <div className="glass pricing-card" style={{ border: '1px solid rgba(255,190,11,0.35)' }}>
          <div className="author-chip" style={{ background: 'rgba(255,190,11,0.2)', color: '#ffbe0b', marginBottom: '20px' }}>OPTION 1</div>
          <h3 style={{ margin: '10px 0 6px', color: '#ffbe0b' }}><Cloud size={18} /> Buy Credits</h3>
          <h2 style={{ fontSize: '2.2rem', margin: '6px 0' }}>$5<span style={{ fontSize: '0.95rem', opacity: 0.6 }}> one-time</span></h2>
          <p style={{ opacity: 0.78, marginBottom: '24px' }}>300 Cloud Credits. No monthly subscription required.</p>
          <button
            onClick={() => { setCloudCredits(prev => prev + 300); setView('app'); }}
            className="kids-button secondary"
            style={{ width: '100%' }}
          >
            Buy 300 Credits
          </button>
        </div>

        <div className="glass pricing-card" style={{ border: isSubscribed ? '2px solid #3a86ff' : '1px solid rgba(58,134,255,0.35)', position: 'relative', overflow: 'hidden' }}>
          {isSubscribed && <div style={{ position: 'absolute', top: '10px', right: '-30px', background: '#ffbe0b', color: 'black', padding: '5px 40px', transform: 'rotate(45deg)', fontSize: '0.7rem', fontWeight: 'bold' }}>ACTIVE</div>}
          <div className="author-chip" style={{ background: '#3a86ff', color: 'white', marginBottom: '20px' }}>OPTION 2</div>
          <h3 style={{ margin: '10px 0 6px', color: '#8ab6ff' }}><Rocket size={18} /> Star-Maker Monthly</h3>
          <h2 style={{ fontSize: '2.2rem', margin: '6px 0' }}>$10<span style={{ fontSize: '0.95rem', opacity: 0.6 }}>/mo</span></h2>
          <p style={{ opacity: 0.78, marginBottom: '24px' }}>500 monthly Cloud Credits, premium personas, and early feature access.</p>
          <button
            onClick={() => { setIsSubscribed(true); setCloudCredits(500); setView('app'); }}
            className={`kids-button ${isSubscribed ? 'secondary' : 'accent'}`}
            style={{ width: '100%' }}
          >
            {isSubscribed ? 'Manage Plan' : 'Start $10/mo'}
          </button>
        </div>

        <div className="glass pricing-card" style={{ border: '1px solid rgba(6,214,160,0.35)' }}>
          <div className="author-chip" style={{ background: 'rgba(6,214,160,0.2)', color: '#06d6a0', marginBottom: '20px' }}>OPTION 3</div>
          <h3 style={{ margin: '10px 0 6px', color: '#71ffd8' }}><ShieldCheck size={18} /> School & Enterprise</h3>
          <h2 style={{ fontSize: '2.2rem', margin: '6px 0' }}>Custom</h2>
          <p style={{ opacity: 0.78, marginBottom: '24px' }}>District or organization licensing, admin controls, and volume pricing.</p>
          <button
            onClick={() => { window.location.href = 'mailto:hello@sparks-magic.com?subject=School%20or%20Enterprise%20Plan'; }}
            className="kids-button secondary"
            style={{ width: '100%' }}
          >
            Contact Sales
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={() => setView('app')} className="kids-button secondary"><ArrowLeft size={16} /> Back to Galaxy</button>
      </div>
    </div>
  );
};

export default SubscriptionView;
