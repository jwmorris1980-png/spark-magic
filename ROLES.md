# ✨ SPARK MAGIC - ARCHITECTURE MAP (v1.7.2-RESTORED)

This file is the "Source of Truth" for Spark's modular brain. Update this file BEFORE moving or changing any core logic.

## 🧠 CORE ORCHESTRATOR
- **`src/App.jsx`**: The "Command Center". It connects all hooks and manages the main UI state (Sandbox, Credits, Views).

## 👂 THE EARS (Voice & Microphone)
- **`src/hooks/useSparkVoice.js`**: 
  - Handles `SpeechRecognition`.
  - Filters for confidence > 90%.
  - Manages the "Mic Peace Treaty" backoff.
  - isolated from all other logic.

## 🎮 THE BUILDER (Game Engine)
- **`src/hooks/useSparkGame.js`**: 
  - Handles Game Generation and Refinement.
  - Manages `savedGames` and `currentGameCode`.
  - Isolated: Communicates with `App.jsx` only through provided setters.

## 🎨 THE ARTIST (Image Engine)
- **`src/hooks/useSparkImage.js`**: 
  - Handles 3D Sticker generation.
  - Manages sandbox item lifecycle for images.

## 🎬 THE STUDIO (Video Engine)
- **`src/hooks/useSparkVideo.js`**: 
  - Dedicated home for video generation logic (Placeholder for future magic).

## 🖥️ BACKEND (Server Logic)
- **`server.cjs`**: 
  - Handles all API requests (Chat, Games, Images, TTS).
  - Brain-Locked to dedicated Gemini models.
- **`guardian.cjs`**: Health monitor and auto-repair bot for the server.

---
**RULE:** Never use absolute file paths. Use relative paths (e.g., `./hooks/...`) to ensure portability.
