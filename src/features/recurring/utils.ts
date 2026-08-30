import { Frequency } from './recurringSlice';

export function computeNextDueDate(currentDueDate: string, frequency: Frequency, customDays: number | null): string {
  const date = new Date(currentDueDate);

  switch (frequency) {
    case 'DAILY':
      date.setDate(date.getDate() + 1);
      break;
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'CUSTOM':
      date.setDate(date.getDate() + (customDays ?? 30));
      break;
  }

  return date.toISOString();
}