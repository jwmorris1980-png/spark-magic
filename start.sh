#!/bin/sh

# Start the AI Guardian Drone in the background
echo "[Drone] Launching AI Repair Bot..."
node guardian.cjs &

# Start the main Spark server
echo "[Server] Launching Spark Magic..."
node server.cjs
