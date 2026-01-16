import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/mockData";

interface CompareState {
  products: Product[];
}

const initialState: CompareState = {
  products: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    toggleCompare: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const isSelected = state.products.some((p) => p.id === product.id);

      if (!isSelected) {
        if (state.products.length < 2) {
          state.products.push(product);
        }
      } else {
        const index = state.products.findIndex((p) => p.id === product.id);
        state.products.splice(index, 1);
      }
    },

    removeFromCompare: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.products.splice(
        state.products.findIndex((p) => p.id === productId),
        1
      );
    },

    clearCompare: (state) => {
      state.products = [];
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
