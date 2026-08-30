import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BadgeConditionType =
  | 'FIRST_TRANSACTION'
  | 'CATEGORIES_CREATED'
  | 'DAYS_LOGGED'
  | 'BUDGET_MASTER'
  | 'SAVINGS_GOAL_REACHED'
  | 'TOTAL_SAVED'
  | 'WISHLIST_RESISTED'
  | 'RECURRING_PAID';

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  conditionType: BadgeConditionType;
  conditionThreshold: number;
};

export type UserBadge = {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
};

type BadgesState = {
  all: Badge[];
  unlocked: UserBadge[];
};

const BADGE_DEFINITIONS: Badge[] = [
  { id: 'first-transaction', name: 'First Steps', description: 'Log your first transaction', icon: '🏅', xpReward: 25, conditionType: 'FIRST_TRANSACTION', conditionThreshold: 1 },
  { id: 'getting-organized', name: 'Getting Organized', description: 'Create 5 categories', icon: '🗂️', xpReward: 25, conditionType: 'CATEGORIES_CREATED', conditionThreshold: 5 },
  { id: 'week-warrior', name: 'Week Warrior', description: 'Log transactions on 7 different days', icon: '📅', xpReward: 25, conditionType: 'DAYS_LOGGED', conditionThreshold: 7 },
  { id: 'saver', name: 'Saver', description: 'Reach your first savings goal', icon: '💰', xpReward: 25, conditionType: 'SAVINGS_GOAL_REACHED', conditionThreshold: 1 },
  { id: 'big-saver', name: 'Big Saver', description: 'Save 1000 TND total', icon: '🏦', xpReward: 25, conditionType: 'TOTAL_SAVED', conditionThreshold: 1000 },
  { id: 'strong-will', name: 'Strong Will', description: 'Resist 3 wishlist items', icon: '💪', xpReward: 25, conditionType: 'WISHLIST_RESISTED', conditionThreshold: 3 },
  { id: 'bill-payer', name: 'Bill Payer', description: 'Log 5 recurring payments', icon: '🧾', xpReward: 25, conditionType: 'RECURRING_PAID', conditionThreshold: 5 },
];

const initialState: BadgesState = {
  all: BADGE_DEFINITIONS,
  unlocked: [],
};

const badgeSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    unlockBadge: (state, action: PayloadAction<UserBadge>) => {
      const alreadyUnlocked = state.unlocked.some((u) => u.badgeId === action.payload.badgeId);
      if (!alreadyUnlocked) {
        state.unlocked.push(action.payload);
      }
    },
    setUnlockedBadges: (state, action: PayloadAction<UserBadge[]>) => {
      state.unlocked = action.payload;
    },
  },
});

export const { unlockBadge, setUnlockedBadges } = badgeSlice.actions;
export default badgeSlice.reducer;