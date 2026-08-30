import React from "react";
import { usePersistedSlice } from "../hooks/usePersistedSlice";
import { setCategories } from "../features/categories/categorySlice";
import { setTransactions } from "../features/transactions/transactionSlice";
import { RootState } from "../store";
import { setWishlistItems } from "../features/wishlist/wishlistSlice";
import { setRecurring } from "../features/recurring/recurringSlice";

export const PersistenceGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePersistedSlice("@stouchi/categories", (state: RootState) => state.categories.items, setCategories);
  usePersistedSlice("@stouchi/transactions", (state: RootState) => state.transactions.items, setTransactions);
  usePersistedSlice("@stouchi/wishlist", (state: RootState) => state.wishlist.items, setWishlistItems);
  usePersistedSlice("@stouchi/recurring", (state: RootState) => state.recurring.items, setRecurring);


  return <>{children}</>;
};