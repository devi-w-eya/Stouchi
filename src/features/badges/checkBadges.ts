import { RootState } from '../../store';
import { Badge } from './badgeSlice';

export function getBadgeProgress(badge: Badge, state: RootState): number {
  switch (badge.conditionType) {
    case 'FIRST_TRANSACTION':
      return state.transactions.items.length;

    case 'CATEGORIES_CREATED':
      return state.categories.items.length;

    case 'DAYS_LOGGED': {
      const uniqueDays = new Set(
        state.transactions.items.map((t) => new Date(t.date).toDateString())
      );
      return uniqueDays.size;
    }

    case 'SAVINGS_GOAL_REACHED':
      return state.categories.items.filter(
        (c) => c.savingsGoal > 0 && c.currentSaved >= c.savingsGoal
      ).length;

    case 'TOTAL_SAVED':
      return state.categories.items.reduce((sum, c) => sum + c.currentSaved, 0);

    case 'WISHLIST_RESISTED':
      return state.wishlist.items.filter((i) => i.status === 'RESISTED').length;

    case 'RECURRING_PAID':
      return state.recurring.items.filter((r) => r.lastPaidAt !== null).length;

    default:
      return 0;
  }
}

export function isBadgeUnlocked(badge: Badge, state: RootState): boolean {
  return getBadgeProgress(badge, state) >= badge.conditionThreshold;
}