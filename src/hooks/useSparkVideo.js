import { useState } from 'react';
import axios from 'axios';

export const useSparkVideo = (setSandboxItems, speakNav) => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [currentVideoCode, setCurrentVideoCode] = useState(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const generateMagicVideo = async (prompt) => {
    if (!prompt || !prompt.trim()) return;

    setIsGeneratingVideo(true);
    speakNav("Magic Video Studio activated! Dreaming up your movie. This takes a little longer because magic is hard!");

    try {
      // Future Endpoint: /api/generate-video
      const response = await axios.post('/api/magic-generate', { prompt, style: 'cinematic video' });
      
      if (response.data && response.data.url) {
        const videoItem = {
          id: Date.now(),
          type: 'video',
          title: prompt.trim(),
          url: response.data.url,
          x: 20, y: 20
        };
        setSandboxItems(prev => [...prev, videoItem]);
        setSavedVideos(prev => [...prev, videoItem]);
        speakNav("Magic Movie Complete! I have placed it in your sandbox. Watch and enjoy!");
      }
    } catch (err) {
      console.error("Video Generation Failed:", err);
      speakNav("Oops! The Video Studio is taking a nap. Let's try again in a bit!");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return {
    savedVideos,
    setSavedVideos,
    currentVideoCode,
    setCurrentVideoCode,
    isGeneratingVideo,
    generateMagicVideo
  };
};
