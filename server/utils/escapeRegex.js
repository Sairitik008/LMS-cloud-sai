/**
 * Safely escape special regex characters from user search queries
 * to prevent ReDoS (Regular Expression Denial of Service) and regex syntax errors in MongoDB.
 *
 * @param {string} text - User search input string
 * @returns {string} - Escaped regex pattern string
 */
const escapeRegex = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = escapeRegex;
