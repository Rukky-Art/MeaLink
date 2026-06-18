import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api'; // Use your custom api instance!



export const fetchAllListings = createAsyncThunk(
  'food/fetchAllListings',
  async (coords, { rejectWithValue }) => {
    try {
      // Build search params conditionally if coordinates exist
      const params = {};
      if (coords?.latitude && coords?.longitude) {
        params.latitude = coords.latitude;
        params.longitude = coords.longitude;
      }

      // FIXED: Swapped 'axiosInstance' out for your imported 'api'
      const response = await api.get('food/all-listings/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listings');
    }
  }
);


export const fetchMyListings = createAsyncThunk(
  'food/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      // Your interceptor handles the Bearer token automatically now!
      const response = await api.get('food/my-listings/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch your listings");
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    listings: [],
    myListings: [], // Crucial: Initialize as empty array to prevent .length crash
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllListings.pending, (state) => { state.loading = true; })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      // Fetch My Listings
      .addCase(fetchMyListings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload; // Store separately
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default foodSlice.reducer;