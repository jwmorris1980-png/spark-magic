import { useState } from 'react';
import axios from 'axios';

export const useSparkImage = (setSandboxItems) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const makeFallbackUrl = (prompt) => {
    const styleAnchor = 'premium 3D digital sticker, toy-like, white border, centered, high-quality render, cute, vibrant colors, isolated on solid white background';
    const encodedPrompt = encodeURIComponent(`${prompt}, ${styleAnchor}`);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
  };

  const generateMagicImage = async (prompt) => {
    if (!prompt) return;
    
    const tempId = Date.now();
    setSandboxItems(prev => [...prev, { 
      type: 'image', 
      id: tempId, 
      x: 30 + (Math.random() * 40), 
      y: 30 + (Math.random() * 40), 
      url: '', 
      label: prompt,
      isLoading: true 
    }]);

    setIsGeneratingImage(true);
    try {
      const res = await axios.post('/api/magic-generate', { prompt, style: '3d sticker' });
      const imageUrl = res.data?.url || makeFallbackUrl(prompt);
      if (imageUrl) {
        setSandboxItems(prev => prev.map(item => 
          item.id === tempId ? { ...item, url: imageUrl, style: res.data?.fallback ? 'cloud fallback' : '3d sticker', isLoading: false } : item
        ));
      }
    } catch (err) {
      console.error("Magic Image Failed:", err);
      const fallbackUrl = makeFallbackUrl(prompt);
      setSandboxItems(prev => prev.map(item => 
        item.id === tempId ? { ...item, url: fallbackUrl, style: 'cloud fallback', isLoading: false } : item
      ));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    generateMagicImage
  };
};
