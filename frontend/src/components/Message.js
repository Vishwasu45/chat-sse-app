import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { parseMarkdown } from '../utils/markdownParser';

/**
 * Message component - Displays a single chat message
 * Props:
 * - text: The message text content
 * - isUser: Boolean indicating if message is from user or bot
 * - isStreaming: Boolean indicating if the message is currently being streamed
 */
const Message = ({ text, isUser, isStreaming }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'} ${isStreaming ? 'streaming' : ''}`}>
      {isUser ? (
        <span>{text}</span>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />
      )}
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  isStreaming: PropTypes.bool
};

Message.defaultProps = {
  isStreaming: false
};

export default Message;

