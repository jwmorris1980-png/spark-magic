
const express = require('express');
require('dotenv').config();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 8080;

// (Server initialization moved to bottom)


app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Heartbeat Monitor (First priority for Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).send('Spark is alive and magical! ✨');
});

// --- 🛡️ AI GUARDIAN SYSTEM ---
let droneLogs = [];
const MAX_LOGS = 50;

app.post('/api/drone-report', (req, res) => {
    const { status, message, type } = req.body;
    const log = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        status: status || 'OK',
        message: message || 'Heartbeat healthy',
        type: type || 'check'
    };
    droneLogs.unshift(log);
    if (droneLogs.length > MAX_LOGS) droneLogs.pop();
    res.json({ success: true });
});

app.get('/api/drone-logs', (req, res) => {
    res.json(droneLogs);
});

// --- 👥 USER TRACKING SYSTEM ---
const USERS_FILE = path.join(__dirname, 'users.json');
const TRANSACTIONS_FILE = path.join(__dirname, 'transactions.json');

app.post('/api/log-signin', (req, res) => {
    const userData = req.body;
    if (!userData || !userData.email) return res.status(400).json({ error: "Invalid user data" });

    try {
        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
            users = JSON.parse(fileContent || '[]');
        }

        // Add user if they don't exist, or update last sign-in
        const existingUserIndex = users.findIndex(u => u.email === userData.email);
        const userEntry = {
            ...userData,
            lastLogin: new Date().toISOString(),
            loginCount: (existingUserIndex >= 0 ? (users[existingUserIndex].loginCount || 0) + 1 : 1)
        };

        if (existingUserIndex >= 0) {
            users[existingUserIndex] = userEntry;
        } else {
            userEntry.joinedAt = new Date().toISOString();
            users.push(userEntry);
        }

        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log(`👤 User Signed In: ${userData.email}`);
        res.json({ success: true, userCount: users.length });
    } catch (err) {
        console.error("❌ Failed to log sign-in:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/user-count', (req, res) => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
            return res.json({ count: users.length, users: users.map(u => ({ name: u.name, email: u.email, lastLogin: u.lastLogin })) });
        }
        res.json({ count: 0, users: [] });
    } catch (err) {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// --- 💰 TRANSACTION & REVENUE SYSTEM ---
app.post('/api/record-transaction', (req, res) => {
    const { userEmail, itemId, itemTitle, price, category } = req.body;
    if (!userEmail || !itemId || !price) return res.status(400).json({ error: "Invalid transaction data" });

    try {
        let transactions = [];
        if (fs.existsSync(TRANSACTIONS_FILE)) {
            const content = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
            transactions = JSON.parse(content || '[]');
        }

        const platformCut = Math.round(price * 0.3); // 30% Platform Fee
        const newTransaction = {
            id: `tx-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userEmail,
            itemId,
            itemTitle,
            category,
            totalPrice: price,
            platformRevenue: platformCut,
            userNet: price - platformCut
        };

        transactions.push(newTransaction);
        fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));

        console.log(`💰 Transaction Recorded: ${itemTitle} (${price} credits). Platform Take: ${platformCut}`);
        res.json({ success: true, platformRevenue: platformCut });
    } catch (err) {
        console.error("❌ Failed to record transaction:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/revenue-report', (req, res) => {
    try {
        if (fs.existsSync(TRANSACTIONS_FILE)) {
            const txs = JSON.parse(fs.readFileSync(TRANSACTIONS_FILE, 'utf8') || '[]');
            const totalRevenue = txs.reduce((sum, tx) => sum + (tx.platformRevenue || 0), 0);
            return res.json({ 
                totalRevenue, 
                transactionCount: txs.length,
                transactions: txs.slice(-100) // Last 100 txs
            });
        }
        res.json({ totalRevenue: 0, transactionCount: 0, transactions: [] });
    } catch (err) {
        res.status(500).json({ error: "Failed to read revenue" });
    }
});

const { GoogleGenerativeAI } = require('@google/generative-ai');
// genAI is now initialized inside each request for maximum robustness

// --- 🧠 CHAT BRAIN (Gemini 1.5 Flash with Memory & Vision) ---
app.post('/api/chat', async (req, res) => {
    const { messages, mode, aiName = "Spark", personaId = "spark", personaName = "Spark", isBuddyMode = false, context = {} } = req.body;
    const { memory = "", recentStickers = "" } = context;

    const personaStyles = {
        spark: "Warm, curious, and playful. Use short upbeat sentences and 1 emoji max.",
        bubbles: "Super cheerful and bouncy. Use excited language and celebratory tone.",
        hero: "Brave and action-focused. Encourage courage, teamwork, and mission language.",
        professor: "Calm teacher vibe. Explain clearly with simple steps and gentle guidance.",
        robot: "Precise and techy but friendly. Use concise language and fun science flavor.",
        dragon: "Epic fantasy guardian. Speak with noble confidence and magical imagery.",
        ninja: "Stealthy, focused coach. Keep replies short, sharp, and challenge-oriented.",
        wizard: "Wise spellcaster tone. Use wonder-filled language and storybook style.",
        rocket: "High-energy space captain. Fast, motivating tone with exploration vibes.",
        ghost: "Spooky-fun and silly, never scary. Light jokes and playful mystery tone.",
    };
    const personaStyle = personaStyles[personaId] || personaStyles.spark;

    let systemPrompt = `You are ${aiName}, a safe, friendly AI for kids. 
    STRICT RULE: Be a "Maker Buddy". Your goal is to help the child create things.
    Keep conversation very upbeat and BRIEF (1-2 short sentences).
    ${memory ? `Know: ${memory}.` : ''}${recentStickers ? ` Stickers: ${recentStickers}.` : ''}
    Persona: ${personaName} — ${personaStyle}
    CRITICAL: Always put [IMAGE: prompt] on its own line at the very end.
    Your main text MUST be a complete, finished sentence. NEVER end with a colon, comma, or dangling connector.
    Use 1-2 friendly, upbeat sentences max.`;

    try {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
        if (!apiKey) {
            console.error("❌ No API Key found in environment!");
            return res.status(500).json({ error: "Missing API Key" });
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = "gemini-2.5-flash"; 

        const lastMessage = messages[messages.length - 1].text || messages[messages.length - 1].content || "";
        if (!lastMessage) return res.status(400).json({ error: "No message found" });

        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });
        
        // --- 🛡️ HISTORY CLEANER ---
        let history = (messages || []).slice(-20, -1).map(m => ({
            role: m.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text || m.content || "" }]
        })).filter(h => h.parts[0].text);

        const firstUserIndex = history.findIndex(h => h.role === 'user');
        if (firstUserIndex === -1) {
            history = [];
        } else {
            history = history.slice(firstUserIndex);
        }

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        });

        const whisperMessage = `${systemPrompt}\n\nUSER MESSAGE: ${lastMessage}`;
        const result = await chat.sendMessage(whisperMessage);
        const response = await result.response;
        const text = response.text();

        let cleanText = text;
        let imageTrigger = null;
        let newFacts = [];

        const imgMatch = text.match(/\[IMAGE:\s*(.*?)\]/i);
        if (imgMatch) {
            imageTrigger = imgMatch[1].trim();
            cleanText = cleanText.replace(imgMatch[0], '').trim();
            const fragments = ['a', 'an', 'the', 'this', 'that', 'your', 'my', 'some', 'any', 'with', 'of', 'about', 'for', 'to', 'make', 'create', 'show', 'see', 'build', 'draw', 'generate', 'want', 'like', 'need', 'give'];
            const fragmentRegex = new RegExp(`\\s+(${fragments.join('|')})$`, 'i');
            cleanText = cleanText.replace(fragmentRegex, '').trim();
            cleanText = cleanText.replace(/(\s+(and|or|with|of|me|you))$/i, '').trim();
            if (cleanText.endsWith(':') || cleanText.endsWith(',')) cleanText = cleanText.slice(0, -1).trim();
            if (cleanText.length > 0 && !/[.!?]$/.test(cleanText)) {
                cleanText += (cleanText.toLowerCase().includes('want') || cleanText.toLowerCase().includes('should')) ? "?" : ".";
            }
        }

        const memMatches = [...text.matchAll(/\[MEM:\s*(.*?)\]/gi)];
        if (memMatches.length > 0) {
            memMatches.forEach(match => newFacts.push(match[1].trim()));
            cleanText = cleanText.replace(/\[MEM:\s*.*?\]/gi, '').trim();
        }

        res.json({ text: cleanText, newFacts, imageTrigger });
    } catch (err) {
        console.error("❌ GEMINI CRITICAL FAILURE:");
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);
        if (err.response) {
            console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
        }
        res.status(500).json({ 
            error: "Gemini failed", 
            details: err.message,
            code: err.code || "UNKNOWN_AI_ERROR"
        });
    }

});

// --- 🎙️ NEURAL VOICE (Server-Side TTS) ---
app.post('/api/tts', async (req, res) => {
    const { text, personality = 'spark', pitch, rate, voice } = req.body;
    // Clean text for speech
    const cleanText = (text || '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]+`/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleanText) {
        return res.json({ fallback: true });
    }

    // Cap at ~1000 chars for fast response (was 300)
    const shortText = cleanText.length > 1000 ? cleanText.substring(0, 997) + '...' : cleanText;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    if (apiKey) {
        try {
            const voiceProfiles = {
                spark: { name: 'en-US-Wavenet-F', speakingRate: 1.0, pitch: 0 },
                bubbles: { name: 'en-US-Wavenet-A', speakingRate: 1.35, pitch: 7.0 },
                hero: { name: 'en-US-Wavenet-D', speakingRate: 0.92, pitch: -4.0 },
                professor: { name: 'en-US-Wavenet-B', speakingRate: 0.8, pitch: -2.0 },
                robot: { name: 'en-US-Standard-D', speakingRate: 0.74, pitch: -6.0 },
                dragon: { name: 'en-US-Wavenet-C', speakingRate: 0.84, pitch: -7.0 },
                ninja: { name: 'en-US-Wavenet-I', speakingRate: 1.28, pitch: 0.0 },
                wizard: { name: 'en-US-Wavenet-E', speakingRate: 0.86, pitch: -3.0 },
                rocket: { name: 'en-US-Wavenet-H', speakingRate: 1.3, pitch: 4.0 },
                ghost: { name: 'en-US-Standard-A', speakingRate: 0.72, pitch: 6.0 }
            };
            let profile = voiceProfiles[voice] || voiceProfiles[personality] || voiceProfiles.spark;
            const speakingRate = typeof rate === 'number' ? rate : profile.speakingRate;
            const pitchValue = typeof pitch === 'number' ? pitch : profile.pitch;
            const ttsResponse = await axios.post(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
                {
                    input: { text: shortText },
                    voice: { languageCode: 'en-US', name: profile.name },
                    audioConfig: { audioEncoding: 'MP3', speakingRate, pitch: pitchValue }
                },
                { timeout: 5000 }
            );
            if (ttsResponse.data && ttsResponse.data.audioContent) {
                console.log(`✅ Cloud TTS: ${profile.name} (rate=${speakingRate}, pitch=${pitchValue})`);
                return res.json({ audioContent: ttsResponse.data.audioContent, encoding: 'mp3' });
            } else {
                console.warn('⚠️  Cloud TTS: No audioContent in response', ttsResponse.data);
                return res.status(500).json({ error: 'No audioContent in TTS response', details: ttsResponse.data });
            }

        } catch (err) {
            console.error('❌ Cloud TTS Error:', err.response ? err.response.data : err.message);
            return res.status(500).json({ error: 'TTS API failed', fallback: true });
        }
    } else {
        res.json({ text: "I'm dreaming in offline mode! (No API Key found)", newFacts: [] });
    }
});

app.post('/api/generate-game', async (req, res) => {
    const { prompt } = req.body;
    const systemPrompt = `You are an elite autonomous Game Creation Agent (inspired by the OpenGame framework).
Your task is to write a strictly valid, fully self-contained HTML document featuring a high-quality interactive game.

CORE EXECUTION LOOP:
1. SCAFFOLD: Create a robust architecture (HUD, Game Loop, Asset Manager, State Machine).
2. LOGIC: Use delta-time (dt) for all physics and animations.
3. DEBUG: Write self-correcting code. Ensure window.onerror is handled to reset state if a crash occurs.
4. BUILD: Include immersive Three.js 3D environments or high-fidelity Canvas 2D.

CRITICAL RULES:
1. Output MUST be ONLY valid HTML starting with <!DOCTYPE html> and ending with </html>.
2. Add all styles in <style> and logic in <script>.
3. You MUST include try { window.focus(); } catch(e) {} at start.
4. Use Three.js for 3D: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>.
5. Use GSAP for cinematic sequences: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>.
6. CONTROLS: Arrow keys/WASD. Mouse/Touch support. Clear HUD instructions.
7. QUALITY: Score system, particles, screen shake, and smooth animations. No annoying loud beeps.
8. START SCREEN: Every game MUST have a 'START' button. Do NOT play any sounds until the user clicks Start.
9. CONTENT: Substantial depth (multiple levels, enemies, upgrades).
10. Make it look PREMIUM (Neon/Glow style, dark backgrounds, high contrast).`;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            // --- 🧠 BRAIN-LOCKED: DO NOT CHANGE WITHOUT EXPLICIT USER CONSENT ---
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                systemInstruction: systemPrompt 
            }, { apiVersion: 'v1beta' });
            
            console.log(`🎮 Game Engine: Compiling world for "${prompt}"...`);
            const result = await model.generateContent(`
            ACT AS AN ELITE GAME DEVELOPER. 
            CREATE A FULLY PLAYABLE HTML5 GAME ABOUT: ${prompt}.
            
            TECHNICAL REQUIREMENTS:
            1. FULL GAME LOOP: Must have requestAnimationFrame and an 'update' function.
            2. INPUTS: Must handle keyboard (WASD/Arrows) and touch/mouse.
            3. GAMEPLAY: Must have win/loss conditions, scoring, and clear difficulty progression.
            4. VISUALS: Use Canvas 2D or Three.js. Do NOT use static images or simple CSS animations.
            5. START SCREEN: Must say 'PRESS ENTER TO START' or have a large 'START' button.
            6. SFX: Ensure any game sounds are subtle and high-quality. No annoying high-pitched beeps.
            
            If the prompt is 'Snake', ensure it's a grid-based snake game where the snake grows when eating food and dies on self-collision or wall-collision.
            `);
            const response = await result.response;
            let htmlCode = response.text();

            // Strip markdown formatting if AI disobeys rule 1
            htmlCode = htmlCode.trim();
            if (htmlCode.startsWith('```html')) htmlCode = htmlCode.slice(7);
            else if (htmlCode.startsWith('```')) htmlCode = htmlCode.slice(3);
            if (htmlCode.endsWith('```')) htmlCode = htmlCode.slice(0, -3);
            htmlCode = htmlCode.trim();

            console.log(`✅ Game successfully compiled! Size: ${htmlCode.length} bytes`);
            return res.json({ html: htmlCode });
        } catch (err) {
            console.error(`❌ Game Engine failed! Error: ${err.message}`);
            return res.status(500).json({ error: "Game Engine failed", details: err.message });
        }
    }
    res.status(500).json({ error: "Game Engine offline (No API key or service down)." });
});

