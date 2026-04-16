/**
 * Utility Functions for ContentScheduler
 * Funciones auxiliares compartidas
 */

/**
 * Format AI markdown to HTML
 * @param {string} text - Text to format
 * @returns {string} Formatted HTML
 */
export const formatAiMarkdown = (text) => {
  if (!text) return '';
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  escaped = escaped.replace(/\n/g, '<br />');

  return escaped;
};

/**
 * Get platform color
 * @param {string} platform - Platform name
 * @param {string} theme - Theme (dark/light)
 * @returns {string} Color class
 */
export const getPlatformColor = (platform, theme = 'dark') => {
  const colors = {
    tiktok: theme === 'dark' ? 'text-pink-400' : 'text-pink-600',
    instagram: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    youtube: theme === 'dark' ? 'text-red-400' : 'text-red-600',
    facebook: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    linkedin: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
    twitter: theme === 'dark' ? 'text-sky-400' : 'text-sky-600'
  };
  return colors[platform.toLowerCase()] || (theme === 'dark' ? 'text-gray-400' : 'text-gray-600');
};

/**
 * Get status color
 * @param {string} status - Status
 * @param {string} theme - Theme
 * @returns {Object} Color classes
 */
export const getStatusColor = (status, theme = 'dark') => {
  const statuses = {
    scheduled: {
      bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200'
    },
    published: {
      bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      border: theme === 'dark' ? 'border-green-500/30' : 'border-green-200'
    },
    pending: {
      bg: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
      text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      border: theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-200'
    },
    failed: {
      bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      border: theme === 'dark' ? 'border-red-500/30' : 'border-red-200'
    }
  };
  return statuses[status] || statuses.pending;
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get month name
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
};

/**
 * Get days in month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} Number of days
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Is same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

/**
 * Filter posts by criteria
 * @param {Array} posts - Posts to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered posts
 */
export const filterPosts = (posts, filters) => {
  return posts.filter(post => {
    if (filters.platform !== 'all' && post.platform !== filters.platform) return false;
    if (filters.status !== 'all' && post.status !== filters.status) return false;
    if (filters.niche !== 'all' && post.niche !== filters.niche) return false;
    if (filters.country !== 'all' && post.country !== filters.country) return false;
    return true;
  });
};

export default {
  formatAiMarkdown,
  getPlatformColor,
  getStatusColor,
  formatDate,
  formatTime,
  getMonthName,
  getDaysInMonth,
  isSameDay,
  filterPosts
};
