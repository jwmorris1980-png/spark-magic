import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', background: '#1a1a2e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '20px', fontFamily: 'Fredoka, sans-serif' }}>
          <h1 style={{ fontSize: '3rem', color: '#ffbe0b' }}>Something went wrong 😢</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Spark's brain had a little flicker. Don't worry, John, we can fix it!</p>
          <pre style={{ color: '#ff4d4d', marginTop: 20, whiteSpace: 'pre-wrap', maxWidth: '80%', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 30, padding: '15px 30px', borderRadius: 12, background: '#3a86ff', color: 'white', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 600, boxShadow: '0 10px 20px rgba(58, 134, 255, 0.3)' }}
          >
            Reload Sparks
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
