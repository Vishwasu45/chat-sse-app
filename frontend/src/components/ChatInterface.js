import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatInterface.css';
import Sidebar from './Sidebar';
import Message from './Message';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import { chatService } from '../services/chatService';

/**
 * ChatInterface component - Main chat UI component
 * Features modern ChatGPT/Gemini-inspired design
 */
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [streamingText, setStreamingText] = useState('');
  const [streamingId, setStreamingId] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages or streaming text changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  /**
   * Handle sending a message to the backend
   */
  const handleSendMessage = useCallback((text) => {
    if (!text.trim() || isSending) return;

    setShowWelcome(false);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      isStreaming: false
    };

    const botMessageId = Date.now() + 1;
    setStreamingId(botMessageId);
    setStreamingText('');

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    // Connect to SSE endpoint
    chatService.streamChat(
      text.trim(),
      (chunk) => {
        // Update streaming text directly - React will batch but that's okay
        // since we're using a separate state for streaming
        setStreamingText(prev => prev + chunk);
      },
      () => {
        // On complete - move streaming text to messages
        setStreamingText(currentText => {
          setMessages(prev => [...prev, {
            id: botMessageId,
            text: currentText,
            isUser: false,
            isStreaming: false
          }]);
          return '';
        });
        setStreamingId(null);
        setIsSending(false);
      },
      (error) => {
        // On error
        console.error('Error streaming chat:', error);
        setMessages(prev => [...prev, {
          id: botMessageId,
          text: 'Error: Could not connect to the AI service. Please ensure Ollama is running.',
          isUser: false,
          isStreaming: false,
          isError: true
        }]);
        setStreamingText('');
        setStreamingId(null);
        setIsSending(false);
      }
    );
  }, [isSending]);

  /**
   * Handle new chat - clear messages and show welcome screen
   */
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    setIsSending(false);
    setStreamingText('');
    setStreamingId(null);
  }, []);

  /**
   * Handle suggestion card click
   */
  const handleSuggestionClick = useCallback((prompt) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  // Combine messages with current streaming message for display
  const displayMessages = streamingId 
    ? [...messages, { id: streamingId, text: streamingText, isUser: false, isStreaming: true }]
    : messages;

  return (
    <div className="chat-interface">
      <Sidebar onNewChat={handleNewChat} />
      
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>Spring AI Chat</h1>
          </div>
        </header>

        <div className="chat-container" ref={chatContainerRef}>
          <div className="chat-messages">
            {showWelcome ? (
              <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
            ) : (
              displayMessages.map(message => (
                <Message
                  key={message.id}
                  text={message.text}
                  isUser={message.isUser}
                  isStreaming={message.isStreaming}
                  isError={message.isError}
                />
              ))
            )}
          </div>
        </div>

        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isSending} 
        />
      </main>
    </div>
  );
};

export default ChatInterface;
