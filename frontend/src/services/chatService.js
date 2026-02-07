/**
 * Chat Service - Handles API communication with the backend
 * Uses Server-Sent Events (SSE) for real-time streaming
 */

// Use direct backend URL to avoid CRA proxy buffering SSE responses
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : '';

/**
 * Stream chat messages from the backend using SSE
 * @param {string} message - The user's message
 * @param {function} onMessage - Callback function for each message chunk
 * @param {function} onComplete - Callback function when streaming is complete
 * @param {function} onError - Callback function for errors
 * @returns {EventSource} The EventSource instance for cleanup
 */
const streamChat = (message, onMessage, onComplete, onError) => {
  // Connect directly to backend to avoid proxy buffering SSE
  const url = `${API_BASE_URL}/chat?message=${encodeURIComponent(message)}`;
  const eventSource = new EventSource(url);

  // Handle 'message' events - these contain the streamed tokens
  eventSource.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.content) {
        onMessage(data.content);
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error);
    }
  });

  // Handle 'complete' event - signals end of stream
  eventSource.addEventListener('complete', (event) => {
    eventSource.close();
    onComplete();
  });

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    eventSource.close();
    onError(error);
  };

  // Return the eventSource so caller can close it if needed
  return eventSource;
};

export const chatService = {
  streamChat
};
