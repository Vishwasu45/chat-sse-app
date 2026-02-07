# React Learning Guide - Chat Application

This guide explains React concepts using our Chat SSE application as examples.

## Table of Contents
1. [Component Basics](#component-basics)
2. [Props and Data Flow](#props-and-data-flow)
3. [State Management](#state-management)
4. [Hooks](#hooks)
5. [Event Handling](#event-handling)
6. [API Communication](#api-communication)
7. [Styling](#styling)

---

## Component Basics

### What is a Component?
A component is a reusable piece of UI. Think of it like a LEGO block - you can build complex interfaces by combining simple components.

### Functional Components
Modern React uses functional components (not class components):

```javascript
// Simple component
const Message = ({ text, isUser }) => {
  return (
    <div className={isUser ? 'user-message' : 'bot-message'}>
      {text}
    </div>
  );
};
```

**In our app:**
- `Message.js` - Displays a single chat message
- `ChatInterface.js` - Manages the entire chat UI
- `App.js` - Root component

---

## Props and Data Flow

### What are Props?
Props (properties) are how you pass data from parent to child components. Data flows **one way** (parent → child).

**Example from Message.js:**
```javascript
const Message = ({ text, isUser, isStreaming }) => {
  // text, isUser, isStreaming are props received from parent
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      {isUser ? (
        <span>{text}</span>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />
      )}
    </div>
  );
};
```

**Usage in parent (ChatInterface.js):**
```javascript
<Message 
  text="Hello World"
  isUser={false}
  isStreaming={true}
/>
```

### Destructuring Props
Instead of `props.text`, we use `{ text, isUser }` - this is ES6 destructuring.

---

## State Management

### What is State?
State is data that changes over time. When state changes, React re-renders the component.

**Example from ChatInterface.js:**
```javascript
const [messages, setMessages] = useState([
  {
    id: 1,
    text: "Hello!",
    isUser: false
  }
]);

const [inputValue, setInputValue] = useState('');
const [isSending, setIsSending] = useState(false);
```

### useState Hook
```javascript
const [value, setValue] = useState(initialValue);
```
- `value` - current state value
- `setValue` - function to update state
- `initialValue` - starting value

### Updating State
```javascript
// Wrong - don't modify state directly
messages.push(newMessage); ❌

// Correct - create new array
setMessages([...messages, newMessage]); ✅

// Or use callback for previous state
setMessages(prev => [...prev, newMessage]); ✅
```

**Real example from our app:**
```javascript
const handleSendMessage = async () => {
  // Add user message to state
  const userMessage = {
    id: Date.now(),
    text: inputValue,
    isUser: true
  };
  
  setMessages(prev => [...prev, userMessage]);
  setInputValue(''); // Clear input
  setIsSending(true); // Disable send button
};
```

---

## Hooks

### useEffect Hook
Runs side effects (code that affects things outside React).

**Example - Auto-scroll:**
```javascript
useEffect(() => {
  // This runs after every render when messages change
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = 
      chatContainerRef.current.scrollHeight;
  }
}, [messages]); // Dependency array - only run when messages change
```

**Common use cases:**
- Fetch data from API
- Subscribe to events
- Update DOM elements
- Set up timers

**Cleanup:**
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Cleanup function - runs when component unmounts
  return () => clearInterval(timer);
}, []);
```

### useRef Hook
Creates a reference to a DOM element or value that persists across renders.

**Example from ChatInterface.js:**
```javascript
const chatContainerRef = useRef(null);

// Later in JSX
<div className="chat-container" ref={chatContainerRef}>
  {/* messages */}
</div>

// Access the actual DOM element
chatContainerRef.current.scrollTop = 0;
```

**Difference from state:**
- `useState` - triggers re-render when updated
- `useRef` - does NOT trigger re-render when updated

---

## Event Handling

### onClick Events
```javascript
<button onClick={handleSendMessage}>
  Send
</button>

// Handler function
const handleSendMessage = () => {
  console.log('Button clicked!');
};
```

### onChange Events
```javascript
<input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
```

### onKeyPress Events
```javascript
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Prevent default form submission
    handleSendMessage();
  }
};

<input onKeyPress={handleKeyPress} />
```

### Event Object
The event parameter (`e`) contains information about the event:
- `e.target.value` - input value
- `e.key` - keyboard key pressed
- `e.preventDefault()` - prevent default browser behavior

---

## API Communication

### Service Layer Pattern
Separate API logic from UI components for better organization.

**chatService.js:**
```javascript
const streamChat = (message, onMessage, onComplete, onError) => {
  const eventSource = new EventSource(
    `/chat?message=${encodeURIComponent(message)}`
  );
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data.content); // Callback to UI
  };
  
  eventSource.onerror = () => {
    eventSource.close();
    onComplete();
  };
  
  return eventSource;
};

export const chatService = { streamChat };
```

**Using in component:**
```javascript
import { chatService } from '../services/chatService';

chatService.streamChat(
  text,                    // message to send
  (chunk) => {             // onMessage callback
    setMessages(prev => 
      prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, text: msg.text + chunk }
          : msg
      )
    );
  },
  () => {                  // onComplete callback
    setIsSending(false);
  },
  (error) => {             // onError callback
    console.error(error);
  }
);
```

### Why Service Layer?
✅ Reusable - use same API calls in multiple components  
✅ Testable - easy to mock for testing  
✅ Maintainable - change API logic in one place  
✅ Separation of concerns - UI doesn't know about API details  

### Server-Sent Events (SSE)
Unlike normal HTTP requests, SSE keeps connection open for streaming:

```javascript
// Create connection
const eventSource = new EventSource('/api/endpoint');

