/**
 * Markdown Parser - Converts markdown text to HTML
 * Provides basic markdown rendering for chat messages
 */

/**
 * Parse markdown text and convert to HTML
 * @param {string} text - The markdown text to parse
 * @returns {string} The HTML output
 */
export const parseMarkdown = (text) => {
  if (!text) return '';

  let html = text
    // Escape HTML to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks with language specification (```language\ncode```)
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Numbered lists (1. item)
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Bullet lists (- item or * item at start of line)
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)(\n<li>[\s\S]*?<\/li>)*/g, (match) => {
    return '<ul>' + match + '</ul>';
  });

  // Clean up nested lists
  html = html.replace(/<\/ul>\n?<ul>/g, '');

  // Paragraphs - split by double newlines
  const parts = html.split(/\n\n+/);
  html = parts
    .map((part) => {
      part = part.trim();
      if (!part) return '';
      // Don't wrap already-wrapped elements
      if (
        part.startsWith('<h') ||
        part.startsWith('<ul') ||
        part.startsWith('<ol') ||
        part.startsWith('<pre') ||
        part.startsWith('<li')
      ) {
        return part;
      }
      return '<p>' + part.replace(/\n/g, '<br>') + '</p>';
    })
    .join('');

  return html;
};
