/**
 * Format date to a readable string
 * @param {Date|string} date 
 * @param {Object} options 
 * @returns {string} 
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Truncate text to a specific length
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Format number with commas
 * @param {number} number 
 * @returns {string} 
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * @param {string} string 
 * @returns {string} 
 */
export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};