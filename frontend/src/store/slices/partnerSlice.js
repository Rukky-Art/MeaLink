import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api';


export const fetchAvailableFood = createAsyncThunk(
  'partner/fetchAvailableFood',
  async (_, { rejectWithValue }) => {
    try {
      // The backend uses 'request.user', so our 'api.js' 
      // will automatically send the JWT token needed for the filtering.
      const response = await api.get('food/all-listings/'); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Could not fetch food");
    }
  }
);

// 2. Claim food
export const claimFood = createAsyncThunk(
  'partner/claimFood',
  async (foodId, { rejectWithValue }) => {
    try {
      const response = await api.post('claims/', { food: foodId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 3. Verify Pickup Code (The 4-character code)
export const verifyPickup = createAsyncThunk(
  'partner/verifyPickup',
  async ({ claimId, code }, { rejectWithValue }) => {
    try {
      const response = await api.post(`claims/${claimId}/verify-pickup-code/`, { 
        pickup_code: code 
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 4. Record a Distribution
export const recordDistribution = createAsyncThunk(
  'partner/recordDistribution',
  async (distributionData, { rejectWithValue }) => {
    try {
      const response = await api.post('distribution/', distributionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    availableFood: [],
    myClaims: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPartnerStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Available Food
      .addCase(fetchAvailableFood.pending, (state) => { state.loading = true; })
      .addCase(fetchAvailableFood.fulfilled, (state, action) => {
        state.loading = false;
        state.availableFood = action.payload;
      })
      // Claiming
      .addCase(claimFood.fulfilled, (state) => {
        state.success = true;
        // Optionally move the food item from 'available' to 'myClaims'
      })
      .addCase(recordDistribution.fulfilled, (state) => {
        state.success = true;
      });
  }
});

export const { resetPartnerStatus } = partnerSlice.actions;
export default partnerSlice.reducer;