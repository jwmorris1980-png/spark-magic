import { useState } from 'react';
import axios from 'axios';

export const useSparkGame = (setSandboxItems, setMode, speakNav) => {
  const [savedGames, setSavedGames] = useState([]);
  const [currentGameCode, setCurrentGameCode] = useState(null);
  const [isGeneratingGame, setIsGeneratingGame] = useState(false);

  const generateMagicGame = async (prompt) => {
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) return;
    
    setIsGeneratingGame(true);
    speakNav(`Magic Game Engine activated! Building your game. Please wait just a moment.`);
    
    try {
      const response = await axios.post('/api/generate-game', { prompt: prompt.trim() });
      if (response.data && response.data.html) {
        const gameItem = {
          id: Date.now(),
          type: 'game',
          title: prompt.trim(),
          html: response.data.html,
          x: 10, y: 10
        };
        setSandboxItems(prev => [...prev, gameItem]);
        speakNav("Magic Game Complete! I have placed it in your sandbox. Click play to start!");
        setMode('sandbox');
        
        // Auto-save to list
        setSavedGames(prev => [...prev, gameItem]);
      }
    } catch (err) {
      console.error("Game Generation Failed:", err);
      const details = err.response?.data?.details || err.response?.data?.error || err.message || "Unknown Magic Error";
      speakNav(`Oh no! The Game Engine had a little glitch: ${details}. Let's try that again!`);
    } finally {
      setIsGeneratingGame(false);
    }
  };

  const handleRefineGame = async (prompt) => {
    // We pass setIsBuilding through if needed, or manage it internally
    console.log("Refining world with prompt:", prompt);
    try {
      const response = await axios.post('/api/refine-game', { prompt, currentCode: currentGameCode });
      if (response.data && response.data.html) {
        setCurrentGameCode(response.data.html);
      }
    } catch(e) { 
      console.error("Refine Failed:", e); 
    }
  };

  return {
    savedGames,
    setSavedGames,
    currentGameCode,
    setCurrentGameCode,
    isGeneratingGame,
    generateMagicGame,
    handleRefineGame
  };
};
