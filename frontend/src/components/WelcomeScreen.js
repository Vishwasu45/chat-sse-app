import React from 'react';
import PropTypes from 'prop-types';
import './WelcomeScreen.css';

/**
 * WelcomeScreen component - Shown when chat is empty
 * Features suggestion cards for quick prompts
 */
const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: 'Explain Java Streams',
      description: 'with practical examples',
      prompt: 'Explain how Java streams work with examples'
    },
    {
      title: 'REST API Best Practices',
      description: 'design patterns & tips',
      prompt: 'What are the best practices for REST API design?'
    },
    {
      title: 'Spring Dependency Injection',
      description: '@Autowired and more',
      prompt: 'Help me understand Spring Boot dependency injection'
    },
    {
      title: 'Python CSV Script',
      description: 'read & analyze data',
      prompt: 'Write a Python script to read a CSV file and calculate statistics'
    }
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-logo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="welcome-title">How can I help you today?</h2>
      <p className="welcome-subtitle">
        Powered by Llama 3.2 running locally via Ollama. Ask me anything!
      </p>
      
      <div className="suggestion-cards">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-card"
            onClick={() => onSuggestionClick(suggestion.prompt)}
          >
            <div className="suggestion-title">{suggestion.title}</div>
            <div className="suggestion-desc">{suggestion.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

WelcomeScreen.propTypes = {
  onSuggestionClick: PropTypes.func.isRequired
};

export default WelcomeScreen;
