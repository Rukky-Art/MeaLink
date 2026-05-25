// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../auth/api';


// export const fetchAvailableFood = createAsyncThunk(
//   'partner/fetchAvailableFood',
//   async (_, { rejectWithValue }) => {
//     try {
//       // The backend uses 'request.user', so our 'api.js' 
//       // will automatically send the JWT token needed for the filtering.
//       const response = await api.get('food/all-listings/'); 
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Could not fetch food");
//     }
//   }
// );

// // 2. Claim food
// export const claimFood = createAsyncThunk(
//   'partner/claimFood',
//   async (foodId, { rejectWithValue }) => {
//     try {
//       const response = await api.post('claims/', { food: foodId });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// // 3. Verify Pickup Code (The 4-character code)
// export const verifyPickup = createAsyncThunk(
//   'partner/verifyPickup',
//   async ({ claimId, code }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`claims/${claimId}/verify-pickup-code/`, { 
//         pickup_code: code 
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// // 4. Record a Distribution
// export const recordDistribution = createAsyncThunk(
//   'partner/recordDistribution',
//   async (distributionData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('distribution/', distributionData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );
// // 5. Fetch single food detail
// export const fetchFoodDetails = createAsyncThunk(
//   'partner/fetchFoodDetails',
//   async (foodId, { rejectWithValue }) => {
//     try {
//       // Assuming your endpoint follows standard REST: food/all-listings/ID/
//       const response = await api.get(`food/all-listings/${foodId}/`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Could not fetch details");
//     }
//   }
// );

// const partnerSlice = createSlice({
//   name: 'partner',
//   initialState: {
//     availableFood: [],
//     myClaims: [],
//     currentFood: null,
//     claimLoading: false,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     resetPartnerStatus: (state) => {
//       state.success = false;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Available Food
//       .addCase(fetchAvailableFood.pending, (state) => { state.loading = true; })
//       .addCase(fetchAvailableFood.fulfilled, (state, action) => {
//         state.loading = false;
//         state.availableFood = action.payload;
//       })
//       .addCase(fetchFoodDetails.pending, (state) => {
//         state.loading = true;
//         state.currentFood = null; // Clear previous data
//       })
//       .addCase(fetchFoodDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentFood = action.payload;
//       })
//       .addCase(fetchFoodDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Claiming
//       .addCase(claimFood.fulfilled, (state) => {
//         state.success = true;
//         // Optionally move the food item from 'available' to 'myClaims'
//       })
//       .addCase(recordDistribution.fulfilled, (state) => {
//         state.success = true;
//       });
//   }
// });

// export const { resetPartnerStatus } = partnerSlice.actions;
// export default partnerSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../auth/api';

// export const fetchAvailableFood = createAsyncThunk(
//   'partner/fetchAvailableFood',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('food/all-listings/');
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Could not fetch food');
//     }
//   }
// );

// // ── NEW: fetch only THIS user's claims from the backend ──────────────────────
// // Hits your claims endpoint which returns only claims belonging to the
// // authenticated user (the backend filters by request.user automatically).
// export const fetchMyClaims = createAsyncThunk(
//   'partner/fetchMyClaims',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('claims/');
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Could not fetch claims');
//     }
//   }
// );

// export const claimFood = createAsyncThunk(
//   'partner/claimFood',
//   async (foodId, { rejectWithValue }) => {
//     try {
//       const response = await api.post('claims/', { food: foodId });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// export const verifyPickup = createAsyncThunk(
//   'partner/verifyPickup',
//   async ({ claimId, code }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`claims/${claimId}/verify-pickup-code/`, {
//         pickup_code: code,
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// export const recordDistribution = createAsyncThunk(
//   'partner/recordDistribution',
//   async (distributionData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('distribution/', distributionData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// export const fetchFoodDetails = createAsyncThunk(
//   'partner/fetchFoodDetails',
//   async (foodId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`food/all-listings/${foodId}/`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Could not fetch details');
//     }
//   }
// );

// const partnerSlice = createSlice({
//   name: 'partner',
//   initialState: {
//     availableFood: [],
//     myClaims:      [],      // ← real claims from the backend, not a filter
//     currentFood:   null,
//     loading:       false,
//     claimLoading:  false,
//     error:         null,
//     success:       false,
//   },
//   reducers: {
//     resetPartnerStatus: (state) => {
//       state.success = false;
//       state.error   = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Available food
//       .addCase(fetchAvailableFood.pending,   (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchAvailableFood.fulfilled, (state, action) => {
//         state.loading      = false;
//         state.availableFood = action.payload;
//       })
//       .addCase(fetchAvailableFood.rejected,  (state, action) => {
//         state.loading = false;
//         state.error   = action.payload;
//       })

