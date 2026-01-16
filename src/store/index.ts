import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import compareReducer from "./compareSlice";
import orderReducer from "./orderSlice";
import categoryReducer from "./categorySlice";

// ============================
// REDUX STORE - Main store configuration
// ============================

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    compare: compareReducer,
    order: orderReducer,
    category: categoryReducer,
  },
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
