import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api'; // Use your existing axios instance

// 1. Thunk to post a new donation
export const createDonation = createAsyncThunk(
  'donor/createDonation',
  async (donationData, thunkAPI) => {
    try {
      const response = await api.post('food/my-listings/', donationData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to create donation");
    }
  }
);

// 2. Thunk to get only the donations created by THIS donor
export const fetchMyDonations = createAsyncThunk(
  'donor/fetchMyDonations',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('food/my-listings/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch your donations");
    }
  }
);

const donorSlice = createSlice({
  name: 'donor',
  initialState: {
    myDonations: [],
    isLoading: false,
    error: null,
    success: false, // Useful for showing "Donation Posted!" alerts
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Creating
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.myDonations.unshift(action.payload); // Add new donation to top of list
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle Fetching
      .addCase(fetchMyDonations.fulfilled, (state, action) => {
        state.myDonations = action.payload;
      });
  },
});

export const { resetStatus } = donorSlice.actions;
export default donorSlice.reducer;