#!/bin/bash

# Verification script for Chat SSE Application setup

echo "🔍 Verifying Chat SSE Application Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check Java
echo -n "Checking Java... "
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')
    echo -e "${GREEN}✓${NC} Found Java $JAVA_VERSION"
else
    echo -e "${RED}✗${NC} Java not found"
    ERRORS=$((ERRORS + 1))
fi

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found Node.js $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found npm $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    ERRORS=$((ERRORS + 1))
fi

# Check Ollama
echo -n "Checking Ollama... "
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Ollama is running"
else
    echo -e "${YELLOW}⚠${NC}  Ollama not responding (optional for testing)"
fi

echo ""
echo "📁 Checking project files..."

# Check Backend files
echo -n "Backend files... "
if [ -f "src/main/java/com/example/chatsse/ChatApplication.java" ] && \
   [ -f "src/main/java/com/example/chatsse/ChatController.java" ] && \
   [ -f "src/main/java/com/example/chatsse/ChatService.java" ] && \
   [ -f "src/main/java/com/example/chatsse/WebConfig.java" ]; then
    echo -e "${GREEN}✓${NC} All backend files present"
else
    echo -e "${RED}✗${NC} Some backend files missing"
    ERRORS=$((ERRORS + 1))
fi

# Check Frontend files
echo -n "Frontend files... "
if [ -f "frontend/src/App.js" ] && \
   [ -f "frontend/src/components/ChatInterface.js" ] && \
   [ -f "frontend/src/components/Message.js" ] && \
   [ -f "frontend/src/services/chatService.js" ] && \
   [ -f "frontend/src/utils/markdownParser.js" ]; then
    echo -e "${GREEN}✓${NC} All frontend files present"
else
    echo -e "${RED}✗${NC} Some frontend files missing"
    ERRORS=$((ERRORS + 1))
fi

# Check node_modules
echo -n "Frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Run: cd frontend && npm install"
fi

# Check documentation
echo -n "Documentation files... "
if [ -f "README.md" ] && \
   [ -f "QUICKSTART.md" ] && \
   [ -f "REACT_LEARNING_GUIDE.md" ] && \
   [ -f "SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} All documentation present"
else
    echo -e "${YELLOW}⚠${NC}  Some documentation missing"
fi

echo ""
echo "🚀 Checking if application is running..."

# Check if ports are in use
echo -n "Backend (port 8080)... "
if lsof -i :8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running"
else
    echo -e "${YELLOW}⚠${NC}  Not running"
fi

echo -n "Frontend (port 3000)... "
if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running"
else
    echo -e "${YELLOW}⚠${NC}  Not running"
fi

echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Setup verification complete!${NC}"
    echo ""
    echo "To start the application:"
    echo "  ./start.sh"
    echo ""
    echo "Or manually:"
    echo "  Terminal 1: ./gradlew bootRun"
    echo "  Terminal 2: cd frontend && npm start"
else
    echo -e "${RED}✗ Setup has $ERRORS error(s)${NC}"
    echo "Please fix the errors above before running the application."
fi
echo "================================"

