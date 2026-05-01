import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, Zap, ArrowLeft } from 'lucide-react';

const AuthView = ({ googleError, handleCredentialResponse, setView }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [initError, setInitError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const btnRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const ensureGsiScript = () => {
      if (window.google?.accounts?.id) return Promise.resolve();

      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        return new Promise((resolve, reject) => {
          existingScript.addEventListener('load', resolve, { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services script.')), { once: true });
          setTimeout(() => {
            if (window.google?.accounts?.id) resolve();
          }, 100);
        });
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
        document.head.appendChild(script);
      });
    };

    const initGSI = async () => {
      try {
        for (let attempt = 1; attempt <= 10; attempt += 1) {
          if (isCancelled) return;

          setRetryCount(attempt);
          await ensureGsiScript();

          const googleButtonParent = btnRef.current || document.getElementById('google-signin-btn');

          if (window.google?.accounts?.id && googleButtonParent) {
            window.google.accounts.id.initialize({
              client_id: '682818593798-cl4hutmj3gbj0cje8i7ndrs82oecuo3o.apps.googleusercontent.com',
              callback: handleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true
            });

            googleButtonParent.innerHTML = '';

            window.google.accounts.id.renderButton(googleButtonParent, {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              width: 280,
              text: 'continue_with'
            });

            setIsScriptLoaded(true);
            setInitError(null);

            console.log('✅ Google Sign-In Button Rendered');
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (!isCancelled) {
          setInitError('Google Identity Services failed to load after 10 attempts.');
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('GSI Init Error:', err);
          setInitError(err.message || 'Google Sign-In could not be initialized.');
        }
      }
    };

    initGSI();

    return () => {
      isCancelled = true;
    };
  }, [handleCredentialResponse]);

  const handleGuestEntry = () => {
    // Fallback for development or when Google is blocked
    const guestUser = {
      name: 'Explorer',
      email: 'guest@spark-magic.com',
      picture: 'https://cdn-icons-png.flaticon.com/512/1043/1043321.png',
      id: 'guest-' + Date.now()
    };
    handleCredentialResponse({ credential: null, isGuest: true, user: guestUser });
  };

  return (
    <div className="auth-overlay" style={{
      background: 'radial-gradient(circle at center, #1a1a2e, #0f0f1a)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass auth-card"
        style={{
          padding: '50px',
          borderRadius: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginBottom: '30px' }}
        >
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '30px',
            background: 'rgba(58, 134, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 0 30px rgba(58, 134, 255, 0.3)'
          }}>
            <User size={64} color="var(--accent)" />
          </div>
        </motion.div>

        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 800 }}>Welcome Back!</h2>
        <p style={{ opacity: 0.6, marginBottom: '40px', fontSize: '1.1rem' }}>
          Your magic journey continues here.
        </p>
        
        <div style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          {(googleError || initError) ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ff4d4d', textAlign: 'center', padding: '20px', background: 'rgba(255,77,77,0.1)', borderRadius: '20px', width: '100%' }}
            >
              <ShieldAlert size={32} style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Google Sign-In is currently unavailable.<br />
                <span style={{ opacity: 0.7, fontWeight: 'normal' }}>Try using Guest Mode below to continue.</span>
              </div>
            </motion.div>
          ) : (
            <>
              <div
                id="google-signin-btn"
                ref={btnRef}
                style={{
                  minHeight: '44px',
                  width: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              ></div>
              {!isScriptLoaded && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <div className="loader" style={{ opacity: 0.5 }}>Loading Magic...</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.3 }}>(Attempt {retryCount}/10)</div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={handleGuestEntry}
            className="kids-button secondary"
            style={{
              width: '100%',
              maxWidth: '280px',
              margin: '0 auto',
              fontSize: '1rem',
              padding: '12px 20px',
              opacity: (googleError || initError) ? 1 : 0.8
            }}
          >
            <Zap size={18} /> Enter as Guest
          </button>
          {!googleError && !initError && (
            <p style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '10px' }}>
              No Google account? No problem!
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => setView('landing')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer', 
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          
          <div style={{ marginTop: '40px', fontSize: '0.8rem', opacity: 0.4 }}>
            By signing in, you agree to our <br/>
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setView('terms')}>Terms</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setView('privacy')}>Privacy Policy</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;

