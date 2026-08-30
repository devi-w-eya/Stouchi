import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WishlistStatus = 'PLANNED' | 'HESITATING' | 'BOUGHT' | 'RESISTED';

export type WishlistItem = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  price: number;
  status: WishlistStatus;
  timerDurationMinutes: number | null;
  timerStartedAt: string | null;
  note: string | null;
  createdAt: string;
};

type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      state.items.push(action.payload);
    },
    updateWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteWishlistItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addWishlistItem, updateWishlistItem, deleteWishlistItem, setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;