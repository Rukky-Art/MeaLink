// import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
// import api from '../../auth/api';

// const EMPTY_ARRAY = [];

// // ── Thunks ───────────────────────────────────────────────────────────────────
// export const fetchAvailableFood = createAsyncThunk(
//   'partner/fetchAvailableFood',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('food/all-listings/');
//       return response.data ?? EMPTY_ARRAY;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Could not fetch food');
//     }
//   }
// );

// export const fetchMyClaims = createAsyncThunk(
//   'partner/fetchMyClaims',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('claims/');
//       return response.data ?? EMPTY_ARRAY;
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

// export const cancelClaim = createAsyncThunk(
//   'partner/cancelClaim',
//   async (claimId, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`claims/${claimId}/cancel/`);
//       return { claimId, data: response.data };
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
//       return { claimId, data: response.data };
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

// // ── Slice ────────────────────────────────────────────────────────────────────
// const partnerSlice = createSlice({
//   name: 'partner',
//   initialState: {
//     availableFood:       EMPTY_ARRAY, // Main global inventory listings
//     myClaims:            EMPTY_ARRAY, // Current active/completed claims
//     searchQuery:         '',          // For searching listings/claims
//     categoryFilter:      'all',       // e.g., 'all', 'Surplus', 'Perishable'
//     isLoading:           false,       // Loading state for primary listing arrays
//     isActionLoading:     false,       // Separate loader for claim/cancel/verify mutations
//     error:               null,
//     actionError:         null,
//     success:             false,
//   },
//   reducers: {
//     setSearchQuery:     (state, action) => { state.searchQuery = action.payload; },
//     setCategoryFilter:  (state, action) => { state.categoryFilter = action.payload; },
//     resetPartnerStatus: (state) => {
//       state.success     = false;
//       state.error       = null;
//       state.actionError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ── fetchAvailableFood ──
//       .addCase(fetchAvailableFood.pending, (state) => {
//         state.isLoading = true;
//         state.error     = null;
//       })
//       .addCase(fetchAvailableFood.fulfilled, (state, action) => {
//         state.isLoading     = false;
//         state.availableFood = action.payload;
//       })
//       .addCase(fetchAvailableFood.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error     = action.payload;
//       })

//       // ── fetchMyClaims ──
//       .addCase(fetchMyClaims.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchMyClaims.fulfilled, (state, action) => {
//         state.isLoading = false;
//         // Clean data synchronization: Store only functional, active/completed claims
//         state.myClaims  = action.payload.filter(claim => claim.status !== 'cancelled');
//       })
//       .addCase(fetchMyClaims.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error     = action.payload;
//       })

//       // ── claimFood ──
//       .addCase(claimFood.pending, (state) => {
//         state.isActionLoading = true;
//         state.actionError     = null;
//       })
//       .addCase(claimFood.fulfilled, (state, action) => {
//         state.isActionLoading = false;
//         state.success         = true;
        
//         // 1. Instantly append new claim record locally
//         state.myClaims.push(action.payload);
        
//         // 2. Synchronize listing inventory state immediately without refetching
//         const claimedFoodId = action.payload.food?.id || action.payload.food;
//         const foodItem = state.availableFood.find(f => f.id === claimedFoodId);
//         if (foodItem) foodItem.is_claimed = true;
//       })
//       .addCase(claimFood.rejected, (state, action) => {
//         state.isActionLoading = false;
//         state.actionError     = action.payload;
//       })

//       // ── cancelClaim ──
//       .addCase(cancelClaim.pending, (state) => {
//         state.isActionLoading = true;
//         state.actionError     = null;
//       })
//       .addCase(cancelClaim.fulfilled, (state, action) => {
//         state.isActionLoading = false;
        
//         // 1. Locate food item reference associated with targeted claim 
//         const targetClaim = state.myClaims.find(c => c.id === action.payload.claimId);
//         const foodId = targetClaim ? (targetClaim.food?.id || targetClaim.food) : null;

