import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createOrder,
  getUserOrders,
  getAdminOrders,
  updateOrderStatus,
} from "@/services/api";

import { Order } from "@/data/mockData";

interface OrderState {
  isLoading: boolean;
  hasUserFetched: boolean;
  hasAdminFetched: boolean;
  userOrders: Order[];
  adminOrders: Order[];
}

const initialState: OrderState = {
  isLoading: false,
  hasUserFetched: false,
  hasAdminFetched: false,
  userOrders: [],
  adminOrders: [],
};

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "order/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateAdminOrders",
  async (payload: { id: number; status: number }, { rejectWithValue }) => {
    try {
      await updateOrderStatus(payload.id, payload.status);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const addOrderAsync = createAsyncThunk(
  "order/addOrder",
  async (_, { rejectWithValue }) => {
    try {
      await createOrder();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to confirm order");
    }
  }
);

const statusLabels = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.userOrders = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addOrderAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addOrderAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addOrderAsync.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAdminOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.adminOrders = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrders = state.adminOrders.map((order) => {
          if (order.id === action.payload.id) {
            return {
              ...order,
              status_code: action.payload.status,
              status_label: statusLabels[action.payload.status],
            };
          }
          return order;
        });
      });
  },
});

export const {} = orderSlice.actions;
export default orderSlice.reducer;
