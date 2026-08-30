import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoriesReducer from '../features/categories/categorySlice';
import transactionsReducer from '../features/transactions/transactionSlice';
import recurringReducer from '../features/recurring/recurringSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
    wishlist: wishlistReducer,
    recurring: recurringReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import wishlistReducer from '../features/wishlist/wishlistSlice';