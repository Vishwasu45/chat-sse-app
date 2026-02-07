#!/bin/bash

# Startup script for Chat SSE Application
# This script starts both the Spring Boot backend and React frontend

echo "🚀 Starting Chat SSE Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Ollama is running (required for the chat to work)
echo "Checking if Ollama is running..."
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚠️  Warning: Ollama doesn't seem to be running on localhost:11434"
    echo "Please start Ollama first with: ollama serve"
    echo ""
fi

# Start Spring Boot Backend
echo "${BLUE}Starting Spring Boot backend on port 8080...${NC}"
cd "$(dirname "$0")"
./gradlew bootRun > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Check if backend is running
if lsof -i :8080 > /dev/null; then
    echo "${GREEN}✓ Backend started successfully${NC}"
else
    echo "❌ Backend failed to start. Check logs/backend.log for details"
    exit 1
fi

# Start React Frontend
echo "${BLUE}Starting React frontend on port 3000...${NC}"
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "${GREEN}✓ Application started successfully!${NC}"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Backend API at: http://localhost:8080"
echo ""
echo "To stop the application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or save PIDs to file for later:"
echo "$BACKEND_PID $FRONTEND_PID" > .pids
echo "PIDs saved to .pids file"

