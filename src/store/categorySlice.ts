import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCategories } from "@/services/api";

interface Category {
  id: number;
  name: string;
  code: string;
}

interface CategoryState {
  categories: Category[];
  hasFetched: boolean;
}

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

const initialState: CategoryState = {
  categories: [],
  hasFetched: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCategory.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.hasFetched = true;
          state.categories = action.payload.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.code,
          }));
        }
      )
      .addCase(fetchCategory.rejected, (state, action) => {
        state.hasFetched = true; 
      });
  },
});

export const {} = categorySlice.actions;
export default categorySlice.reducer;