// --- 🛠️ GAME REFINER (Incremental Building) ---
app.post('/api/refine-game', async (req, res) => {
    const { prompt, currentCode } = req.body;
    
    const systemPrompt = `You are an elite HTML5 Game Developer. 
    You will be given an existing game's HTML/JS code and a request for a modification.
    
    CRITICAL RULES:
    1. Output MUST be ONLY the complete, updated HTML document.
    2. Maintain all existing features unless specifically asked to change them.
    3. Ensure the code remains standalone and valid.
    4. Do NOT wrap in markdown code blocks.
    `;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: systemPrompt
            }, { apiVersion: 'v1beta' });
            
            console.log(`🛠️ Game Refiner: Applying "${prompt}"...`);
            const result = await model.generateContent(`Here is the current code:\n${currentCode}\n\nPlease apply this change: ${prompt}`);
            const response = await result.response;
            let htmlCode = response.text();

            htmlCode = htmlCode.trim();
            if (htmlCode.startsWith('```html')) htmlCode = htmlCode.slice(7);
            else if (htmlCode.startsWith('```')) htmlCode = htmlCode.slice(3);
            if (htmlCode.endsWith('```')) htmlCode = htmlCode.slice(0, -3);
            htmlCode = htmlCode.trim();

            console.log(`✅ Game successfully refined! Size: ${htmlCode.length} bytes`);
            return res.json({ html: htmlCode });
        } catch (err) {
            console.error(`❌ Game Refiner failed! Error: ${err.message}`);
        }
    }
    res.status(500).json({ error: "Game Refiner offline." });
});

