import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatInput.css';

/**
 * ChatInput component - Message input area with send button
 * Features auto-resize textarea and keyboard shortcuts
 */
const ChatInput = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-wrapper">
      <div className="input-container">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            placeholder="Message Spring AI..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleSubmit}
            disabled={disabled || !inputValue.trim()}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <div className="input-hint">Press Enter to send, Shift+Enter for new line</div>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ChatInput.defaultProps = {
  disabled: false
};

export default ChatInput;
