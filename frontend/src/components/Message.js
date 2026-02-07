import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { parseMarkdown } from '../utils/markdownParser';

/**
 * Message component - Displays a single chat message
 * Supports user and assistant messages with markdown rendering
 */
const Message = ({ text, isUser, isStreaming, isError }) => {
  return (
    <div className={`message-wrapper ${isStreaming ? 'streaming' : ''}`}>
      <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
        <div className="message-avatar">
          {isUser ? 'U' : 'AI'}
        </div>
        <div className="message-content">
          <div className="message-role">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div 
            className={`message-text ${isError ? 'error' : ''}`}
            dangerouslySetInnerHTML={{ 
              __html: text ? parseMarkdown(text) : (
                isStreaming ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : ''
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  isStreaming: PropTypes.bool,
  isError: PropTypes.bool
};

Message.defaultProps = {
  isStreaming: false,
  isError: false
};

export default Message;
