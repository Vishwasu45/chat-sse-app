#!/bin/bash

# Stop script for Chat SSE Application

echo "🛑 Stopping Chat SSE Application..."

# Read PIDs from file if exists
if [ -f .pids ]; then
    read -r BACKEND_PID FRONTEND_PID < .pids
    echo "Killing backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    echo "Killing frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm .pids
fi

# Kill any processes on ports 8080 and 3000
echo "Cleaning up processes on ports 8080 and 3000..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✓ Application stopped"

