/**
 * Convert title or string to URL-friendly slug
 * e.g. "FarmFlow AI 2.0!" -> "farmflow-ai-2-0"
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format date string into human readable format
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Format full datetime string
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

/**
 * Convert comma or newline-separated string into trimmed string array
 */
export function parseStringArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(s => String(s).trim()).filter(Boolean);
  return String(input)
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Join string array back to comma-separated string for form inputs
 */
export function joinStringArray(arr, separator = ', ') {
  if (!arr) return '';
  if (Array.isArray(arr)) return arr.join(separator);
  return String(arr);
}
