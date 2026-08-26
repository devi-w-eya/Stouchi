import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'SAVINGS_DEPOSIT' | 'SAVINGS_WITHDRAWAL';
export type PaidFrom = 'BUDGET' | 'SAVINGS' | null;

export type Transaction = {
  id: string;
  userId: string;
  categoryId: string;
  type: TransactionType;
  paidFrom: PaidFrom;
  amount: number; // negative for money leaving, positive for money entering
  date: string;
  note: string | null;
  receiptImagePath: string | null;
  createdAt: string;
};

type TransactionsState = {
  items: Transaction[];
};

const initialState: TransactionsState = {
  items: [],
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.push(action.payload);
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addTransaction, deleteTransaction, setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;