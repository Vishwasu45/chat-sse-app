# React Frontend - Chat Application

This is the React frontend for the Chat SSE application.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Run Development Server
```bash
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

Creates optimized production build in the `build/` folder.

---

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ChatInterface.js  # Main chat UI (container component)
│   ├── ChatInterface.css
│   ├── Message.js        # Message display (presentational)
│   └── Message.css
├── services/             # API communication
│   └── chatService.js    # Backend API calls (SSE)
├── utils/                # Helper functions
│   └── markdownParser.js # Markdown to HTML converter
├── App.js                # Root component
├── App.css
├── index.js              # React entry point
└── index.css             # Global styles
```

---

## 🔧 Key Technologies

- **React 18** - UI library
- **EventSource API** - Server-Sent Events for streaming
- **PropTypes** - Runtime type checking
- **CSS3** - Styling

---

## 📡 API Communication

### Backend Endpoint
```
GET http://localhost:8080/chat?message=<user_message>
```

### Proxy Configuration
The `package.json` includes a proxy to forward API requests:
```json
"proxy": "http://localhost:8080"
```

This means:
- `/chat` → `http://localhost:8080/chat`
- Avoids CORS issues during development

---

## 🎨 Components

### ChatInterface
**Location:** `src/components/ChatInterface.js`  
**Type:** Container component (smart)  
**Purpose:** Manages chat state and user interactions

**State:**
- `messages` - Array of message objects
- `inputValue` - Current input text
- `isSending` - Loading state

**Key Functions:**
- `handleSendMessage()` - Send user message to backend
- `handleKeyPress()` - Handle Enter key

### Message
**Location:** `src/components/Message.js`  
**Type:** Presentational component (dumb)  
**Purpose:** Display a single message

**Props:**
- `text` (string) - Message content
- `isUser` (boolean) - User or bot message
- `isStreaming` (boolean) - Currently streaming

---

## 🔌 Service Layer

### chatService.js
**Location:** `src/services/chatService.js`

Handles all backend communication using Server-Sent Events (SSE).

**Function:**
```javascript
streamChat(message, onMessage, onComplete, onError)
```

**Parameters:**
- `message` - User's message to send
- `onMessage` - Callback for each chunk received
- `onComplete` - Callback when stream completes
- `onError` - Callback for errors

**Usage:**
```javascript
import { chatService } from '../services/chatService';

chatService.streamChat(
  'Hello',
  (chunk) => console.log('Received:', chunk),
  () => console.log('Complete'),
  (error) => console.error('Error:', error)
);
```

---

## 🎯 React Hooks Used

### useState
Manages component state:
```javascript
const [messages, setMessages] = useState([]);
```

### useEffect
Handles side effects (auto-scroll):
```javascript
useEffect(() => {
  // Scroll to bottom when messages change
  chatContainerRef.current.scrollTop = 
    chatContainerRef.current.scrollHeight;
}, [messages]);
```

### useRef
References DOM elements:
```javascript
const chatContainerRef = useRef(null);
// Access: chatContainerRef.current
```

---

## 🎨 Styling

### CSS Organization
Each component has its own CSS file:
- `ChatInterface.css` - Chat layout and input
- `Message.css` - Message bubbles and formatting

### Theme
Dark theme with purple accent color:
- Background: `#121212`
- Chat background: `#1e1e1e`
- Primary color: `#bb86fc`
- User message: `#3700b3`
- Bot message: `#2c2c2c`

---

## 📝 Markdown Support

Messages support markdown formatting:
- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- Code blocks: ` ```code``` `
- Numbered lists: `1. Item`
- Bullet lists: `- Item`

---

## 🔍 Development Tips

### Hot Reloading
Changes to files automatically refresh the browser.

### Browser Console
Press F12 to see console logs and errors.

### React DevTools
Install [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension.

### Debugging State
Add console logs to see state changes:
```javascript
useEffect(() => {
  console.log('Messages updated:', messages);
}, [messages]);
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Backend Connection Issues
1. Make sure backend is running on port 8080
2. Check proxy configuration in `package.json`
3. Look for CORS errors in browser console

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Build Fails
```bash
npm run build
# Check for errors in the output
```

---

## 📚 Learn More

### React Documentation
- [React Docs](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)
- [Thinking in React](https://react.dev/learn/thinking-in-react)

### Project Documentation
- **Main README**: `../README.md`
- **React Guide**: `../REACT_LEARNING_GUIDE.md`
- **Complete Summary**: `../SUMMARY.md`

---

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Serve with Spring Boot
1. Build React app: `npm run build`
2. Copy `build/` contents to `../src/main/resources/static/`
3. Run Spring Boot: `../gradlew bootRun`
4. Access at: `http://localhost:8080`

### Environment Variables
Create `.env` file for environment-specific config:
```
REACT_APP_API_URL=http://your-backend-url
```

Access in code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 📦 Available Scripts

### `npm start`
Runs development server with hot reload.

### `npm run build`
Creates production build.

### `npm test`
Launches test runner (if tests are added).

### `npm run eject`
⚠️ **One-way operation** - exposes webpack config.

---

## ✨ Features

- ✅ Real-time streaming responses
- ✅ Markdown formatting
- ✅ Auto-scrolling
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Dark theme

---

## 🔗 Related Files

- Backend: `../src/main/java/com/example/chatsse/`
- Scripts: `../start.sh`, `../stop.sh`
- Docs: `../README.md`, `../REACT_LEARNING_GUIDE.md`

---

**Happy React Development! 🚀**

