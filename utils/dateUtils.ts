/**
 * Date formatting utilities for consistent date handling across the application
 * All dates are formatted as DD-MM-YYYY for display and user interaction
 * Internal storage may use ISO format depending on backend requirements
 */

/**
 * Formats a Date object to DD-MM-YYYY string format
 */
export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Parses a DD-MM-YYYY string to a Date object
 * Returns null if the date is invalid
 */
export const parseDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  // Validate that the created date matches the input
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }

  return date;
};

/**
 * Converts ISO date string (YYYY-MM-DD) to DD-MM-YYYY format
 */
export const isoToDDMMYYYY = (isoDate: string): string => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

/**
 * Converts DD-MM-YYYY format to ISO date string (YYYY-MM-DD)
 */
export const ddmmyyyyToISO = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return '';
  const parts = ddmmyyyy.split('-');
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

/**
 * Validates a DD-MM-YYYY date string
 */
export const isValidDDMMYYYY = (dateStr: string): boolean => {
  return parseDDMMYYYY(dateStr) !== null;
};

/**
 * Gets the current date in DD-MM-YYYY format
 */
export const getCurrentDateDDMMYYYY = (): string => {
  return formatDateToDDMMYYYY(new Date());
};

/**
 * Gets the current date in ISO format (YYYY-MM-DD)
 */
export const getCurrentDateISO = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Calculates age from a birth date in DD-MM-YYYY format
 * Returns age in years, or null if date is invalid
 */
export const calculateAgeFromDDMMYYYY = (birthDateStr: string): number | null => {
  const birthDate = parseDDMMYYYY(birthDateStr);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Checks if a date is in the future (DD-MM-YYYY format)
 */
export const isFutureDate = (dateStr: string): boolean => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

/**
 * Checks if a date is in the past (DD-MM-YYYY format)
 */
export const isPastDate = (dateStr: string): boolean => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

/**
 * Checks if a date is today (DD-MM-YYYY format)
 */
export const isToday = (dateStr: string): boolean => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return false;

  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Adds days to a date (DD-MM-YYYY format)
 */
export const addDaysToDDMMYYYY = (dateStr: string, days: number): string => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return dateStr;

  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);

  return formatDateToDDMMYYYY(newDate);
};

/**
 * Subtracts days from a date (DD-MM-YYYY format)
 */
export const subtractDaysFromDDMMYYYY = (dateStr: string, days: number): string => {
  return addDaysToDDMMYYYY(dateStr, -days);
};

/**
 * Gets the difference in days between two dates (DD-MM-YYYY format)
 */
export const getDaysDifference = (date1Str: string, date2Str: string): number => {
  const date1 = parseDDMMYYYY(date1Str);
  const date2 = parseDDMMYYYY(date2Str);

  if (!date1 || !date2) return 0;

  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Formats a date for display in the UI
 * Example: "Today", "Yesterday", "Tomorrow", or "DD-MM-YYYY"
 */
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';

  if (isToday(dateStr)) return 'Today';
  if (isToday(addDaysToDDMMYYYY(dateStr, 1))) return 'Yesterday';
  if (isToday(subtractDaysFromDDMMYYYY(dateStr, 1))) return 'Tomorrow';

  return dateStr;
};

/**
 * Gets the first day of the month in DD-MM-YYYY format
 */
export const getFirstDayOfMonth = (dateStr: string): string => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return dateStr;

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return formatDateToDDMMYYYY(firstDay);
};

/**
 * Gets the last day of the month in DD-MM-YYYY format
 */
export const getLastDayOfMonth = (dateStr: string): string => {
  const date = parseDDMMYYYY(dateStr);
  if (!date) return dateStr;

  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return formatDateToDDMMYYYY(lastDay);
};

/**
 * Formats age from a Date object into human-readable format
 * Returns formats like "2 years 3 months", "6 months", "3 weeks", or "5 days"
 */
export const formatAge = (birthDate: Date): string => {
  const today = new Date();
  const birth = new Date(birthDate);

  // Calculate total difference in milliseconds
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // For very young pets (less than 8 weeks)
  if (diffDays < 56) {
    if (diffDays < 14) {
      return diffDays === 1 ? '1 day' : `${diffDays} days`;
    }
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  // Calculate years and months
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  // Adjust if birthday hasn't occurred this year
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  // Adjust months if day hasn't occurred this month
  if (today.getDate() < birth.getDate()) {
    months--;
  }

  // Format output
  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  } else if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  } else {
    const yearStr = years === 1 ? '1 year' : `${years} years`;
    const monthStr = months === 1 ? '1 month' : `${months} months`;
    return `${yearStr} ${monthStr}`;
  }
};