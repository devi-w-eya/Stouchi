import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export type RecurringExpense = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  frequency: Frequency;
  customDays: number | null;
  nextDueDate: string;
  lastPaidAt: string | null;
  reminderDaysBefore: number;
  createdAt: string;
};

type RecurringState = {
  items: RecurringExpense[];
};

const initialState: RecurringState = {
  items: [],
};

const recurringSlice = createSlice({
  name: 'recurring',
  initialState,
  reducers: {
    addRecurring: (state, action: PayloadAction<RecurringExpense>) => {
      state.items.push(action.payload);
    },
    updateRecurring: (state, action: PayloadAction<RecurringExpense>) => {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteRecurring: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
    setRecurring: (state, action: PayloadAction<RecurringExpense[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addRecurring, updateRecurring, deleteRecurring, setRecurring } = recurringSlice.actions;
export default recurringSlice.reducer;