// Receive messages
eventSource.onmessage = (event) => {
  console.log('Received:', event.data);
};

// Close connection
eventSource.close();
```

### Proxy Configuration
In `package.json`:
```json
"proxy": "http://localhost:8080"
```

This tells React dev server to forward API requests:
- `/chat` → `http://localhost:8080/chat`
- Avoids CORS issues during development

---

## Styling

### CSS Files
Each component has its own CSS file:
```
Message.js  → Message.css
ChatInterface.js → ChatInterface.css
```

### className (not class)
In JSX, use `className` instead of HTML's `class`:
```javascript
<div className="message">Hello</div>
```

### Dynamic Classes
```javascript
<div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
```

This creates: `class="message user-message"` or `class="message bot-message"`

### Inline Styles
```javascript
<div style={{ color: 'red', fontSize: '16px' }}>
  Text
</div>
```

Note: Use camelCase (`fontSize` not `font-size`)

---

## Component Lifecycle

### Lifecycle in Functional Components

```javascript
const MyComponent = () => {
  // 1. Component Mount (created)
  useEffect(() => {
    console.log('Component mounted');
    
    // 3. Component Unmount (destroyed)
    return () => {
      console.log('Component unmounted');
    };
  }, []); // Empty array = run once
  
  // 2. Component Update (re-render)
  useEffect(() => {
    console.log('Component updated');
  }); // No array = run on every render
  
  return <div>Hello</div>;
};
```

---

## Best Practices

### 1. Keep Components Small
Split large components into smaller ones:
```javascript
// Bad - one huge component
<ChatInterface>
  {/* 500 lines of code */}
</ChatInterface>

// Good - multiple small components
<ChatInterface>
  <ChatHeader />
  <MessageList>
    <Message />
    <Message />
  </MessageList>
  <InputArea />
</ChatInterface>
```

### 2. Single Responsibility
Each component should do one thing well.

### 3. Lift State Up
If multiple components need same data, move state to their common parent.

### 4. Don't Mutate State
Always create new objects/arrays:
```javascript
// Bad ❌
state.push(item);

// Good ✅
setState([...state, item]);
```

### 5. Use Meaningful Names
```javascript
// Bad
const [x, setX] = useState(0);

// Good
const [messageCount, setMessageCount] = useState(0);
```

---

## Common Patterns in Our App

### 1. List Rendering
```javascript
{messages.map(message => (
  <Message 
    key={message.id}  // Important: unique key for each item
    text={message.text}
    isUser={message.isUser}
  />
))}
```

### 2. Conditional Rendering
```javascript
{isUser ? (
  <span>{text}</span>
) : (
  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />
)}
```

### 3. State Updates with Callbacks
```javascript
setMessages(prev => 
  prev.map(msg => 
    msg.id === targetId 
      ? { ...msg, text: msg.text + newChunk }
      : msg
  )
);
```

This pattern:
- Uses previous state (`prev`)
- Doesn't mutate (creates new array with `map`)
- Updates specific item by ID

---

## Real-World API Flow

Let's trace a complete message flow:

1. **User types and clicks Send**
   ```javascript
   onClick={handleSendMessage}
   ```

2. **Update UI immediately (optimistic update)**
   ```javascript
   setMessages(prev => [...prev, userMessage]);
   setInputValue('');
   setIsSending(true);
   ```

3. **Call backend API**
   ```javascript
   chatService.streamChat(text, onMessage, onComplete, onError)
   ```

4. **Create SSE connection**
   ```javascript
   const eventSource = new EventSource(`/chat?message=${text}`);
   ```

5. **Backend streams response**
   ```
   Spring Boot Controller → SseEmitter → EventSource
   ```

6. **Update UI with each chunk**
   ```javascript
   setMessages(prev => 
     prev.map(msg => msg.id === botId ? {...msg, text: msg.text + chunk} : msg)
   );
   ```

7. **Complete and re-enable input**
   ```javascript
   setIsSending(false);
   ```

---

## Debugging Tips

### 1. React DevTools
Install React DevTools browser extension to inspect:
- Component tree
- Props and state
- Performance

### 2. Console Logging
```javascript
console.log('State:', messages);
console.log('Props:', { text, isUser });
```

### 3. useEffect Dependencies
If useEffect runs too often or not at all, check dependencies:
```javascript
useEffect(() => {
  // This code
}, [dependency1, dependency2]); // Add all used variables here
```

### 4. State Updates Not Working?
Remember: state updates are asynchronous
```javascript
setCount(count + 1);
console.log(count); // Still old value!

// Use callback to see new value
setCount(prev => {
  console.log('New value:', prev + 1);
  return prev + 1;
});
```

---

## Next Steps

1. **Experiment**: Modify the code and see what happens
2. **Add Features**: Try adding:
   - Delete message button
   - Message timestamps
   - User avatars
   - Dark/light theme toggle
3. **Learn More**: 
   - Context API (global state)
   - Custom hooks (reusable logic)
   - React Router (multiple pages)
   - Form handling libraries (Formik, React Hook Form)

---

## Resources

- Official React Docs: https://react.dev/
- React Tutorial: https://react.dev/learn
- JavaScript ES6+: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- React Hooks: https://react.dev/reference/react

