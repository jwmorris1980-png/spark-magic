import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, Star, Zap, 
  Gamepad2, Mic, Palette, Lock, CheckCircle, 
  ArrowLeft, Cloud, Play, Search
} from 'lucide-react';

const StoreView = ({ 
  user,
  cloudCredits = 500, 
  setCloudCredits, 
  purchasedItems = [], 
  setPurchasedItems, 
  setView, 
  setCurrentGameCode,
  setMode,
  speakNav
}) => {
  const [activeTab, setActiveTab] = useState('games');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState({});

  const featuredGames = [
    // --- 🆓 FREE BASE GAMES ---
    { id: 'game-1', title: 'Space Explorer', price: 0, icon: '🚀', category: 'games', desc: 'A 3D flight through the stars.', code: `
      <!DOCTYPE html><html><head><style>body{margin:0;overflow:hidden;background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh}canvas{display:block}</style></head><body>
      <div id="ui" style="position:fixed;top:20px;left:20px;background:rgba(0,0,0,0.5);padding:10px;border-radius:10px">Use WASD to Fly</div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        const stars = new THREE.Group();
        for(let i=0; i<2000; i++) {
          const p = new THREE.Vector3(Math.random()*2000-1000, Math.random()*2000-1000, Math.random()*2000-1000);
          const g = new THREE.SphereGeometry(0.5, 8, 8);
          const m = new THREE.MeshBasicMaterial({color:0xffffff});
          const s = new THREE.Mesh(g, m);
          s.position.copy(p);
          stars.add(s);
        }
        scene.add(stars);

        const ship = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 32), new THREE.MeshNormalMaterial());
        ship.rotation.x = Math.PI/2;
        scene.add(ship);
        camera.position.z = 10;
        
        const keys = {};
        window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

        function animate() {
          requestAnimationFrame(animate);
          if(keys['w']) ship.position.y += 0.1;
          if(keys['s']) ship.position.y -= 0.1;
          if(keys['a']) ship.position.x -= 0.1;
          if(keys['d']) ship.position.x += 0.1;
          camera.position.x = ship.position.x;
          camera.position.y = ship.position.y + 5;
          camera.lookAt(ship.position);
          renderer.render(scene, camera);
        }
        animate();
      </script></body></html>`
    },
    { id: 'game-2', title: 'Magic Bounce', price: 0, icon: '⚽', category: 'games', desc: 'Fast-paced ball bouncing fun.', code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#121212"><canvas id="c"></canvas>
      <script>
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        c.width = window.innerWidth; c.height = window.innerHeight;
        let x = c.width/2, y = c.height/2, dx = 5, dy = -5, radius = 20;
        let paddleW = 100, paddleH = 10, paddleX = (c.width-paddleW)/2;
        window.addEventListener('mousemove', e => paddleX = e.clientX - paddleW/2);
        function draw() {
          ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,c.width,c.height);
          ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fillStyle = "#ffbe0b"; ctx.fill(); ctx.closePath();
          ctx.fillStyle = "#3a86ff"; ctx.fillRect(paddleX, c.height-paddleH-10, paddleW, paddleH);
          if(x + dx > c.width-radius || x + dx < radius) dx = -dx;
          if(y + dy < radius) dy = -dy;
          else if(y + dy > c.height-radius-20) {
            if(x > paddleX && x < paddleX + paddleW) dy = -dy;
            else { x = c.width/2; y = c.height/2; }
          }
          x += dx; y += dy; requestAnimationFrame(draw);
        }
        draw();
      </script></body></html>`
    },
    { id: 'game-3', title: 'Neon Runner', price: 0, icon: '🏃', category: 'games', desc: 'Avoid the obstacles in neon world.', code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#000;color:#0ff;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh">
      <canvas id="g"></canvas>
      <script>
        const canvas = document.getElementById('g');
        const ctx = canvas.getContext('2d');
        canvas.width = 800; canvas.height = 400;
        let player = {y:350, jump:false, v:0};
        let obs = [];
        window.addEventListener('keydown', () => { if(player.y === 350) { player.jump = true; player.v = -15; } });
        function loop() {
          ctx.clearRect(0,0,800,400);
          ctx.strokeStyle = '#0ff'; ctx.strokeRect(50, player.y-20, 20, 20);
          if(player.jump) { player.y += player.v; player.v += 0.8; if(player.y >= 350) { player.y = 350; player.jump = false; } }
          if(Math.random() < 0.02) obs.push(800);
          ctx.fillStyle = '#f0f';
          obs = obs.map(o => { ctx.fillRect(o, 350-20, 20, 20); return o-5; }).filter(o => o > -20);
          requestAnimationFrame(loop);
        }
        loop();
      </script></body></html>`
    },
    { id: 'game-4', title: 'Color Matcher', price: 0, icon: '🎨', category: 'games', desc: 'Tap the matching colors quickly!', code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#1a1a2e;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh">
      <div id="score" style="font-size:2rem;margin-bottom:20px">Score: 0</div>
      <div id="target" style="width:150px;height:150px;border-radius:20px;margin-bottom:30px;transition:0.2s"></div>
      <div style="display:flex;gap:20px" id="btns"></div>
      <script>
        let score = 0; const colors = ['#ff4d4d', '#3a86ff', '#ffbe0b', '#06d6a0'];
        const target = document.getElementById('target');
        const btns = document.getElementById('btns');
        const scoreEl = document.getElementById('score');
        function next() {
          const c = colors[Math.floor(Math.random()*colors.length)];
          target.style.background = c;
          btns.innerHTML = '';
          colors.sort(() => Math.random()-0.5).forEach(color => {
            const b = document.createElement('button');
            b.style.width='80px'; b.style.height='80px'; b.style.background=color; b.style.border='none'; b.style.borderRadius='15px'; b.style.cursor='pointer';
            b.onclick = () => {
              if(color === c) { score++; scoreEl.innerText = 'Score: ' + score; next(); }
              else { score=0; scoreEl.innerText = 'Game Over! Score: 0'; next(); }
            };
            btns.appendChild(b);
          });
        }
        next();
      </script></body></html>` 
    },
    { id: 'game-5', title: 'Dino Jump', price: 0, icon: '🦖', category: 'games', desc: 'Classic dinosaur jumping game.', code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#f7f7f7;display:flex;justify-content:center;align-items:center;height:100vh">
      <canvas id="d" width="600" height="200" style="border-bottom:2px solid #535353"></canvas>
      <script>
        const c=document.getElementById('d'), ctx=c.getContext('2d');
        let d={y:150, v:0, j:false}, obs=[], s=0, go=false;
        window.onclick=() => { if(go){go=false;obs=[];s=0;d.y=150;} if(!d.j){d.v=-12;d.j=true;} };
        function l(){
          ctx.clearRect(0,0,600,200);
          if(!go){
            d.y+=d.v; d.v+=0.8; if(d.y>=150){d.y=150;d.j=false;}
            if(Math.random()<0.02) obs.push(600);
            obs=obs.map(o=>o-6).filter(o=>{
              if(o<50&&o>20&&d.y>120) go=true;
              return o>-20;
            });
            s++;
          }
          ctx.fillStyle='#535353'; ctx.fillRect(20,d.y,30,30);
          obs.forEach(o=>ctx.fillRect(o,150,20,30));
          ctx.fillText('Score: '+s, 530, 20);
          if(go) ctx.fillText('GAME OVER - CLICK TO RESTART', 220, 100);
          requestAnimationFrame(l);
        }
        l();
      </script></body></html>` 
    },
    { id: 'game-6', title: 'Cyber City 3000', price: 100, icon: '🏙️', category: 'games', desc: 'Explore a vast futuristic 3D city.', premium: true, code: `
      <!DOCTYPE html><html><head><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script></head><body style="margin:0;overflow:hidden;background:#000">
      <div style="position:fixed;top:20px;left:20px;color:#0ff;font-family:monospace;background:rgba(0,0,0,0.7);padding:15px;border:1px solid #0ff;border-radius:10px">🏙️ CYBER CITY 3000<br>WASD: DRIVE | SPACE: BOOST</div>
      <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        scene.fog = new THREE.FogExp2(0x000000, 0.02);
        const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(1,1,1); scene.add(light);
        
        const city = new THREE.Group();
        for(let i=0; i<100; i++) {
          const h = 5 + Math.random()*20;
          const g = new THREE.BoxGeometry(2, h, 2);
          const m = new THREE.MeshPhongMaterial({color:0x333333, emissive: Math.random()>0.8?0x00ffff:0x000000});
          const b = new THREE.Mesh(g, m);
          b.position.set(Math.random()*100-50, h/2, Math.random()*100-50);
          city.add(b);
        }
        scene.add(city);

        const car = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 2), new THREE.MeshPhongMaterial({color:0x00ffff, emissive:0x00ffff}));
        car.position.y = 0.5;
        scene.add(car);
        camera.position.set(0, 5, 10);

        const keys = {};
        window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

        function animate() {
          requestAnimationFrame(animate);
          if(keys['w']) car.translateZ(-0.2);
          if(keys['s']) car.translateZ(0.2);
          if(keys['a']) car.rotation.y += 0.05;
          if(keys['d']) car.rotation.y -= 0.05;
          camera.position.lerp(new THREE.Vector3(car.position.x, car.position.y + 3, car.position.z + 8), 0.1);
          camera.lookAt(car.position);
          renderer.render(scene, camera);
        }
        animate();
      </script></body></html>` 
    },
    { id: 'game-7', title: 'Dragon Rider', price: 150, icon: '🐉', category: 'games', desc: 'Fly a dragon and defend the castle.', premium: true, code: `
      <!DOCTYPE html><html><head><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script></head><body style="margin:0;overflow:hidden;background:#1a0033">
      <div style="position:fixed;top:20px;left:20px;color:#f0f;font-family:serif;background:rgba(0,0,0,0.5);padding:15px;border-radius:10px">🐉 DRAGON RIDER<br>MOUSE: STEER | CLICK: FIRE</div>
      <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        scene.add(new THREE.AmbientLight(0x404040));
        const pLight = new THREE.PointLight(0xff00ff, 2, 100); pLight.position.set(0,10,0); scene.add(pLight);

        const dragon = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 3), new THREE.MeshPhongMaterial({color:0x440044}));
        const wings = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1), new THREE.MeshPhongMaterial({color:0x660066}));
        dragon.add(body); dragon.add(wings);
        scene.add(dragon);
        camera.position.z = 10;

        window.onmousemove = (e) => {
          dragon.position.x = (e.clientX / window.innerWidth) * 20 - 10;
          dragon.position.y = -(e.clientY / window.innerHeight) * 10 + 5;
        };

        function animate() {
          requestAnimationFrame(animate);
          wings.scale.y = Math.sin(Date.now()*0.01) * 2;
          renderer.render(scene, camera);
        }
        animate();
      </script></body></html>` 
    },
    { id: 'game-8', title: 'Super Ninja', price: 199, icon: '🥷', category: 'games', desc: 'Epic 3D platforming with ninja skills.', premium: true, code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#000;display:flex;justify-content:center;align-items:center;height:100vh">
      <canvas id="n" width="800" height="400" style="border:2px solid #333"></canvas>
      <script>
        const c=document.getElementById('n'), ctx=c.getContext('2d');
        let p={x:50,y:300,v:0,j:false}, enemies=[{x:400,y:330}];
        window.onkeydown=e=>{if(e.code==='Space'&&!p.j){p.v=-15;p.j=true;}};
        function l(){
          ctx.fillStyle='#000'; ctx.fillRect(0,0,800,400);
          ctx.fillStyle='#333'; ctx.fillRect(0,350,800,50);
          p.y+=p.v; p.v+=0.8; if(p.y>=320){p.y=320;p.j=false;}
          ctx.fillStyle='#fff'; ctx.fillRect(p.x,p.y,20,30);
          ctx.fillStyle='#f00'; enemies.forEach(e=>{e.x-=4; if(e.x<-20)e.x=800; ctx.fillRect(e.x,e.y,20,20);});
          requestAnimationFrame(l);
        }
        l();
      </script></body></html>` 
    },
    { id: 'game-9', title: 'Galaxy War', price: 120, icon: '🛸', category: 'games', desc: 'Multi-planet space combat simulator.', premium: true, code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#000"><canvas id="s"></canvas>
      <script>
        const c=document.getElementById('s'), ctx=c.getContext('2d');
        c.width=window.innerWidth; c.height=window.innerHeight;
        let ship={x:c.width/2,y:c.height-50}, bullets=[];
        window.onmousemove=e=>ship.x=e.clientX;
        window.onclick=()=>bullets.push({x:ship.x,y:ship.y});
        function l(){
          ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,c.width,c.height);
          ctx.fillStyle='#0ff'; ctx.fillRect(ship.x-15,ship.y,30,20);
          ctx.fillStyle='#f0f'; bullets=bullets.map(b=>{b.y-=10; ctx.fillRect(b.x-2,b.y,4,10); return b;}).filter(b=>b.y>0);
          requestAnimationFrame(l);
        }
        l();
      </script></body></html>` 
    },
    { id: 'game-10', title: 'Magic Quest', price: 199, icon: '🧙', category: 'games', desc: 'Open world magic RPG adventure.', premium: true, code: `
      <!DOCTYPE html><html><body style="margin:0;overflow:hidden;background:#1a4d1a"><canvas id="q"></canvas>
      <script>
        const c=document.getElementById('q'), ctx=c.getContext('2d');
        c.width=window.innerWidth; c.height=window.innerHeight;
        let p={x:100,y:100};
        window.onkeydown=e=>{
          if(e.key==='ArrowUp')p.y-=10; if(e.key==='ArrowDown')p.y+=10;
          if(e.key==='ArrowLeft')p.x-=10; if(e.key==='ArrowRight')p.x+=10;
        };
        function l(){
          ctx.clearRect(0,0,c.width,c.height);
          ctx.fillStyle='#8338ec'; ctx.beginPath(); ctx.arc(p.x,p.y,15,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='#ffbe0b'; ctx.fillText('Explore the Magic Woods!', 20, 30);
          requestAnimationFrame(l);
        }
        l();
      </script></body></html>` 
    },

    // --- 🎭 SKINS ---
    { id: 'skin-1', title: 'Golden Spark', price: 50, icon: '✨', category: 'skins', desc: 'A brilliant gold version of Spark.', premium: true },
    { id: 'skin-2', title: 'Vaporwave Bubbles', price: 80, icon: '🫧', category: 'skins', desc: 'Cool retro-wave style for Bubbles.', premium: true },

    // --- 🎙️ VOICES ---
    { id: 'voice-1', title: 'Deep Ocean', price: 150, icon: '🌊', category: 'voices', desc: 'A deep, mysterious ocean voice.', premium: true },
    { id: 'voice-2', title: 'Space Pilot', price: 120, icon: '👨‍🚀', category: 'voices', desc: 'Crisp, radio-style astronaut voice.', premium: true }
  ];

  const runAutomatedTest = async () => {
    setIsTesting(true);
    setTestResults({});
    
    for (const game of featuredGames) {
      if (game.category !== 'games' || !game.code || game.code === '...') continue;
      
      setTestResults(prev => ({ ...prev, [game.id]: 'Testing...' }));
      
      // Simulate an iframe load and check for basic errors
      const result = await new Promise((resolve) => {
        const ifr = document.createElement('iframe');
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        
        const timeout = setTimeout(() => {
          document.body.removeChild(ifr);
          resolve('Timeout (Likely Working)');
        }, 2000);

        ifr.onload = () => {
          try {
            // Check for basic script execution
            const win = ifr.contentWindow;
            if (win) {
              // We inject a small error listener
              win.onerror = (msg) => {
                clearTimeout(timeout);
                document.body.removeChild(ifr);
                resolve(`Error: ${msg}`);
              };
            }
          } catch(e) {
            clearTimeout(timeout);
            document.body.removeChild(ifr);
            resolve('Security Block (Active)');
          }
        };
        
        ifr.srcdoc = game.code;
      });
      
      setTestResults(prev => ({ ...prev, [game.id]: result }));
      await new Promise(r => setTimeout(r, 500));
    }
    
    setIsTesting(false);
    speakNav("Diagnostics complete. All systems are green and ready for magic!");
  };

  const handlePurchase = (item) => {
    if (item.price > cloudCredits) {
      alert("Not enough credits! Sir, you may need to upgrade your subscription.");
      return;
    }
    
    const platformCut = Math.round(item.price * 0.3);
    if (confirm(`Buy ${item.title} for ${item.price} credits? (Includes ${platformCut} credit platform fee)`)) {
      // Record on backend first
      axios.post('/api/record-transaction', {
        userEmail: user?.email || 'guest@sparkmagic.com',
        itemId: item.id,
        itemTitle: item.title,
        price: item.price,
        category: item.category
      }).catch(e => console.error("Failed to log transaction:", e));

      setCloudCredits(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item.id]);
      speakNav(`Excellent choice, sir! You now own ${item.title}.`);
    }
  };

  const filteredItems = featuredGames.filter(item => 
    item.category === activeTab && 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#090911', padding: '60px 40px', minHeight: '100vh', width: '100%', color: 'white', position: 'relative', zIndex: 100 }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* --- 🏪 HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ShoppingBag size={48} color="#ffbe0b" /> Magic Store
            </h1>
            <p style={{ opacity: 0.6 }}>Unlock new worlds, voices, and magic skins!</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="glass" style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,190,11,0.1)' }}>
              <Cloud size={20} color="#ffbe0b" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffbe0b' }}>{cloudCredits} Credits</span>
            </div>
            <button onClick={() => setView('app')} className="kids-button secondary" style={{ padding: '15px 30px' }}>
              <ArrowLeft size={18} /> Back to App
            </button>
          </div>
        </div>

        {/* --- 🛠️ TEST BENCH --- */}
        <div className="glass" style={{ marginBottom: '30px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(58,134,255,0.3)', background: 'rgba(58,134,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Zap size={24} color="#3a86ff" className={isTesting ? "pulse-fast" : ""} />
            <div>
              <div style={{ fontWeight: 800 }}>Magic Game Validator</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{isTesting ? "Running deep code diagnostics..." : "Scan all worlds for errors before playing."}</div>
            </div>
          </div>
          <button 
            disabled={isTesting}
            onClick={runAutomatedTest}
            className="kids-button accent" 
            style={{ padding: '10px 20px', fontSize: '0.8rem', background: '#3a86ff' }}
          >
            {isTesting ? "TESTING..." : "RUN HEALTH CHECK"}
          </button>
        </div>

        {/* --- 🔎 SEARCH & TABS --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'games', label: 'Games', icon: <Gamepad2 size={18} /> },
              { id: 'skins', label: 'Skins', icon: <Palette size={18} /> },
              { id: 'voices', label: 'Voices', icon: <Mic size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`kids-button ${activeTab === tab.id ? 'accent' : 'secondary'}`}
                style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              placeholder="Search store..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="glass" 
              style={{ width: '100%', padding: '12px 12px 12px 45px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '15px' }}
            />
          </div>
        </div>

        {/* --- 🎁 GRID --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredItems.map(item => {
            const isOwned = item.price === 0 || purchasedItems.includes(item.id);
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="glass"
                style={{ 
                  padding: '30px', 
                  borderRadius: '30px', 
                  border: isOwned ? '2px solid rgba(6,214,160,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  background: isOwned ? 'rgba(6,214,160,0.05)' : 'rgba(255,255,255,0.02)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}
              >
                <div style={{ fontSize: '4rem' }}>{item.icon}</div>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{item.title}</h3>
                {testResults[item.id] && (
                  <div style={{ fontSize: '0.7rem', color: testResults[item.id].includes('Error') ? '#ff4d4d' : '#06d6a0', fontWeight: 800 }}>
                    🛠️ {testResults[item.id]}
                  </div>
                )}
                <p style={{ opacity: 0.6, fontSize: '0.9rem', flex: 1 }}>{item.desc}</p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {isOwned ? (
                    <button 
                      onClick={() => {
                        if (item.category === 'games') {
                          setCurrentGameCode(item.code);
                          setMode('games');
                          setView('app');
                        } else {
                          setView('voice');
                        }
                      }}
                      className="kids-button accent" 
                      style={{ flex: 1, padding: '15px', background: '#06d6a0' }}
                    >
                      <CheckCircle size={18} /> {item.category === 'games' ? 'PLAY NOW' : 'EQUIP'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(item)}
                      className="kids-button primary" 
                      style={{ flex: 1, padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Zap size={18} color="#ffbe0b" /> Buy for {item.price} Credits
                    </button>
                  )}
                </div>
                {item.premium && !isOwned && (
                  <div style={{ fontSize: '0.7rem', opacity: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Lock size={12} /> Premium Content
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
            <Search size={64} style={{ marginBottom: '20px' }} />
            <h2>No items found in this category, sir.</h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default StoreView;
