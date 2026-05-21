import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api'; 

// 1. Define the Async Thunk for fetching all listings
export const fetchAllListings = createAsyncThunk(
  'food/fetchAllListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('food/all-listings/');
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch listings");
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    listings: [],
    loading: false,
    error: null,
  },
  reducers: {}, // We don't need manual reducers yet
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default foodSlice.reducer;