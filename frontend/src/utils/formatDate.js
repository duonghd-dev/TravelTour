/**
 * Format date theo các format khác nhau
 * @param {Date|string} date - Date object hoặc string
 * @param {string} format - Format string (DD/MM/YYYY, DD-MM-YYYY, HH:mm, etc)
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Pad number with leading zero
  const pad = (num) => String(num).padStart(2, '0');

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  // Replace format tokens
  return format
    .replace(/DD/g, day)
    .replace(/MM/g, month)
    .replace(/YYYY/g, year)
    .replace(/YY/g, String(year).slice(-2))
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
};

export default formatDate;
