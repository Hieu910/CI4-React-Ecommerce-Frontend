import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCart, saveCartItem, deleteCartItem } from "@/services/api";
import { CartItem, CartResponse } from "@/data/mockData";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  isLoading: false,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (
    payload: { variant_id: number; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await saveCartItem(payload.variant_id, payload.quantity);
      dispatch(fetchCart());
      return payload;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  },
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async (
    payload: { variant_id: number; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await saveCartItem(payload.variant_id, payload.quantity);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update quantity");
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (cartId: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteCartItem(cartId);
      dispatch(fetchCart());
      return cartId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },

    updateQuantityLocal: (
      state,
      action: PayloadAction<{ cartId: number; quantity: number }>,
    ) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((item) => item.cart_id === cartId);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartResponse>) => {
          state.isLoading = false;
          state.items = action.payload.items.map((item) => ({
            cart_id: item.cart_id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            name: item.name,
            image_url: item.image_url,
            size: item.size,
            color: item.color,
            price: item.price,
          }));
          state.totalAmount = action.payload.total_amount;
        },
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
      });

    builder.addCase(addToCartAsync.pending, (state) => {});

    builder
      .addCase(updateQuantityAsync.pending, (state) => {})
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const { variant_id, quantity } = action.payload;
        const cartItem = state.items.find(
          (item) => item.variant_id === variant_id,
        );
        if (cartItem) {
          cartItem.quantity = quantity;
          state.totalAmount = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
        }
      });

    builder
      .addCase(removeFromCartAsync.pending, (state) => {})
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const cartId = action.payload;
        state.items = state.items.filter((item) => item.cart_id !== cartId);
      });
  },
});

export const { clearCart, updateQuantityLocal } = cartSlice.actions;
export default cartSlice.reducer;