//         // 2. Proactively drop the record out of the active slice array
//         state.myClaims = state.myClaims.filter(c => c.id !== action.payload.claimId);

//         // 3. Mark food item as immediately public and available again
//         if (foodId) {
//           const foodItem = state.availableFood.find(f => f.id === foodId);
//           if (foodItem) foodItem.is_claimed = false;
//         }
//       })
//       .addCase(cancelClaim.rejected, (state, action) => {
//         state.isActionLoading = false;
//         state.actionError     = action.payload;
//       })

//       // ── verifyPickup ──
//       .addCase(verifyPickup.fulfilled, (state, action) => {
//         state.myClaims = state.myClaims.map(c =>
//           c.id === action.payload.claimId
//             ? { ...c, pickup_code_verified: true, status: 'picked_up' }
//             : c
//         );
//       })

//       // ── recordDistribution ──
//       .addCase(recordDistribution.fulfilled, (state, action) => {
//   state.success = true;

//   const distribution = action.payload;

//   state.myClaims = state.myClaims.map(claim =>
//     claim.id === distribution.claim
//       ? {
//           ...claim,
//           distribution,
//           status: 'distributed',
//         }
//       : claim
//   );
// })
//   },
// });

// export const {
//   setSearchQuery,
//   setCategoryFilter,
//   resetPartnerStatus,
// } = partnerSlice.actions;

// // ── Memoized & Normalized Selectors ──────────────────────────────────────────
// export const selectAvailableFood   = state => state.partner?.availableFood ?? EMPTY_ARRAY;
// export const selectMyClaims         = state => state.partner?.myClaims      ?? EMPTY_ARRAY;
// export const selectSearchQuery      = state => state.partner?.searchQuery   ?? '';
// export const selectCategoryFilter   = state => state.partner?.categoryFilter ?? 'all';
// export const selectIsLoading        = state => state.partner?.isLoading     ?? false;
// export const selectIsActionLoading  = state => state.partner?.isActionLoading ?? false;
// export const selectPartnerError     = state => state.partner?.error         ?? null;
// export const selectActionError      = state => state.partner?.actionError   ?? null;
// export const selectPartnerSuccess   = state => state.partner?.success       ?? false;

// /**
//  * Advanced Selector: Computes visible food listings based on query search parameters 
//  * and specific item category criteria filters. Memoized to avoid recalculation loops.
//  */
// export const selectVisibleFood = createSelector(
//   [selectAvailableFood, selectSearchQuery, selectCategoryFilter],
//   (availableFood, searchQuery, categoryFilter) => {
//     let result = availableFood;

