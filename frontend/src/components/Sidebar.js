import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';

/**
 * Sidebar component - Chat history and controls
 */
const Sidebar = ({ onNewChat }) => {
  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Chat
      </button>
      
      <div className="sidebar-title">Today</div>
      <div className="chat-history">
        <div className="chat-item active">Current Conversation</div>
      </div>
      
      <div className="sidebar-footer">
        <div className="model-info">
          <span className="model-badge">Llama 3.2</span>
          <span>Local Model</span>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  onNewChat: PropTypes.func.isRequired
};

export default Sidebar;
