import { format, differenceInDays, addDays, isAfter } from 'date-fns';

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'dd MMMM yyyy, HH:mm');
}

export function calculateDays(startDate: Date | string, endDate: Date | string): number {
  return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
}

export function isOverdue(endDate: Date | string): boolean {
  return isAfter(new Date(), new Date(endDate));
}

export function calculateLateFee(endDate: Date | string, dailyRate: number): number {
  if (!isOverdue(endDate)) return 0;
  const daysOverdue = differenceInDays(new Date(), new Date(endDate));
  return daysOverdue * dailyRate * 0.1; // 10% of daily rate per day
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

export function calculateReputationScore(rating: number, currentScore: number): number {
  // Reputation score ranges from 0-200
  // New rating affects score by 10% of the difference
  const newScore = currentScore + (rating - 3) * 2; // 3 is neutral (100)
  return Math.max(0, Math.min(200, Math.round(newScore)));
}
