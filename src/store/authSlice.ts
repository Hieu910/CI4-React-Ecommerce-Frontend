import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfile } from "@/services/api";
interface User {
  id: number;
  email: string;
  name: string;
  role: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const loadAuthFromStorage = (): AuthState => {
  try {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("auth_token");

    if (
      savedUser &&
      savedUser !== "undefined" &&
      savedToken &&
      savedToken !== "undefined"
    ) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && typeof parsedUser === "object") {
        return {
          user: parsedUser,
          accessToken: savedToken,
          isLoggedIn: true,
          isLoading: false,
        };
      }
    }
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    console.error("Error loading auth from storage:", error);
  }

  return {
    user: null,
    accessToken: null,
    isLoggedIn: false,
    isLoading: false,
  };
};

export const updateProfileAsync = createAsyncThunk(
  "cart/addToCart",
  async (payload: { name: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateUserProfile(payload.name);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user profile");
    }
  }
);

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; access_token: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.isLoggedIn = true;
      state.isLoading = false;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("auth_token", action.payload.access_token);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    });
    builder.addCase(updateProfileAsync.fulfilled, (state, action) => {
      if (state.user) {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    });
  },
});

export const { login, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
