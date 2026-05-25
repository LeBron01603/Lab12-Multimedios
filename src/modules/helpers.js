/**
 * Capitalizes the first letter of a string.
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Ensures temperature string has a unit.
 * @param {string} temp 
 * @returns {string}
 */
export function formatTemperature(temp) {
  if (!temp) return '-- °C';
  temp = temp.trim();
  return temp.includes('°') ? temp : `${temp} °C`;
}

/**
 * Returns the current local time in HH:MM:SS format.
 * @returns {string}
 */
export function getCurrentTimeFormatted() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
