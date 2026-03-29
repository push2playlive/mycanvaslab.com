#!/bin/bash
# V12 DEPLOYMENT SCRIPT: The Hetzner Core Update
echo "[System]: Initiating V12 Core Update..."

cd /root/diamond-app
git pull origin main

echo "[System]: Installing Neural Dependencies..."
npm install

echo "[System]: Rebuilding The Architect's Bridge..."
npm run build

echo "[System]: Restarting V12 Engine..."
# Using PM2 to ensure the engine never stalls
pm2 restart v12-engine || pm2 start "tsx server.ts" --name v12-engine

echo "[System]: V12 CORE UPDATE COMPLETE. Status: NOBLE_STABLE."
