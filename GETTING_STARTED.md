# 🚀 Getting Started - Your First Steps

Welcome! This guide will help you get the Chat SSE application up and running.

## 📋 What You're About to Run

You're setting up a **full-stack chat application**:
- **Frontend**: Modern React app (runs in your browser)
- **Backend**: Spring Boot API (runs on your computer)
- **AI**: Ollama (local AI model)

All three need to work together!

---

## ⚡ Quick Start (5 minutes)

### Step 1: Check Prerequisites

Open a terminal and run these commands:

```bash
# Check Java (need version 17+)
java -version

# Check Node.js
node -v

# Check npm
npm -v
```

✅ **All working?** Continue to Step 2!  
❌ **Something missing?** See "Installing Prerequisites" below.

### Step 2: Install Frontend Dependencies

```bash
cd /Users/umashav1/Study/chat-sse-app/frontend
npm install --legacy-peer-deps
cd ..
```

This downloads all the React libraries needed (takes 1-2 minutes).

### Step 3: Start Ollama

Ollama must be running for the chat to work.

**Option A: If Ollama is already installed:**
```bash
ollama serve
```

**Option B: Check if it's already running:**
```bash
curl http://localhost:11434/api/tags
```

If you see model names, you're good! If not, start ollama.

### Step 4: Start the Application

**The Easy Way:**
```bash
./start.sh
```

**Or Manually (if script doesn't work):**

**Terminal 1** - Start Backend:
```bash
./gradlew bootRun
```
Wait for: `Started ChatApplication in X seconds`

**Terminal 2** - Start Frontend:
```bash
cd frontend
npm start
```

### Step 5: Open in Browser

The browser should open automatically to:
**http://localhost:3000**

If not, open it manually!

---

## 🎉 Testing Your Chat

Try asking:
- "Hello, how are you?"
- "Write a list of 5 programming languages"
- "Explain React in simple terms"

You should see:
✅ Streaming responses (text appears word-by-word)  
✅ Proper formatting (lists, bold text, etc.)  
✅ Smooth UI with dark theme  

---

## 🛑 Stopping the Application

**If you used the start script:**
```bash
./stop.sh
```

**If you started manually:**
Press `Ctrl+C` in each terminal window.

---

## 🔧 Installing Prerequisites

### Installing Java 17+

**macOS:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

**Windows:**
Download from: https://adoptium.net/

### Installing Node.js and npm

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from: https://nodejs.org/

### Installing Ollama

Visit: https://ollama.com/download

After installing, download a model:
```bash
ollama pull llama3
```

---

## 🐛 Common Problems

### "Port 8080 already in use"

Something else is using port 8080. Kill it:
```bash
lsof -ti:8080 | xargs kill -9
```

### "Port 3000 already in use"

```bash
lsof -ti:3000 | xargs kill -9
```

### Backend won't start

1. Make sure Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. Check the logs:
   ```bash
   tail -f logs/backend.log
   ```

3. Rebuild:
   ```bash
   ./gradlew clean build
   ./gradlew bootRun
   ```

### Frontend shows errors

1. Delete and reinstall:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   npm start
   ```

### Chat not responding

1. Check both servers are running:
   ```bash
   # Should show Java process
   lsof -i :8080
   
   # Should show Node process
   lsof -i :3000
   ```

2. Check browser console (press F12) for errors

3. Make sure Ollama has a model:
   ```bash
   ollama list
   ```

### CORS errors in browser

- Make sure BOTH backend and frontend are running
- The React app should automatically proxy to backend
- Check `frontend/package.json` has: `"proxy": "http://localhost:8080"`

---

## 📚 What's Next?

### Learn the Code

1. **Read REACT_LEARNING_GUIDE.md** - Understand React concepts
2. **Read SUMMARY.md** - See the complete architecture
3. **Modify the code** - Best way to learn!

### Try These Modifications

**Easy:**
- Change colors in CSS files
- Modify welcome message
- Change "Send" button text

**Medium:**
- Add a timestamp to each message
- Add a "Clear chat" button
- Change the theme colors

**Advanced:**
- Add message history (save to localStorage)
- Add a typing indicator
- Add user avatars
- Support file uploads

---

## 🎯 Project Structure Quick Reference

```
chat-sse-app/
├── src/main/java/              # Backend (Spring Boot)
│   └── com/example/chatsse/
│       ├── ChatApplication.java    # Main app
│       ├── ChatController.java     # API endpoints
│       ├── ChatService.java        # Business logic
│       └── WebConfig.java          # CORS config
│
├── frontend/                    # Frontend (React)
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API calls
│   │   └── utils/              # Helper functions
│   └── package.json            # Dependencies
│
├── start.sh                    # Start both servers
├── stop.sh                     # Stop both servers
├── verify-setup.sh             # Check setup
│
└── Documentation:
    ├── README.md               # Main docs
    ├── QUICKSTART.md           # Quick reference
    ├── REACT_LEARNING_GUIDE.md # Learn React
    └── SUMMARY.md              # Complete overview
```

---

## ✅ Checklist

Before asking for help, check:

- [ ] Java 17+ installed (`java -version`)
- [ ] Node.js installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Ollama running (`curl http://localhost:11434/api/tags`)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Backend starts without errors (`./gradlew bootRun`)
- [ ] Frontend starts without errors (`cd frontend && npm start`)
- [ ] Both ports free (8080 and 3000)
- [ ] Browser opens to http://localhost:3000
- [ ] No CORS errors in browser console (F12)

---

## 🆘 Need Help?

1. **Run the verification script:**
   ```bash
   ./verify-setup.sh
   ```

2. **Check the logs:**
   ```bash
   tail -f logs/backend.log
   tail -f logs/frontend.log
   ```

3. **Check browser console:**
   Press F12 in your browser and look at the Console tab

4. **Read the docs:**
   - QUICKSTART.md - Quick reference
   - README.md - Detailed info
   - REACT_LEARNING_GUIDE.md - Learn React

---

## 🎊 Success!

If you see the chat interface and can send messages, **congratulations!** 🎉

You now have a working full-stack application with:
- ✅ Modern React frontend
- ✅ Spring Boot backend
- ✅ Real-time streaming
- ✅ AI integration

**Now start learning and experimenting!** 🚀

