
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
