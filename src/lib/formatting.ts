import { format, parseISO, isValid } from 'date-fns';
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
export const formatDate = (dateString: string | Date, formatStr = 'MMM d, yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};