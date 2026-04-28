// Format currency (BWP)
export const formatCurrency = (amount, currency = 'BWP') => {
  return new Intl.NumberFormat('en-BW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num, decimals = 0) => {
  return new Intl.NumberFormat('en-BW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat('en-BW', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format phone number (Botswana)
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('267')) {
    return `+267 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

// Format BAITS tag
export const formatBaitsTag = (tag) => {
  const cleaned = tag.replace(/[^A-Z0-9-]/g, '').toUpperCase();
  
  if (cleaned.length > 2 && !cleaned.startsWith('BW-')) {
    return `BW-${cleaned}`;
  }
  
  return cleaned;
};

// Format name (capitalize first letter of each word)
export const formatName = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Format address
export const formatAddress = (address) => {
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.country) parts.push(address.country);
  if (address.postalCode) parts.push(address.postalCode);
  
  return parts.join(', ');
};

// Format coordinates for display
export const formatCoordinates = (lat, lng, precision = 6) => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

// Format duration (seconds to human readable)
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
};

// Format distance (meters to km with unit)
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Format weight (kg with unit)
export const formatWeight = (kg) => {
  return `${kg.toFixed(1)} kg`;
};

// Format temperature (°C with unit)
export const formatTemperature = (celsius) => {
  return `${Math.round(celsius)}°C`;
};

// Format list as comma-separated with "and"
export const formatList = (items, conjunction = 'and') => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const last = items.pop();
  return `${items.join(', ')}, ${conjunction} ${last}`;
};

// Format boolean as Yes/No
export const formatBoolean = (value, yes = 'Yes', no = 'No') => {
  return value ? yes : no;
};

// Format health status with emoji/icon
export const formatHealthStatus = (status) => {
  const icons = {
    healthy: '✅',
    sick: '⚠️',
    critical: '🚨',
    recovering: '💚',
  };
  
  return `${icons[status] || ''} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
};

// Format priority with icon
export const formatPriority = (priority) => {
  const icons = {
    low: '🔵',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };
  
  return `${icons[priority] || ''} ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;
};

// Format report number
export const formatReportNumber = (number) => {
  if (!number) return '';
  
  if (number.startsWith('RPT-')) {
    return number;
  }
  
  return `RPT-${number}`;
};