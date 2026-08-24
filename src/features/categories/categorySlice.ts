import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CategoryType = 'INCOME' | 'EXPENSE';

export type Category = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  budgetAmount: number;
  savingsGoal: number;
  currentSaved: number;
  monthlyContribution: number;
  createdAt: string;
};

type CategoriesState = {
  items: Category[];
};

const initialState: CategoriesState = {
  items: [],
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    editCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addCategory, editCategory, deleteCategory, setCategories } = categorySlice.actions;
export default categorySlice.reducer;