//     // Filter by text search query matching food layout details
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(f => 
//         f.food_type?.toLowerCase().includes(query) || 
//         f.pickup_address?.toLowerCase().includes(query)
//       );
//     }

//     // Filter by custom category drops
//     if (categoryFilter !== 'all') {
//       result = result.filter(f => f.category === categoryFilter);
//     }

//     return result;
//   }
// );

// /**
//  * Operational Metrics Selectors
//  */
// export const selectAvailableCount = createSelector(
//   [selectAvailableFood], 
//   (food) => food.filter(f => !f.is_claimed).length
// );

// export const selectMyClaimsCount = createSelector(
//   [selectMyClaims], 
//   (claims) => claims.length
// );

// export default partnerSlice.reducer;

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../auth/api';

const EMPTY_ARRAY = [];

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchAvailableFood = createAsyncThunk(
  'partner/fetchAvailableFood',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('food/all-listings/');
      return response.data ?? EMPTY_ARRAY;
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
      return response.data ?? EMPTY_ARRAY;
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

// ── ADDED: fetchFoodDetails ───────────────────────────────────────────────────
// Checks foodCache first (survives after food is claimed and leaves all-listings/)
// then availableFood, then falls back to a fresh API call.
export const fetchFoodDetails = createAsyncThunk(
  'partner/fetchFoodDetails',
  async (foodId, { getState, rejectWithValue }) => {
    try {
      const { availableFood, foodCache } = getState().partner;
      const id     = Number(foodId);
      const cached = foodCache.find(f => f.id === id) ||
                     availableFood.find(f => f.id === id);
      if (cached) return cached;
      const response = await api.get('food/all-listings/');
      const found = response.data.find(f => f.id === id);
      if (!found) throw new Error('Listing not found');
      return found;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    availableFood:    EMPTY_ARRAY,
    myClaims:         EMPTY_ARRAY,
    searchQuery:      '',
    categoryFilter:   'all',
    isLoading:        false,
    isActionLoading:  false,
    error:            null,
    actionError:      null,
    success:          false,

    // ADDED: persists food details even after food disappears from all-listings/
    foodCache:        EMPTY_ARRAY,
    currentFood:      null,
  },
  reducers: {
    setSearchQuery:     (state, action) => { state.searchQuery    = action.payload; },
    setCategoryFilter:  (state, action) => { state.categoryFilter = action.payload; },
    resetPartnerStatus: (state) => {
      state.success     = false;
      state.error       = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // fetchAvailableFood
      .addCase(fetchAvailableFood.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAvailableFood.fulfilled, (state, action) => {
        state.isLoading     = false;
        state.availableFood = action.payload;
        // Merge into foodCache so details survive after food is claimed
        const map = new Map(state.foodCache.map(f => [f.id, f]));
        action.payload.forEach(food => map.set(food.id, food));
        state.foodCache = Array.from(map.values());
      })
      .addCase(fetchAvailableFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // fetchMyClaims — store ALL claims, selectors handle filtering
      .addCase(fetchMyClaims.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myClaims  = action.payload;
      })
      .addCase(fetchMyClaims.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // fetchFoodDetails
      .addCase(fetchFoodDetails.pending, (state) => {
        state.isLoading   = true;
        state.currentFood = null;
      })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.currentFood = action.payload;
        // Also cache it
        const map = new Map(state.foodCache.map(f => [f.id, f]));
        map.set(action.payload.id, action.payload);
        state.foodCache = Array.from(map.values());
      })
      .addCase(fetchFoodDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // claimFood
      .addCase(claimFood.pending, (state) => {
        state.isActionLoading = true;
        state.actionError     = null;
      })
      .addCase(claimFood.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.success         = true;
        state.myClaims.push(action.payload);
        const claimedFoodId = action.payload.food?.id ?? action.payload.food;
        const foodItem = state.availableFood.find(f => f.id === claimedFoodId);
        if (foodItem) foodItem.is_claimed = true;
      })
      .addCase(claimFood.rejected, (state, action) => {
        state.isActionLoading = false;
        state.actionError     = action.payload;
      })

      // cancelClaim
      .addCase(cancelClaim.pending, (state) => {
        state.isActionLoading = true;
        state.actionError     = null;
      })
      // .addCase(cancelClaim.fulfilled, (state, action) => {
      //   state.isActionLoading = false;
      //   const targetClaim = state.myClaims.find(c => c.id === action.payload.claimId);
      //   const foodId = targetClaim
      //     ? (targetClaim.food?.id ?? targetClaim.food)
      //     : null;
      //   // Mark as cancelled — keep in list for history
      //   state.myClaims = state.myClaims.map(c =>
      //     c.id === action.payload.claimId ? { ...c, status: 'cancelled' } : c
      //   );
      //   // Release food back to available
      //   if (foodId) {
      //     const foodItem = state.availableFood.find(f => f.id === foodId);
      //     if (foodItem) foodItem.is_claimed = false;
      //   }
      // })
      .addCase(cancelClaim.fulfilled, (state, action) => {
  state.isActionLoading = false;
  
  // 1. Extract the claim ID directly from action.payload.id
  const canceledClaimId = action.payload?.id;
  
  // 2. Extract the nested food ID safely from action.payload.food.id
  const foodId = action.payload?.food?.id || action.payload?.food;

  // 3. Update the claim status in your history list
  if (canceledClaimId) {
    state.myClaims = state.myClaims.map(c =>
      c.id === canceledClaimId ? { ...c, status: 'cancelled' } : c
    );
  }

  // 4. Immutably release the food back to "Available" 
  if (foodId) {
    state.availableFood = state.availableFood.map(food => 
      Number(food.id) === Number(foodId) 
        ? { ...food, is_claimed: false } 
        : food
    );
  }
})
      .addCase(cancelClaim.rejected, (state, action) => {
        state.isActionLoading = false;
        state.actionError     = action.payload;
      })

      // verifyPickup
      .addCase(verifyPickup.fulfilled, (state, action) => {
        state.myClaims = state.myClaims.map(c =>
          c.id === action.payload.claimId
            ? { ...c, pickup_code_verified: true, status: 'picked_up' }
            : c
        );
      })

      // recordDistribution
      .addCase(recordDistribution.fulfilled, (state, action) => {
        state.success = true;
        const dist    = action.payload;
        state.myClaims = state.myClaims.map(c =>
          c.id === dist.claim
            ? { ...c, distribution: dist, status: 'distributed' }
            : c
        );
      })
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  resetPartnerStatus,
} = partnerSlice.actions;

// ── Selectors (all original names preserved) ──────────────────────────────────

export const selectAvailableFood  = state => state.partner?.availableFood  ?? EMPTY_ARRAY;
export const selectMyClaims       = state => state.partner?.myClaims       ?? EMPTY_ARRAY;
export const selectSearchQuery    = state => state.partner?.searchQuery    ?? '';
export const selectCategoryFilter = state => state.partner?.categoryFilter ?? 'all';
export const selectIsLoading      = state => state.partner?.isLoading      ?? false;
export const selectIsActionLoading= state => state.partner?.isActionLoading ?? false;
export const selectPartnerError   = state => state.partner?.error          ?? null;
export const selectActionError    = state => state.partner?.actionError    ?? null;
export const selectPartnerSuccess = state => state.partner?.success        ?? false;

// ADDED selectors

// Active claims — everything except cancelled
export const selectActiveClaims = createSelector(
  [selectMyClaims],
  claims => claims.filter(c => c.status !== 'cancelled')
);

// Cancelled claims — for history section
export const selectCancelledClaims = createSelector(
  [selectMyClaims],
  claims => claims.filter(c => c.status === 'cancelled')
);

// isMyClaim — only active (non-cancelled) claims count
// Fixes: cancelled claims still showing "Claimed by you" on food cards
export const selectActiveMyClaims = createSelector(
  [selectMyClaims],
  claims => claims.filter(c => c.status !== 'cancelled')
);

// Helper used in components: read food details from nested claim.food
// Backend now returns claim.food as a full object, not just an ID
export const selectFoodFromClaim = (claim) => {
  if (!claim) return null;
  if (claim.food && typeof claim.food === 'object' && claim.food.food_type) {
    return claim.food;
  }
  return null;
};

// Existing selectors — unchanged
export const selectVisibleFood = createSelector(
  [selectAvailableFood, selectSearchQuery, selectCategoryFilter],
  (availableFood, searchQuery, categoryFilter) => {
    let result = availableFood;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.food_type?.toLowerCase().includes(query) ||
        f.pickup_address?.toLowerCase().includes(query)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter(f => f.category === categoryFilter);
    }
    return result;
  }
);

export const selectAvailableCount = createSelector(
  [selectAvailableFood],
  food => food.filter(f => !f.is_claimed).length
);

export const selectMyClaimsCount = createSelector(
  [selectActiveClaims],
  claims => claims.length
);

export default partnerSlice.reducer;
