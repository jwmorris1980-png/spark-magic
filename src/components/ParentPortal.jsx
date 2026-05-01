import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Activity, Cpu, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ParentPortal = ({ 
  parentalControls, 
  updateStrikes, 
  pinInput, 
  setPinInput, 
  updateParentPin, 
  allLogs, 
  user, 
  updateParentLock,
  setView
}) => {
  const [droneLogs, setDroneLogs] = useState([]);

  // Fetch AI Guardian logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/drone-logs');
        setDroneLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch drone logs");
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="parent-portal active" style={{ padding: '20px', minHeight: '100vh', background: '#0f0f1b' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN: Controls */}
        <div className="parent-card" style={{ flex: '1 1 350px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', letterSpacing: '1px' }}>SECURITY STATUS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <ShieldCheck size={20} color="#06d6a0" />
              <h2 style={{ margin: 0, color: '#fff' }}>Safe-Search: ACTIVE</h2>
            </div>
          </div>
          
          {parentalControls.strikes >= 3 && (
             <div style={{ background: 'rgba(255,77,77,0.2)', border: '1px solid #ff4d4d', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'center' }}>
                <AlertTriangle size={32} color="#ff4d4d" style={{marginBottom:'10px'}} />
                <h3 style={{ color: '#ff4d4d', marginTop:0 }}>Safety Lockout Active!</h3>
                <p style={{fontSize:'0.9rem', marginBottom:'15px', color: '#fff'}}>The student has accumulated {parentalControls.strikes} safety strikes. Review the logs and authorize the unlock below.</p>
                <button 
                  onClick={() => { updateStrikes(0); alert("Account Unlocked!"); }} 
                  className="kids-button accent" style={{ width: '100%', background: '#ff4d4d' }}>
                  Acknowledge & Unlock
                </button>
             </div>
          )}

          <h2 style={{ color: '#fff' }}>⏱️ App Time Controls</h2>
          <p style={{opacity:0.7, marginBottom:'20px', color: '#fff'}}>Determine exactly when your kids can access fun/entertainment modes.</p>
          {['sandbox', 'school', 'games', 'videos'].map(mkey => (
            <div key={mkey} style={{ display:'flex', flexDirection:'column', gap:'10px', background:'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'10px', marginBottom:'15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{textTransform:'capitalize', margin:0, color: '#fff'}}>{mkey}</h3>
                <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', color: '#fff' }}>
                  <input type="checkbox" checked={parentalControls?.locks?.[mkey]?.enabled || false} onChange={(e) => updateParentLock(mkey, 'enabled', e.target.checked)} /> Lock Schedule
                </label>
              </div>
              {parentalControls?.locks?.[mkey]?.enabled && (
                 <div style={{ display:'flex', gap:'10px', alignItems:'center', opacity:0.8, color: '#fff' }}>
                   <span>From:</span><input type="time" value={parentalControls.locks[mkey].start || "09:00"} onChange={(e) => updateParentLock(mkey, 'start', e.target.value)} style={{background:'white', color:'black', padding:'5px', borderRadius:'5px'}} />
                   <span>To:</span><input type="time" value={parentalControls.locks[mkey].end || "17:00"} onChange={(e) => updateParentLock(mkey, 'end', e.target.value)} style={{background:'white', color:'black', padding:'5px', borderRadius:'5px'}} />
                 </div>
              )}
            </div>
          ))}
          
          <button onClick={() => setView('app')} className="kids-button secondary" style={{width:'100%', marginTop:'20px'}}>Exit Portal</button>
        </div>

        {/* RIGHT COLUMN: Logs & Drone */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI GUARDIAN SECTION */}
          <div className="parent-card" style={{ background: 'rgba(58, 134, 255, 0.05)', border: '1px solid rgba(58, 134, 255, 0.2)', padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={24} color="#3a86ff" />
                <h2 style={{ margin: 0, color: '#fff' }}>AI Guardian Drone Activity</h2>
              </div>
              <div className="status-tag status-safe" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle size={14} /> LIVE MONITORING
              </div>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px' }}>
               {droneLogs.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5, color: '#fff' }}>Drone is initializing magical sensors...</div>
               ) : (
                 droneLogs.map(log => (
                   <div key={log.id} style={{ display: 'flex', gap: '15px', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                      <span style={{ opacity: 0.5, whiteSpace: 'nowrap', color: '#fff' }}>[{log.timestamp}]</span>
                      <span style={{ 
                        color: log.status === 'ERROR' ? '#ff4d4d' : log.status === 'FIXED' ? '#06d6a0' : '#3a86ff',
                        fontWeight: 'bold',
                        minWidth: '60px'
                      }}>
                        {log.status}
                      </span>
                      <span style={{ color: '#fff' }}>{log.message}</span>
                   </div>
                 ))
               )}
            </div>
          </div>

          {/* PROJECT LOGS SECTION */}
          <div className="parent-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
            <h2 style={{ color: '#fff' }}>Student Activity Logs</h2>
            <div className="activity-table-wrap" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="activity-table">
              <thead><tr><th>Time</th><th>User</th><th>Message</th><th>Safety</th></tr></thead>
              <tbody>
                {allLogs.slice().reverse().map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td>{log.sender === 'user' ? user?.spaceName || 'Student' : 'AI'}</td>
                    <td>{log.text}</td>
                    <td>{log.filtered ? <span className="status-tag status-filtered">Blocked</span> : <span className="status-tag status-safe">Safe</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
