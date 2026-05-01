import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, Sparkles, Eye, User, 
  Gamepad2, Image, Video, 
  Lock, Globe, Heart, ArrowRight, Github 
} from 'lucide-react';

const LandingView = ({ setView }) => {
  return (
    <div className="landing-container" style={{ 
      background: '#0f0f1a', 
      color: 'white', 
      fontFamily: 'Fredoka, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* --- 🚀 NAV BAR --- */}
      <nav style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        background: 'rgba(15, 15, 26, 0.8)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffbe0b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-1px' }}>
            <Sparkles color="#ffbe0b" size={28} /> SPARKS
          </div>
          <div style={{ fontSize: '0.7rem', color: 'white', opacity: 0.6, fontWeight: 600, marginTop: '-5px', marginLeft: '36px' }}>
            MAGIC AI FOR KIDS
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <button 
            onClick={() => setView('blog')} 
            className="kids-button secondary" 
            style={{ padding: '8px 20px', fontSize: '0.9rem', background: 'rgba(255, 190, 11, 0.1)', border: '1px solid #ffbe0b', color: '#ffbe0b', fontWeight: 800 }}
          >
            News ✨
          </button>
          <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => {
            const el = document.getElementById('educators');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>For Educators</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setView('parent-portal')}>Safety</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setView('subscription')}>Pricing</span>
          <button 
            onClick={() => setView('auth')} 
            className="kids-button secondary" 
            style={{ padding: '8px 20px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent' }}
          >
            Login
          </button>
          <button 
            onClick={() => setView('auth')} 
            className="kids-button primary" 
            style={{ padding: '10px 25px', fontSize: '0.9rem' }}
          >
            Start Creating
          </button>
        </div>
      </nav>

      {/* --- 🔥 HERO SECTION --- */}
      <section style={{ 
        padding: '100px 40px', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'radial-gradient(circle at top, #1a1a2e 0%, #0f0f1a 100%)'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ 
            fontSize: 'clamp(3rem, 10vw, 6rem)', 
            fontWeight: 900, 
            letterSpacing: '-2px', 
            marginBottom: '20px',
            lineHeight: 1
          }}>
            The Future of <br/>
            <span style={{ background: 'linear-gradient(to right, #ffbe0b, #fb5607)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creative Play</span>
          </h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto 40px' }}>
            Sparks is the first generative AI platform built exclusively for kids. 
            From 3D stickers to full games, if they can say it, they can make it.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setView('auth')} className="kids-button primary" style={{ padding: '20px 45px', fontSize: '1.2rem' }}>
              Start Creating <ArrowRight style={{ marginLeft: '10px' }} />
            </button>
            <button 
              onClick={() => {
                const guestUser = {
                  name: 'Explorer',
                  email: 'guest@spark-magic.com',
                  picture: 'https://cdn-icons-png.flaticon.com/512/1043/1043321.png',
                  id: 'guest-' + Date.now()
                };
                localStorage.setItem('spark_user', JSON.stringify(guestUser));
                window.location.reload();
              }} 
              className="kids-button secondary" 
              style={{ padding: '20px 35px', fontSize: '1.1rem', background: 'transparent', border: '2px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              <Zap size={20} /> Guest Mode
            </button>
          </div>
          <div style={{ marginTop: '20px', opacity: 0.5, fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 500 }}>
             ✨ <span style={{ color: '#ffbe0b' }}>Newest Features Active</span> • Experience 1.8.3
          </div>
        </motion.div>

        {/* 📱 PRODUCT PREVIEW */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ marginTop: '80px', width: '100%', maxWidth: '1000px', position: 'relative' }}
        >
          <img 
            src="/dashboard.png" 
            alt="Sparks Dashboard" 
            style={{ 
              width: '100%', 
              borderRadius: '30px', 
              boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 50px rgba(58, 134, 255, 0.2)',
              border: '1px solid rgba(255,255,255,0.1)'
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: '-30px', 
            right: '-30px', 
            width: '150px'
          }}>
            <img src="/safety_badge.png" alt="Kid Safe" style={{ width: '100%' }} />
          </div>
        </motion.div>
      </section>

      {/* --- 🛠️ THE THREE PILLARS --- */}
      <section style={{ padding: '100px 40px', background: '#0f0f1a' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '60px' }}>Magic in Every Corner</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          
          <motion.div whileHover={{ y: -10, scale: 1.02 }} className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center', transition: 'box-shadow 0.3s ease' }}>
            <div style={{ background: 'rgba(58, 134, 255, 0.2)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Gamepad2 size={40} color="#3a86ff" />
            </div>
            <h3>Infinite Game Engine</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>Say "Make a racing game with space cats" and watch the engine compile a fully playable 3D world in seconds.</p>
            <button onClick={() => setView('game-engine')} className="kids-button secondary" style={{ fontSize: '0.8rem', padding: '10px 20px' }}>Engine Details</button>
          </motion.div>

          <motion.div whileHover={{ y: -10, scale: 1.02 }} className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center', transition: 'box-shadow 0.3s ease' }}>
            <div style={{ background: 'rgba(255, 190, 11, 0.2)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Image size={40} color="#ffbe0b" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <span style={{ background: '#fb5607', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 900 }}>NEW FEATURE</span>
            </div>
            <h3>3D Sticker Studio</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>Generate unique 3D characters and objects. Pop them out into the physical world or save them to your magic collection.</p>
            <button onClick={() => setView('sticker-studio')} className="kids-button secondary" style={{ fontSize: '0.8rem', padding: '10px 20px' }}>Studio Details</button>
          </motion.div>

          <motion.div whileHover={{ y: -10, scale: 1.02 }} className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center', transition: 'box-shadow 0.3s ease' }}>
            <div style={{ background: 'rgba(6, 214, 160, 0.2)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Video size={40} color="#06d6a0" />
            </div>
            <h3>Movie Magic</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>Turn stories into short cinematic sequences. Direct your own AI-powered movies with simple voice commands.</p>
            <button onClick={() => setView('parent-portal')} className="kids-button secondary" style={{ fontSize: '0.8rem', padding: '10px 20px' }}>Portal Details</button>
          </motion.div>

        </div>
      </section>

      {/* --- 🛡️ SAFETY & TRUST (For Google Verification) --- */}
      <section style={{ padding: '100px 40px', background: 'rgba(58, 134, 255, 0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Privacy is Our <br/> <span style={{ color: '#3a86ff' }}>Superpower</span></h2>
            <div style={{ display: 'grid', gap: '30px', marginTop: '40px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Lock color="#3a86ff" size={30} style={{ flexShrink: 0 }} />
                <div>
                  <h4>COPPA-Compliant by Design</h4>
                  <p style={{ opacity: 0.7 }}>We don't collect personal data from kids. Every interaction is anonymized and processed through our secure gateway.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <ShieldCheck color="#3a86ff" size={30} style={{ flexShrink: 0 }} />
                <div>
                  <h4>Zero-Open AI Access</h4>
                  <p style={{ opacity: 0.7 }}>Our "Walled Garden" technology ensures that AI responses are strictly filtered for age-appropriate educational value.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <User color="#3a86ff" size={30} style={{ flexShrink: 0 }} />
                <div>
                  <h4>Parental Command Center</h4>
                  <p style={{ opacity: 0.7 }}>Total visibility for parents. See what your child creates, set limits, and guide their creative journey.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setView('parent-portal')} 
              className="kids-button secondary" 
              style={{ marginTop: '40px', padding: '15px 30px', fontSize: '1rem', background: 'rgba(58, 134, 255, 0.1)', border: '1px solid #3a86ff', color: '#3a86ff' }}
            >
              Read Our Full Safety Guide <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </button>
          </div>
          <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            >
              <ShieldCheck size={120} color="#3a86ff" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="educators" style={{ padding: '100px 40px', background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass" style={{ padding: '60px', borderRadius: '40px', border: '1px solid rgba(58, 134, 255, 0.3)' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Designed for the Modern Classroom</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🛡️</div>
                <h4 style={{ color: '#3a86ff', marginBottom: '10px' }}>Walled Garden Safety</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Strictly filtered AI responses ensure students stay within age-appropriate educational boundaries.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎓</div>
                <h4 style={{ color: '#06d6a0', marginBottom: '10px' }}>Creative Assistant</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Empower students to visualize complex ideas instantly without needing deep technical coding skills.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📊</div>
                <h4 style={{ color: '#ffbe0b', marginBottom: '10px' }}>Project-Based Learning</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Turn abstract concepts into tangible 3D assets, playable games, and cinematic stories.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 📝 MISSION & ABOUT --- */}
      <section style={{ padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Our Mission</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ color: '#ffbe0b', marginBottom: '10px' }}>For Families</h4>
              <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.6 }}>
                At Sparks, we believe the next generation of engineers, artists, and creators will use AI as a natural extension of their curiosity. 
                We are building the tools to make that journey safe, exciting, and truly magical.
              </p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ color: '#3a86ff', marginBottom: '10px' }}>For Educators</h4>
              <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.6 }}>
                Sparks is designed to be a classroom-safe **Creative Assistant**. We empower students to turn abstract concepts into tangible 3D assets, games, and stories, fostering project-based learning in a controlled environment.
              </p>
            </div>
          </div>
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Join us in empowering every child to become a Maker.</p>
          </div>
        </div>
      </section>

      {/* --- 🏁 FOOTER --- */}
      <footer style={{ padding: '60px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#090911' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffbe0b', marginBottom: '5px', letterSpacing: '-1px' }}>SPARKS</div>
            <div style={{ fontSize: '0.6rem', color: 'white', opacity: 0.5, fontWeight: 600, marginBottom: '20px' }}>MAGIC AI FOR KIDS</div>
            <p style={{ opacity: 0.5, maxWidth: '300px' }}>Building the future of safe, generative AI for the next generation of makers.</p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Product</h5>
              <div style={{ display: 'grid', gap: '10px', opacity: 0.6, fontSize: '0.9rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('game-engine')}>Game Engine</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('sticker-studio')}>Sticker Studio</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('store')}>Magic Store</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('parent-portal')}>Parent Portal</span>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Company</h5>
              <div style={{ display: 'grid', gap: '10px', opacity: 0.6, fontSize: '0.9rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('blog')}>Dev Blog</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('about')}>About Us</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('privacy')}>Privacy Policy</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setView('terms')}>Terms of Service</span>
                <span style={{ cursor: 'pointer' }} onClick={() => window.location.href='mailto:support@sparkmagic.ai'}>Contact Support</span>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '20px' }}>Social</h5>
              <div style={{ display: 'grid', gap: '10px', opacity: 0.6, fontSize: '0.9rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://facebook.com/sparkmagic', '_blank')}>Facebook</span>
                <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://discord.gg/sparkmagic', '_blank')}>Discord</span>
                <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://bsky.app/profile/sparkmagic.ai', '_blank')}>Blue Sky</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.3, fontSize: '0.8rem' }}>
          © 2026 Sparks AI. All rights reserved. Built with love for the next generation.
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
