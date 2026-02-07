/**
 * Chat Service - Handles API communication with the backend
 * Uses Server-Sent Events (SSE) for real-time streaming
 */

/**
 * Stream chat messages from the backend using SSE
 * @param {string} message - The user's message
 * @param {function} onMessage - Callback function for each message chunk
 * @param {function} onComplete - Callback function when streaming is complete
 * @param {function} onError - Callback function for errors
 */
const streamChat = (message, onMessage, onComplete, onError) => {
  // Create EventSource connection to backend SSE endpoint
  // The proxy in package.json will forward this to http://localhost:8080
  const eventSource = new EventSource(`/chat?message=${encodeURIComponent(message)}`);

  // Handle incoming messages
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.content) {
        onMessage(data.content);
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error);
      onError(error);
    }
  };

  // Handle errors and connection close
  eventSource.onerror = (error) => {
    console.log('SSE connection closed or error occurred');
    eventSource.close();
    onComplete();
  };

  // Return the eventSource so caller can close it if needed
  return eventSource;
};

export const chatService = {
  streamChat
};

