import React, { useState, useRef } from "react";
import "../index.css";

const initialObjects = [
  { id: 1, type: "player", x: 100, y: 100, label: "Player" },
  { id: 2, type: "enemy", x: 300, y: 150, label: "Enemy" },
];

export default function GameMaker() {
  const [objects, setObjects] = useState(() => {
    const saved = localStorage.getItem('game_maker_objects');
    return saved ? JSON.parse(saved) : initialObjects;
  });
  const [draggedId, setDraggedId] = useState(null);
  const canvasRef = useRef(null);

  const handleDragStart = (id) => setDraggedId(id);
  const handleDragEnd = () => setDraggedId(null);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setObjects([
      ...objects,
      {
        id: Date.now(),
        type: "item",
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        label: "Item",
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (draggedId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      setObjects((objs) =>
        objs.map((obj) =>
          obj.id === draggedId
            ? {
                ...obj,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              }
            : obj
        )
      );
    }
  };

  // Save objects to localStorage
  const handleSave = () => {
    localStorage.setItem('game_maker_objects', JSON.stringify(objects));
    alert('Game saved!');
  };

  // Load objects from localStorage
  const handleLoad = () => {
    const saved = localStorage.getItem('game_maker_objects');
    if (saved) {
      setObjects(JSON.parse(saved));
      alert('Game loaded!');
    } else {
      alert('No saved game found.');
    }
  };

  // Clear objects
  const handleClear = () => {
    setObjects([]);
  };

  return (
    <div>
      <h2>Game Maker (Drag & Drop Demo)</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
        <button onClick={handleSave}>💾 Save</button>
        <button onClick={handleLoad}>📂 Load</button>
        <button onClick={handleClear}>🗑️ Clear</button>
      </div>
      <div
        ref={canvasRef}
        style={{
          width: 600,
          height: 400,
          border: "2px solid #888",
          position: "relative",
          margin: "auto",
          background: "#f9f9f9",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onClick={handleCanvasClick}
      >
        {objects.map((obj) => (
          <div
            key={obj.id}
            style={{
              position: "absolute",
              left: obj.x,
              top: obj.y,
              width: 60,
              height: 60,
              background: obj.type === "player" ? "#4caf50" : obj.type === "enemy" ? "#f44336" : "#2196f3",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              cursor: "grab",
              userSelect: "none",
              fontWeight: "bold",
              boxShadow: draggedId === obj.id ? "0 0 10px #000" : "none",
              zIndex: draggedId === obj.id ? 2 : 1,
            }}
            onMouseDown={() => handleDragStart(obj.id)}
            onMouseUp={handleDragEnd}
          >
            {obj.label}
          </div>
        ))}
      </div>
      <p style={{textAlign: "center"}}>Drag objects or click canvas to add items. Use Save/Load to persist your game.</p>
    </div>
  );
}
