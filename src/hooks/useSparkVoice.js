import { useState, useRef, useEffect } from 'react';

export const useSparkVoice = ({ 
  isBuddyMode, 
  isSpeaking, 
  isAudioUnlocked, 
  unlockAudio, 
  handleSend, 
  processVoiceCommand, 
  playCommandPing, 
  speakNav 
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const startingMicRef = useRef(null);
  const lastStopRef = useRef(0);

  // --- 🛡️ STALE CLOSURE PROTECTION ---
  // We use refs for all callbacks to ensure the 'onresult' handler always uses the latest state/logic
  const callbacks = useRef({ handleSend, processVoiceCommand, playCommandPing, speakNav, unlockAudio });
  useEffect(() => {
    callbacks.current = { handleSend, processVoiceCommand, playCommandPing, speakNav, unlockAudio };
  }, [handleSend, processVoiceCommand, playCommandPing, speakNav, unlockAudio]);

  const isBuddyModeRef = useRef(isBuddyMode);
  useEffect(() => {
    isBuddyModeRef.current = isBuddyMode;
  }, [isBuddyMode]);

  const startListening = () => {
    // ... same as before, but onresult uses isBuddyModeRef.current ...
    // Prevent double-start
    if (recognitionRef.current || startingMicRef.current) return;
    
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn("🎙️ Voice not supported in this browser.");
      return;
    }
    
    startingMicRef.current = true;
    
    // Watchdog: If mic fails to start in 2s, release the lock
    const startWatchdog = setTimeout(() => {
      if (startingMicRef.current) {
        console.warn("🎙️ Mic timeout. Resetting...");
        startingMicRef.current = false;
      }
    }, 2000);

    try {
      const r = new SR();
      r.lang = 'en-US';
      r.continuous = false;
      r.interimResults = false;
      recognitionRef.current = r;

      r.onstart = () => {
        clearTimeout(startWatchdog);
        setIsListening(true);
        startingMicRef.current = false;
      };

      r.onresult = (e) => {
        const result = e.results[0][0];
        const transcript = result.transcript.toLowerCase();
        const confidence = result.confidence;
        
        if (!isAudioUnlocked) callbacks.current.unlockAudio();

        const wakeWords = ['spark', 'buddy mode', 'wake up', 'conversation', 'hello spark', 'hey spark'];
        const isWakeRequest = wakeWords.some(w => transcript.includes(w));
        const keywords = ['game', 'picture', 'movie', 'stop', 'pause', 'magic', 'school', 'video', 'shut up', 'goodbye', 'news', 'blog', 'safety', 'pricing', 'launch', 'start'];
        const hasKeyword = keywords.some(k => transcript.includes(k));
        const isStopCommand = transcript.includes('stop') || transcript.includes('pause') || transcript.includes('shut up');

        console.log(`🎙️ Mic Heard: "${transcript}" (Confidence: ${(confidence * 100).toFixed(1)}%)`);

        // --- 🛡️ INTERRUPT PROTECTION ---
        // If Spark is speaking, we ONLY allow stop/pause commands through
        if (isSpeaking && !isStopCommand) {
          console.log("🤫 Ignored: Spark is speaking and this wasn't a stop command.");
          return;
        }

        if (isBuddyModeRef.current) {
          // Normal Active Listening
          if (confidence > 0.7 || hasKeyword || isWakeRequest) {
            const cmd = callbacks.current.processVoiceCommand(transcript);
            if (!cmd.wasCommand) callbacks.current.handleSend(transcript);
          }
        } else {
          // Magic Hibernation: Only respond to wake words
          if (isWakeRequest) {
            console.log("🪄 [WAKE UP]: Wake word detected during hibernation!");
            callbacks.current.processVoiceCommand(transcript); 
          } else {
            console.log("💤 [HIBERNATION]: Ignored input until wake sequence is detected.");
          }
        }
      };

      r.onerror = (e) => {
        console.warn("🎙️ Mic Error:", e.error);
        setIsListening(false);
        startingMicRef.current = false;
        
        if (e.error === 'aborted' || e.error === 'not-allowed' || e.error === 'no-speech') {
          lastStopRef.current = Date.now(); // Cooldown on these errors
        }
      };

      r.onend = () => {
        startingMicRef.current = false;
        recognitionRef.current = null;
        setIsListening(false);
        
        const now = Date.now();
        const cooldown = (now - lastStopRef.current) < 5000;
        
        // --- 🪄 MAGIC EAR (Always peeking if unlocked) ---
        if (isAudioUnlocked && !isSpeaking && !cooldown) {
          setTimeout(() => startListening(), 2000);
        }
      };

      r.start();
    } catch (err) {
      console.error("🎙️ Mic Start Crash:", err);
      startingMicRef.current = false;
      setIsListening(false);
    }
  };

  const stopListening = () => {
    lastStopRef.current = Date.now();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const prevBuddyModeRef = useRef(isBuddyMode);

  // --- 💓 MIC HEARTBEAT & WAKE WORD ---
  useEffect(() => {
    // If user manually toggled Buddy Mode ON, bypass the cooldown
    const wasToggledOn = isBuddyMode && !prevBuddyModeRef.current;
    if (wasToggledOn) {
      lastStopRef.current = 0; 
      console.log("🔓 Manual Buddy Mode activation: Bypassing cooldown.");
    }
    prevBuddyModeRef.current = isBuddyMode;

    // --- 🤫 SILENCE DURING SPEECH ---
    if (isSpeaking && isListening) {
      console.log("🤫 Spark is speaking. Pausing mic to prevent feedback.");
      stopListening();
    }

    // Immediate activation when Buddy Mode is toggled on or if idle
    if (isBuddyMode && !isListening && !startingMicRef.current && !isSpeaking) {
      const cooldownActive = (Date.now() - lastStopRef.current) < 4000;
      if (!cooldownActive) startListening();
    }

    const intervalTime = 5000;
    const interval = setInterval(() => {
      const cooldownActive = (Date.now() - lastStopRef.current) < 3000;
      // Always try to keep the ear open if unlocked, even if Buddy Mode is off
      if (!isListening && !startingMicRef.current && isAudioUnlocked && !isSpeaking && !cooldownActive) {
        startListening();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isBuddyMode, isListening, isSpeaking, isAudioUnlocked]);

  return { isListening, startListening, stopListening, recognitionRef };
};
