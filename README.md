# Chat SSE App - Spring Boot + React

This application demonstrates a real-world architecture with:
- **Backend**: Spring Boot (Java) with Server-Sent Events (SSE)
- **Frontend**: React (JavaScript) with modern component architecture

## Architecture Overview

### Backend (Spring Boot)
```
src/main/java/com/example/chatsse/
├── ChatApplication.java    # Main Spring Boot application
├── ChatController.java     # REST controller handling /chat endpoint
├── ChatService.java        # Service layer for AI chat logic
└── WebConfig.java          # CORS configuration for React frontend
```

### Frontend (React)
```
frontend/src/
├── components/
│   ├── ChatInterface.js    # Main chat UI component (manages state)
│   ├── ChatInterface.css   # Styles for chat interface
│   ├── Message.js          # Individual message component
│   └── Message.css         # Styles for messages
├── services/
│   └── chatService.js      # API communication with backend (SSE)
├── utils/
│   └── markdownParser.js   # Markdown to HTML parser
├── App.js                  # Root React component
├── App.css                 # Root styles
├── index.js                # React entry point
└── index.css               # Global styles
```

## How It Works

### 1. React Component Structure
- **ChatInterface**: Main component that manages chat state, messages, and user input
- **Message**: Presentational component that displays individual messages
- **App**: Root component that wraps everything

### 2. API Communication (Real-World Pattern)
The `chatService.js` demonstrates how React apps call backend APIs:

```javascript
// Service layer pattern - separates API logic from UI components
const eventSource = new EventSource(`/chat?message=${message}`);

eventSource.onmessage = (event) => {
  // Handle streaming data from backend
  const data = JSON.parse(event.data);
  onMessage(data.content);
};
```

### 3. State Management
React's `useState` and `useEffect` hooks manage:
- Message history
- Input value
- Streaming status
- Auto-scrolling

### 4. Server-Sent Events (SSE)
- Backend uses `SseEmitter` to stream AI responses
- Frontend uses `EventSource` API to receive real-time updates
- Perfect for streaming chat responses token-by-token

### 5. Proxy Configuration
The `package.json` includes:
```json
"proxy": "http://localhost:8080"
```
This forwards API requests from React (port 3000) to Spring Boot (port 8080)

## Running the Application

### Prerequisites
1. **Java 17+** installed
2. **Node.js and npm** installed
3. **Ollama running** on localhost:11434 with a model (e.g., llama3)
   ```bash
   ollama serve
   ```

### Quick Start (Recommended)
Use the provided startup script:
```bash
./start.sh
```

To stop the application:
```bash
./stop.sh
```

### Manual Start

#### Terminal 1: Start Backend (Spring Boot)
```bash
./gradlew bootRun
```
Backend runs on: http://localhost:8080

Wait until you see: `Started ChatApplication in X seconds`

#### Terminal 2: Start Frontend (React)
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

The browser should automatically open to http://localhost:3000

### Troubleshooting

**If backend fails to start:**
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Check if port 8080 is available: `lsof -i :8080`
- View logs: `tail -f logs/backend.log`

**If frontend fails to start:**
- Check if port 3000 is available: `lsof -i :3000`
- Reinstall dependencies: `cd frontend && npm install --legacy-peer-deps`
- View logs: `tail -f logs/frontend.log`

**If getting CORS errors:**
- Make sure both servers are running
- React dev server should proxy requests to backend (configured in package.json)

## Key React Concepts Demonstrated

1. **Component Composition**: Breaking UI into reusable components
2. **Props**: Passing data from parent to child components
3. **State Management**: Using hooks to manage application state
4. **Side Effects**: useEffect for auto-scrolling
5. **Event Handling**: User input and button clicks
6. **Conditional Rendering**: Showing different UI based on state
7. **Service Layer**: Separating API logic from components
8. **CSS Modules**: Component-specific styling

## API Endpoints

### GET /chat
**Description**: Stream chat responses using SSE  
**Parameters**: 
- `message` (query param): User's message  

**Response**: Server-Sent Events stream
```json
{"content": "token"}
{"content": "token"}
...
```

## Features

✅ Real-time streaming chat responses  
✅ Markdown formatting (bold, italic, code, lists)  
✅ Numbered and bullet point lists  
✅ Clean separation of concerns (MVC pattern)  
✅ Responsive dark theme UI  
✅ Auto-scrolling chat  
✅ Loading states  

## Production Build

To build React for production:
```bash
cd frontend
npm run build
```

This creates optimized static files in `frontend/build/` that can be served by Spring Boot.

To serve React build from Spring Boot, copy the build folder to `src/main/resources/static/`.

## Learning Resources

- **React**: https://react.dev/
- **Server-Sent Events**: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Component Architecture**: Separation of concerns, single responsibility principle

