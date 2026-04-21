import { format, formatDistance, isThisWeek, isToday, isYesterday, parseISO } from 'date-fns';
import { enUS, tn } from 'date-fns/locale';

// Format date
export const formatDate = (date, formatStr = 'dd MMM yyyy', locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: locale === 'tn' ? tn : enUS });
};

// Format datetime
export const formatDateTime = (date, locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy, HH:mm', { locale: locale === 'tn' ? tn : enUS });
};

// Format time
export const formatTime = (date, locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: locale === 'tn' ? tn : enUS });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date, baseDate = new Date(), locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, baseDate, { 
    addSuffix: true,
    locale: locale === 'tn' ? tn : enUS 
  });
};

// Get friendly date (Today, Yesterday, or formatted date)
export const getFriendlyDate = (date, locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) {
    return locale === 'tn' ? 'Gompieno' : 'Today';
  }
  
  if (isYesterday(d)) {
    return locale === 'tn' ? 'Maabane' : 'Yesterday';
  }
  
  if (isThisWeek(d)) {
    return format(d, 'EEEE', { locale: locale === 'tn' ? tn : enUS });
  }
  
  return formatDate(d, 'dd MMM yyyy', locale);
};

// Get day of week
export const getDayOfWeek = (date, locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE', { locale: locale === 'tn' ? tn : enUS });
};

// Get month name
export const getMonthName = (date, locale = 'en') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM', { locale: locale === 'tn' ? tn : enUS });
};

// Get year
export const getYear = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d.getFullYear();
};

// Calculate age from birthdate
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

// Format age
export const formatAge = (birthDate, locale = 'en') => {
  const { years, months } = calculateAge(birthDate);
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  
  return `${years}y ${months}m`;
};

// Check if date is in range
export const isDateInRange = (date, startDate, endDate) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return d >= start && d <= end;
};

// Get start of day
export const startOfDay = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of day
export const endOfDay = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  d.setHours(23, 59, 59, 999);
  return d;
};

// Get date range from period
export const getDateRangeFromPeriod = (period) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
      
    case 'month':
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
      
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
      
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
      
    default:
      break;
  }

  return { start, end };
};

// Get date range array for calendar
export const getDateRangeArray = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Check if date is weekend
export const isWeekend = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const day = d.getDay();
  return day === 0 || day === 6;
};

// Get quarter from date
export const getQuarter = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return Math.floor(d.getMonth() / 3) + 1;
};

// Get week number
export const getWeekNumber = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};