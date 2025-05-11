/**
 * Format a date object to a readable string
 * @param date Date object to format
 * @returns Formatted date string (e.g., "May 11, 2025")
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format a date object to include time
 * @param date Date object to format
 * @returns Formatted date and time string (e.g., "May 11, 2025, 4:05 PM")
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};
