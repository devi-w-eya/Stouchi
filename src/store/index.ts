import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoriesReducer from '../features/categories/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;