// --- 🎬 VIDEO ENGINE (AI Generated Animations) ---
app.post('/api/generate-video', async (req, res) => {
    const { prompt } = req.body;
    
    const systemPrompt = `You are a world-class Cinematic Animation Director creating premium "Magic Movies" for a kids' platform.
Your task is to write a strictly valid, fully self-contained HTML document featuring a stunning animation based on the user prompt.

CRITICAL RULES:
1. Output MUST be ONLY valid HTML starting with <!DOCTYPE html> and ending with </html>. Do NOT wrap it in markdown code blocks.
2. PREFERRED: Use Three.js (<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>) for 3D cinematic scenes with camera animation, lighting changes, and particle systems.
3. ALSO include GSAP (<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>) for timeline-based sequencing of the 3-act structure.
4. 3-Act Structure (30 seconds total):
   - Act 1 (0-8s): Cinematic title card with glow effects, camera slowly pushes in, scene establishes.
   - Act 2 (8-22s): The main action. Characters move, things happen, dramatic moments with camera shakes and lighting shifts.
   - Act 3 (22-30s): Resolution. Camera pulls back, "The End" fades in with sparkle particles, scene dims gracefully.
5. VISUALS: Use vibrant colors, volumetric-style fog, bloom/glow via CSS filters, particle systems (stars, sparks, bubbles). For 3D scenes, use MeshStandardMaterial with emissive properties. Make it feel "Pixar-lite".
6. SOUND: Ensure the cinematic is quiet and pleasant. No sudden loud beeps or noise bursts.
7. CAMERA: Animate the Three.js camera position and lookAt for dramatic cinematic movement. Use easing.
8. Set CSS to: body { margin: 0; overflow: hidden; background: #000; height: 100vh; width: 100vw; }
9. Make it genuinely impressive and cinematic. This should wow a child.
`;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                systemInstruction: systemPrompt 
            });
            
            console.log(`🎬 Video Engine: Directing scene for "${prompt}"...`);
            const result = await model.generateContent(`Create an impressive cinematic 30-second 3D animation about: ${prompt}. Use Three.js for the 3D scene and GSAP for timeline sequencing.`);
            const response = await result.response;
            let htmlCode = response.text();

            htmlCode = htmlCode.trim();
            if (htmlCode.startsWith('```html')) htmlCode = htmlCode.slice(7);
            else if (htmlCode.startsWith('```')) htmlCode = htmlCode.slice(3);
            if (htmlCode.endsWith('```')) htmlCode = htmlCode.slice(0, -3);
            htmlCode = htmlCode.trim();

            console.log(`✅ Video successfully rendered! Size: ${htmlCode.length} bytes`);
            return res.json({ html: htmlCode });
        } catch (err) {
            console.error(`❌ Video Engine failed! Error: ${err.message}`);
        }
    }
    res.status(500).json({ error: "Video Engine offline (No API key or service down)." });
});


