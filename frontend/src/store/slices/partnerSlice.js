import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api';

export const fetchAvailableFood = createAsyncThunk(
  'partner/fetchAvailableFood',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('food/all-listings/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch food');
    }
  }
);

export const fetchMyClaims = createAsyncThunk(
  'partner/fetchMyClaims',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('claims/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch claims');
    }
  }
);

export const claimFood = createAsyncThunk(
  'partner/claimFood',
  async (foodId, { rejectWithValue }) => {
    try {
      const response = await api.post('claims/', { food: foodId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ── Cancel a claim ────────────────────────────────────────────────────────────
// PATCH /api/claims/:id/cancel/
export const cancelClaim = createAsyncThunk(
  'partner/cancelClaim',
  async (claimId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`claims/${claimId}/cancel/`);
      return { claimId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const verifyPickup = createAsyncThunk(
  'partner/verifyPickup',
  async ({ claimId, code }, { rejectWithValue }) => {
    try {
      const response = await api.post(`claims/${claimId}/verify-pickup-code/`, {
        pickup_code: code,
      });
      return { claimId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const recordDistribution = createAsyncThunk(
  'partner/recordDistribution',
  async (distributionData, { rejectWithValue }) => {
    try {
      const response = await api.post('distribution/', distributionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchFoodDetails = createAsyncThunk(
  'partner/fetchFoodDetails',
  async (foodId, { getState, rejectWithValue }) => {
    try {
      const { availableFood } = getState().partner;
      const existing = availableFood.find(f => f.id === Number(foodId));
      if (existing) return existing;
      const response = await api.get('food/all-listings/');
      const found = response.data.find(f => f.id === Number(foodId));
      if (!found) throw new Error('Listing not found');
      return found;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Could not fetch details');
    }
  }
);

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    availableFood: [],
    myClaims:      [],
    currentFood:   null,
    loading:       false,
    claimLoading:  false,
    cancelLoading: false,
    error:         null,
    success:       false,
  },
  reducers: {
    resetPartnerStatus: (state) => {
      state.success = false;
      state.error   = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableFood.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAvailableFood.fulfilled, (state, action) => {
        state.loading       = false;
        state.availableFood = action.payload;
      })
      .addCase(fetchAvailableFood.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      .addCase(fetchMyClaims.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.loading  = false;
        state.myClaims = action.payload;
      })
      .addCase(fetchMyClaims.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      .addCase(fetchFoodDetails.pending,   (state) => { state.loading = true; state.currentFood = null; })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.loading     = false;
        state.currentFood = action.payload;
      })
      .addCase(fetchFoodDetails.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      .addCase(claimFood.pending,   (state) => { state.claimLoading = true; state.error = null; })
      .addCase(claimFood.fulfilled, (state, action) => {
        state.claimLoading = false;
        state.success      = true;
        state.myClaims     = [...state.myClaims, action.payload];
        if (state.currentFood) {
          state.currentFood = { ...state.currentFood, is_claimed: true };
        }
      })
      .addCase(claimFood.rejected, (state, action) => {
        state.claimLoading = false;
        state.error        = action.payload;
      })

      // Cancel claim — update the claim status locally so UI reflects immediately
      .addCase(cancelClaim.pending,   (state) => { state.cancelLoading = true; state.error = null; })
      .addCase(cancelClaim.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.myClaims = state.myClaims.map(c =>
          c.id === action.payload.claimId
            ? { ...c, status: 'cancelled' }
            : c
        );
      })
      .addCase(cancelClaim.rejected, (state, action) => {
        state.cancelLoading = false;
        state.error         = action.payload;
      })

      // verifyPickup — mark the claim as pickup_code_verified in local state
      .addCase(verifyPickup.fulfilled, (state, action) => {
        state.myClaims = state.myClaims.map(c =>
          c.id === action.payload.claimId
            ? { ...c, pickup_code_verified: true, status: 'picked_up' }
            : c
        );
      })

      .addCase(recordDistribution.fulfilled, (state) => { state.success = true; });
  },
});

export const { resetPartnerStatus } = partnerSlice.actions;
export default partnerSlice.reducer;
