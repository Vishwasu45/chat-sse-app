import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import Message from './Message';
import { chatService } from '../services/chatService';

/**
 * ChatInterface component - Main chat UI component
 * Manages state for messages and handles user interactions
 */
const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm connected to your local Llama model. How can I help you today?",
      isUser: false,
      isStreaming: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handle sending a message to the backend
   */
  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      isStreaming: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // Add bot message placeholder
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      text: '',
      isUser: false,
      isStreaming: true
    };
    setMessages(prev => [...prev, botMessage]);

    // Connect to SSE endpoint
    try {
      await chatService.streamChat(text, (chunk) => {
        // Update bot message with streamed content
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      }, () => {
        // On complete
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        setIsSending(false);
      }, (error) => {
        // On error
        console.error('Error streaming chat:', error);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, text: 'Error: Could not get response from server.', isStreaming: false }
              : msg
          )
        );
        setIsSending(false);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <header className="chat-header">
        <h1>Spring AI Chatbot (Ollama)</h1>
      </header>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map(message => (
          <Message
            key={message.id}
            text={message.text}
            isUser={message.isUser}
            isStreaming={message.isStreaming}
          />
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSending}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={isSending || !inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;