//       // My claims — separate list, drives the stat card count
//       .addCase(fetchMyClaims.pending,   (state) => { state.loading = true; })
//       .addCase(fetchMyClaims.fulfilled, (state, action) => {
//         state.loading   = false;
//         state.myClaims  = action.payload;
//       })
//       .addCase(fetchMyClaims.rejected,  (state, action) => {
//         state.loading = false;
//         state.error   = action.payload;
//       })

//       // Food detail
//       .addCase(fetchFoodDetails.pending,   (state) => { state.loading = true; state.currentFood = null; })
//       .addCase(fetchFoodDetails.fulfilled, (state, action) => {
//         state.loading     = false;
//         state.currentFood = action.payload;
//       })
//       .addCase(fetchFoodDetails.rejected,  (state, action) => {
//         state.loading = false;
//         state.error   = action.payload;
//       })

//       // Claim food — on success, add to myClaims immediately so count updates
//       // without needing a refetch
//       .addCase(claimFood.pending,   (state) => { state.claimLoading = true; state.error = null; })
//       .addCase(claimFood.fulfilled, (state, action) => {
//         state.claimLoading = false;
//         state.success      = true;
//         // Optimistically add the new claim to the list so the stat card
//         // reflects it right away without waiting for a fetchMyClaims refetch
//         state.myClaims = [...state.myClaims, action.payload];
//       })
//       .addCase(claimFood.rejected,  (state, action) => {
//         state.claimLoading = false;
//         state.error        = action.payload;
//       })

//       .addCase(recordDistribution.fulfilled, (state) => { state.success = true; });
//   },
// });

// export const { resetPartnerStatus } = partnerSlice.actions;
// export default partnerSlice.reducer;


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

export const verifyPickup = createAsyncThunk(
  'partner/verifyPickup',
  async ({ claimId, code }, { rejectWithValue }) => {
    try {
      const response = await api.post(`claims/${claimId}/verify-pickup-code/`, { pickup_code: code });
      return response.data;
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

// ── NO separate fetchFoodDetails thunk needed ─────────────────────────────────
// The API has no GET /food/all-listings/:id/ endpoint for partners.
// We find the food item by ID from the already-fetched availableFood list in Redux.
// If the list isn't loaded yet, we fetch all listings and find from there.
export const fetchFoodDetails = createAsyncThunk(
  'partner/fetchFoodDetails',
  async (foodId, { getState, rejectWithValue }) => {
    try {
      // First check if we already have it in state — avoid unnecessary API call
      const { availableFood } = getState().partner;
      const existing = availableFood.find((f) => f.id === Number(foodId));
      if (existing) return existing;

      // Not in state yet — fetch the full list and find it
      const response = await api.get('food/all-listings/');
      const found = response.data.find((f) => f.id === Number(foodId));
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
      // Available food
      .addCase(fetchAvailableFood.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAvailableFood.fulfilled, (state, action) => {
        state.loading       = false;
        state.availableFood = action.payload;
      })
      .addCase(fetchAvailableFood.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // My claims
      .addCase(fetchMyClaims.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.loading  = false;
        state.myClaims = action.payload;
      })
      .addCase(fetchMyClaims.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // Food detail — finds from list, no 404 risk
      .addCase(fetchFoodDetails.pending,   (state) => { state.loading = true; state.currentFood = null; })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.loading     = false;
        state.currentFood = action.payload;
      })
      .addCase(fetchFoodDetails.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // Claim food
      .addCase(claimFood.pending,   (state) => { state.claimLoading = true; state.error = null; })
      .addCase(claimFood.fulfilled, (state, action) => {
        state.claimLoading = false;
        state.success      = true;
        state.myClaims     = [...state.myClaims, action.payload];
        // Mark the food as claimed in the local list too
        if (state.currentFood) {
          state.currentFood = { ...state.currentFood, is_claimed: true };
        }
      })
      .addCase(claimFood.rejected,  (state, action) => {
        state.claimLoading = false;
        state.error        = action.payload;
      })

      .addCase(recordDistribution.fulfilled, (state) => { state.success = true; });
  },
});

export const { resetPartnerStatus } = partnerSlice.actions;
export default partnerSlice.reducer;
