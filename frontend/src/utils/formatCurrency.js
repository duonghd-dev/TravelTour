/**
 * Format số tiền thành format tiền tệ VND
 * @param {number} amount - Số tiền cần format
 * @param {string} currency - Loại tiền tệ (default: VND)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'VND') => {
  if (!amount && amount !== 0) return '';

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export default formatCurrency;