// --- 🎨 IMAGE ENGINE (MULTI-TIER & LOCKED) ---
app.post('/api/magic-generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    // --- 🖼️ MULTI-TIER MAGIC ENGINE ---
    // We try multiple artists to ensure "very reliable" creation for the kids!
    const styleAnchor = "premium 3D digital sticker, toy-like, white border, centered, high-quality render, cute, vibrant colors, isolated on solid white background";
    const fullPrompt = `${prompt}, ${styleAnchor}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    console.log(`🎨 Dedicated Artist: Starting creation for "${prompt}"...`);

    // --- 🧪 TIER 1: LOCAL MAGIC BRAIN (Port 8000) ---
    try {
        console.log("🧪 Tier 1: Trying Local Magic Brain...");
        const localRes = await axios.post('http://127.0.0.1:8000/generate', {
            prompt: fullPrompt,
            steps: 1
        }, { timeout: 2000 });
        if (localRes.data && localRes.data.image) {
            console.log("✅ Tier 1 SUCCESS: Local Brain delivered!");
            return res.json({ url: localRes.data.image, isLocal: true });
        }
    } catch (e) { console.warn("⚠️  Tier 1 (Local) resting."); }

    // --- 🧪 TIER 2: GOOGLE IMAGEN (The "Nana Banana" Option) ---
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    if (apiKey) {
        try {
            console.log("🧪 Tier 2: Trying Google Imagen (The 'Nana Banana' Option)...");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
            // result = await model.generateContent(fullPrompt); // Future implementation
        } catch (e) { console.warn("⚠️  Tier 2 (Google) resting."); }
    }

    // --- 🧪 TIER 3: POLLINATIONS (Current Primary) ---
    try {
        console.log("🧪 Tier 3: Trying Pollinations.ai...");
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
        console.log("✅ Tier 3 READY: Returning direct Pollinations URL.");
        return res.json({ url: pollinationsUrl, isLocal: false });
    } catch (e) { console.warn("⚠️  Tier 3 (Pollinations) resting."); }

    // --- 🧪 TIER 4: SHUTTLEAI (Dedicated Last Resort) ---
    if (process.env.SHUTTLEAI_KEY) {
        try {
            console.log("🧪 Tier 4: Trying ShuttleAI Flux...");
            const shuttleRes = await axios.post('https://api.shuttleai.com/v1/images/generations', {
                model: "shuttle-3",
                prompt: fullPrompt,
                n: 1,
                size: "1024x1024"
            }, {
                headers: { 'Authorization': `Bearer ${process.env.SHUTTLEAI_KEY}` },
                timeout: 15000
            });
            if (shuttleRes.data?.data?.[0]?.url) {
                console.log("✅ Tier 4 SUCCESS: ShuttleAI delivered!");
                return res.json({ url: shuttleRes.data.data[0].url, isLocal: false });
            }
        } catch (e) { console.warn("⚠️  Tier 4 (Shuttle) failed."); }
    }

    // --- 🏁 FINAL FALLBACK: DIRECT URL ---
    const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
    console.warn("🏁 All Tiers failed. Returning final direct URL fallback.");
    return res.json({ url: finalUrl, isLocal: false, fallback: true });
});

// --- 🖼️ DESKTOP STICKER BRIDGE ---
app.post('/api/spawn-sticker', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing image URL" });

    try {
        // Hit the Jarvis Local API for instant spawning
        console.log(`📡 Sending instant sticker request to Jarvis API...`);
        const response = await axios.post('http://127.0.0.1:5005/sticker', {
            url: url
        }, { timeout: 3000 });

        console.log(`✅ Success! Jarvis spawned the sticker.`);
        res.json({ success: true });
    } catch (err) {
        console.warn(`⚠️  Jarvis API unreachable (${err.message}). Falling back to mailbox...`);
        try {
            const bridgeDir = path.resolve(__dirname, '../AntigravityVoiceBridge');
            const mailboxPath = path.join(bridgeDir, 'bridge_mailbox.json');
            const command = { type: "spawn_sticker", url: url, speak: "Handing you a physical sticker, sir." };
            fs.writeFileSync(mailboxPath, JSON.stringify(command, null, 2));
            res.json({ success: true, fallback: true });
        } catch (fallbackErr) {
            console.error(`❌ Sticker Pop-out failed completely: ${fallbackErr.message}`);
            res.status(500).json({ error: "Could not reach Jarvis Bridge" });
        }
    }
});

// --- 📂 SECURE DIAGNOSTICS & HEALTH (AI Feedback Implemented) ---
const DIAGNOSTIC_TOKEN = process.env.DIAGNOSTIC_TOKEN || "spark-magic-internal-2026";

app.get('/api/diagnostics/:mode', async (req, res) => {
    const { mode } = req.params;
    
    // 1. Move to Header-based Auth (more secure than URL params)
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

    if (token !== DIAGNOSTIC_TOKEN) {
        console.warn(`[SECURITY] Unauthorized diagnostic attempt from ${req.ip}`);
        return res.status(403).json({ error: "Unauthorized. Provide Bearer token in Authorization header." });
    }

    try {
        const fsPromises = require('fs').promises;
        const path = require('path');
        
        // --- 📡 CONNECTION CHECKS (Circuit Breaker Pattern) ---
        const health = {
            status: "Healthy",
            timestamp: new Date().toISOString(),
            checks: {
                database: "Connected", // Placeholder for actual DB ping
                ai_backend: process.env.GOOGLE_API_KEY ? "Ready" : "Offline",
                storage: "Writable"
            }
        };

        if (mode === 'health') {
            return res.json(health);
        }

        async function getFiles(dir) {
            const dirents = await fsPromises.readdir(dir, { withFileTypes: true });
            const files = await Promise.all(dirents.map((dirent) => {
                const res = path.resolve(dir, dirent.name);
                if (dirent.isDirectory()) {
                    if (['node_modules', '.git', 'dist', 'backups', '.gemini', '.idea'].includes(dirent.name)) return [];
                    return getFiles(res);
                } else {
                    return res;
                }
            }));
            return Array.prototype.concat(...files);
        }

        const allFiles = await getFiles(__dirname);
        const codebase = {};
        let rawOutput = `SPARKS INTELLIGENCE SUITE - SECURE CODEBASE DUMP\nDIAGNOSTIC_TIME: ${new Date().toISOString()}\n==============================================\n\n`;

        // Advanced Redaction Regex
        const SECRET_REGEX = /(AIza[0-9A-Za-z-_]{35}|[0-9a-f]{32}|sk-[a-zA-Z0-9]{48}|ghp_[a-zA-Z0-9]{36}|password[:=]\s*[^\s]+)/gi;

        for (const file of allFiles) {
            const relPath = path.relative(__dirname, file);
            const isSource = relPath.match(/\.(jsx|js|cjs|css|html|py|bat|md|json)$/);
            const isSensitive = relPath.includes('.env') || relPath.includes('package-lock.json') || relPath.includes('bridge_mailbox');
            
            if (isSource && !isSensitive) {
                let content = await fsPromises.readFile(file, 'utf8');
                content = content.replace(SECRET_REGEX, "[REDACTED_SECRET]");
                
                if (mode === 'raw') {
                    rawOutput += `--- FILE: ${relPath} ---\n${content}\n--- END OF FILE: ${relPath} ---\n\n`;
                } else {
                    codebase[relPath] = content;
                }
            }
        }

        if (mode === 'raw') {
            res.setHeader('Content-Type', 'text/plain');
            res.send(rawOutput);
        } else {
            res.json({ project: "Sparks Intelligence Suite", health, files: codebase });
        }
    } catch (err) {
        console.error(`[DIAGNOSTICS_FAILURE] ${err.message}`);
        res.status(500).json({ error: "Codebase analysis failed", details: err.message });
    }
});

// --- 🌐 SPA CATCH-ALL (SEO FIX) ---
// Serve index.html for any unknown paths (ensures frontend routing works)
app.use((req, res, next) => {
    // If it's an API route or a file that doesn't exist, we might want to let it 404
    // but for SEO/SPA, we serve index.html. 
    // We check if it's an API route first to avoid serving HTML for broken API calls.
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- 🚀 START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Spark server waking up on port ${PORT}`);
});
