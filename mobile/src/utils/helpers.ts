// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDaysUntil = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Currency formatting
export const formatCurrency = (amount, currency = 'INR') => {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toFixed(2)}`;
};

export const formatCurrencyShort = (amount, currency = 'INR') => {
  const symbol = currency === 'INR' ? '₹' : '$';
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toFixed(0)}`;
};

// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    accommodation: '🏨',
    food: '🍽️',
    transport: '🚗',
    activities: '🎉',
    shopping: '🛍️',
    utilities: '💡',
    entertainment: '🎬',
    other: '💰'
  };
  return icons[category] || '💰';
};

// Calculate percentage
export const calculatePercentage = (part, whole) => {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100);
};

// Split calculation
export const calculateEqualSplit = (amount, count) => {
  return Math.round((amount / count) * 100) / 100;
};

// Truncate string
export const truncateString = (str, length = 20) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// Generate random color
export const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  return colors[Math.floor(Math.random() * colors.length)];
};
