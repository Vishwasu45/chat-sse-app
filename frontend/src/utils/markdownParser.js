/**
 * Utility function to parse markdown-like text to HTML
 * Supports: numbered lists, bullet lists, bold, italic, code blocks
 */
export const parseMarkdown = (text) => {
  if (!text) return '';

  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Convert newlines to a temporary marker
  html = html.replace(/\n/g, '<!NEWLINE!>');

  // Numbered lists (1. item)
  html = html.replace(/(?:<!NEWLINE!>|^)(\d+\.\s+.+?)(?=<!NEWLINE!>|$)/g, function(match, item) {
    return '<!LIST_ITEM_NUM!>' + item.trim() + '<!LIST_ITEM_END!>';
  });

  // Bullet lists (- item or * item)
  html = html.replace(/(?:<!NEWLINE!>|^)([-*]\s+.+?)(?=<!NEWLINE!>|$)/g, function(match, item) {
    return '<!LIST_ITEM_BULLET!>' + item.substring(2).trim() + '<!LIST_ITEM_END!>';
  });

  // Group consecutive numbered list items
  html = html.replace(/(<!LIST_ITEM_NUM!>.+?<!LIST_ITEM_END!>)+/g, function(match) {
    const items = match.match(/<!LIST_ITEM_NUM!>(.+?)<!LIST_ITEM_END!>/g)
      .map(item => item.replace(/<!LIST_ITEM_NUM!>(.+?)<!LIST_ITEM_END!>/, '<li>$1</li>'))
      .join('');
    return '<ol>' + items + '</ol>';
  });

  // Group consecutive bullet list items
  html = html.replace(/(<!LIST_ITEM_BULLET!>.+?<!LIST_ITEM_END!>)+/g, function(match) {
    const items = match.match(/<!LIST_ITEM_BULLET!>(.+?)<!LIST_ITEM_END!>/g)
      .map(item => item.replace(/<!LIST_ITEM_BULLET!>(.+?)<!LIST_ITEM_END!>/, '<li>$1</li>'))
      .join('');
    return '<ul>' + items + '</ul>';
  });

  // Convert double newlines to paragraphs
  const parts = html.split(/<!NEWLINE!><!NEWLINE!>+/);
  html = parts.map(part => {
    part = part.replace(/<!NEWLINE!>/g, ' ').trim();
    // Don't wrap lists and code blocks in <p>
    if (part.startsWith('<ol>') || part.startsWith('<ul>') ||
        part.startsWith('<pre>') || part === '') {
      return part;
    }
    return '<p>' + part + '</p>';
  }).join('');

  // Clean up any remaining newline markers
  html = html.replace(/<!NEWLINE!>/g, '<br>');

  return html;
};

