// import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
// import api from '../../auth/api';

// const EMPTY_ARRAY = [];

// export const fetchAvailableFood = createAsyncThunk(
//   'partner/fetchAvailableFood', 
//   async (coords, { rejectWithValue }) => {
//     try {
//       const params = {};
      

//       if (
//   Number.isFinite(coords?.latitude) &&
//   Number.isFinite(coords?.longitude)
// ) {
//   params.latitude = coords.latitude;
//   params.longitude = coords.longitude;
// }
      
//       const response = await api.get('food/all-listings/', { params });
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
//       // Return claimId alongside data so reducer can reliably find the claim
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

// export const fetchFoodDetails = createAsyncThunk(
//   'partner/fetchFoodDetails',
//   async (foodId, { getState, rejectWithValue }) => {
//     try {
//       const { availableFood, foodCache } = getState().partner;
//       const id     = Number(foodId);
//       const cached = foodCache.find(f => f.id === id) ||
//                      availableFood.find(f => f.id === id);
//       if (cached) return cached;
//       const response = await api.get('food/all-listings/');
//       const found    = response.data.find(f => f.id === id);
//       if (!found) throw new Error('Listing not found');
//       return found;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // ── Slice ─────────────────────────────────────────────────────────────────────

// const partnerSlice = createSlice({
//   name: 'partner',
//   initialState: {
//     availableFood:   EMPTY_ARRAY,
//     myClaims:        EMPTY_ARRAY,
//     foodCache:       EMPTY_ARRAY,
//     currentFood:     null,
//     searchQuery:     '',
//     categoryFilter:  'all',
//     isLoading:       false,
//     isActionLoading: false,
//     error:       null,
//     actionError: null,
//     success:     false,
//   },
//   reducers: {
//     setSearchQuery:     (state, action) => { state.searchQuery    = action.payload; },
//     setCategoryFilter:  (state, action) => { state.categoryFilter = action.payload; },
//     resetPartnerStatus: (state) => {
//       state.success     = false;
//       state.error       = null;
//       state.actionError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder

//       // fetchAvailableFood
//       .addCase(fetchAvailableFood.pending, (state) => {
//         state.isLoading = true;
//         state.error     = null;
//       })
//       .addCase(fetchAvailableFood.fulfilled, (state, action) => {
//         state.isLoading     = false;
//         state.availableFood = action.payload;
//         // Merge into cache so food details survive after claiming
//         const map = new Map(state.foodCache.map(f => [f.id, f]));
//         action.payload.forEach(food => map.set(food.id, food));
//         state.foodCache = Array.from(map.values());
//       })
//       .addCase(fetchAvailableFood.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error     = action.payload;
//       })

//       // fetchMyClaims
//       .addCase(fetchMyClaims.pending, (state) => { state.isLoading = true; })
//       .addCase(fetchMyClaims.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.myClaims  = action.payload;
//       })
//       .addCase(fetchMyClaims.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error     = action.payload;
//       })

//       // fetchFoodDetails
//       .addCase(fetchFoodDetails.pending, (state) => {
//         state.isLoading   = true;
//         state.currentFood = null;
//       })
//       .addCase(fetchFoodDetails.fulfilled, (state, action) => {
//         state.isLoading   = false;
//         state.currentFood = action.payload;
//         const map = new Map(state.foodCache.map(f => [f.id, f]));
//         map.set(action.payload.id, action.payload);
//         state.foodCache = Array.from(map.values());
//       })
//       .addCase(fetchFoodDetails.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error     = action.payload;
//       })

//       // claimFood
//       .addCase(claimFood.pending, (state) => {
//         state.isActionLoading = true;
//         state.actionError     = null;
//       })
//       .addCase(claimFood.fulfilled, (state, action) => {
//         state.isActionLoading = false;
//         state.success         = true;
//         state.myClaims.push(action.payload);
//         const claimedId = action.payload.food?.id ?? action.payload.food;
//         const foodItem  = state.availableFood.find(f => f.id === claimedId);
//         if (foodItem) foodItem.is_claimed = true;
//       })
//       .addCase(claimFood.rejected, (state, action) => {
//         state.isActionLoading = false;
//         state.actionError     = action.payload;
//       })

//       // cancelClaim — thunk returns { claimId, data } so we always have the ID
//       .addCase(cancelClaim.pending, (state) => {
//         state.isActionLoading = true;
//         state.actionError     = null;
//       })
//       .addCase(cancelClaim.fulfilled, (state, action) => {
//         state.isActionLoading = false;
//         const { claimId }     = action.payload; // reliable — set by our own thunk

//         const target = state.myClaims.find(c => c.id === claimId);
//         const foodId = target ? (target.food?.id ?? target.food) : null;

//         // Mark as cancelled — keep in list for history
//         state.myClaims = state.myClaims.map(c =>
//           c.id === claimId ? { ...c, status: 'cancelled' } : c
//         );
//         // Release food back to available in both live list and cache
//         if (foodId) {
//           const inLive  = state.availableFood.find(f => f.id === foodId);
//           const inCache = state.foodCache.find(f => f.id === foodId);
//           if (inLive)  inLive.is_claimed  = false;
//           if (inCache) inCache.is_claimed = false;
//         }
//       })
//       .addCase(cancelClaim.rejected, (state, action) => {
//         state.isActionLoading = false;
//         state.actionError     = action.payload;
//       })

//       // verifyPickup
//       .addCase(verifyPickup.fulfilled, (state, action) => {
//         state.myClaims = state.myClaims.map(c =>
//           c.id === action.payload.claimId
//             ? { ...c, pickup_code_verified: true, status: 'picked_up' }
//             : c
//         );
//       })

//       // recordDistribution
//       .addCase(recordDistribution.fulfilled, (state, action) => {
//         state.success  = true;
//         const dist     = action.payload;
//         state.myClaims = state.myClaims.map(c =>
//           c.id === dist.claim
//             ? { ...c, distribution: dist, status: 'distributed' }
//             : c
//         );
//       })
//   },
// });

// export const { setSearchQuery, setCategoryFilter, resetPartnerStatus } = partnerSlice.actions;

// // ── Selectors ─────────────────────────────────────────────────────────────────

// export const selectAvailableFood   = s => s.partner?.availableFood   ?? EMPTY_ARRAY;
// export const selectMyClaims        = s => s.partner?.myClaims        ?? EMPTY_ARRAY;
// export const selectSearchQuery     = s => s.partner?.searchQuery     ?? '';
// export const selectCategoryFilter  = s => s.partner?.categoryFilter  ?? 'all';
// export const selectPartnerError    = s => s.partner?.error           ?? null;
// export const selectActionError     = s => s.partner?.actionError     ?? null;
// export const selectPartnerSuccess  = s => s.partner?.success         ?? false;

// // ── Loading selector aliases ──────────────────────────────────────────────────
// // Components that use `loading`, `claimLoading`, or `cancelLoading` field names
// // from useSelector({ state.partner }) will get the right values through these.
// export const selectIsLoading       = s => s.partner?.isLoading       ?? false;
// export const selectIsActionLoading = s => s.partner?.isActionLoading ?? false;

// // Derived selectors
// export const selectActiveClaims = createSelector(
//   [selectMyClaims],
//   claims => claims.filter(c => c.status !== 'cancelled')
// );

// export const selectCancelledClaims = createSelector(
//   [selectMyClaims],
//   claims => claims.filter(c => c.status === 'cancelled')
// );

// export const selectActiveMyClaims = selectActiveClaims; // alias

// export const selectVisibleFood = createSelector(
//   [selectAvailableFood, selectSearchQuery, selectCategoryFilter],
//   (availableFood, searchQuery, categoryFilter) => {
//     let result = availableFood;
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       result  = result.filter(f =>
//         f.food_type?.toLowerCase().includes(q) ||
//         f.pickup_address?.toLowerCase().includes(q)
//       );
//     }
//     if (categoryFilter !== 'all') {
//       result = result.filter(f => f.category === categoryFilter);
//     }
//     return result;
//   }
// );

// export const selectAvailableCount = createSelector(
//   [selectAvailableFood],
//   food => food.filter(f => !f.is_claimed).length
// );

// export const selectMyClaimsCount = createSelector(
//   [selectActiveClaims],
//   claims => claims.length
// );

// // Read food details from nested claim.food (backend returns full object now)
// export const selectFoodFromClaim = (claim) => {
//   if (!claim) return null;
//   if (claim.food && typeof claim.food === 'object' && claim.food.food_type) {
//     return claim.food;
//   }
//   return null;
// };

// export default partnerSlice.reducer;


import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../auth/api';
import { isExpired, isExpiringSoon } from '../../utils/foodUtils';

const EMPTY = [];

export const fetchAvailableFood = createAsyncThunk(
  'partner/fetchAvailableFood',
  async (coords, { rejectWithValue }) => {
    try {
      const params = {};
      if (Number.isFinite(coords?.latitude) && Number.isFinite(coords?.longitude)) {
        params.latitude  = coords.latitude;
        params.longitude = coords.longitude;
      }
      const response = await api.get('food/all-listings/', { params });
      return response.data ?? EMPTY;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch listings');
    }
  }
);

/**
 * Fetches the partner's own claims.
 */
export const fetchMyClaims = createAsyncThunk(
  'partner/fetchMyClaims',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('claims/');
      return response.data ?? EMPTY;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch claims');
    }
  }
);

/**
 * Claims a food listing by ID.
 */
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

/**
 * Cancels an active claim.
 * Returns { claimId, data } so the reducer always has the ID regardless of
 * what the backend response body looks like.
 */
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

/**
 * Verifies a pickup code and marks the claim as picked_up.
 */
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

/**
 * Records a completed food distribution.
 */
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

/**
 * Fetches a single food listing by ID.
 * Checks the in-memory cache first to avoid unnecessary network calls.
 */
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
      const found    = response.data?.find(f => f.id === id);
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
    availableFood:    EMPTY,
    myClaims:         EMPTY,
    foodCache:        EMPTY, // survives claiming so detail page still works
    currentFood:      null,
    searchQuery:      '',
    categoryFilter:   'all',
    isLoading:        false,
    isActionLoading:  false,
    error:            null,
    actionError:      null,
    success:          false,
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

      // ── fetchAvailableFood ──────────────────────────────────────────────────
      .addCase(fetchAvailableFood.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAvailableFood.fulfilled, (state, action) => {
        state.isLoading     = false;
        state.availableFood = action.payload;
        // Merge into cache — so food details survive even after the item is claimed
        // and disappears from availableFood
        const map = new Map(state.foodCache.map(f => [f.id, f]));
        action.payload.forEach(f => map.set(f.id, f));
        state.foodCache = Array.from(map.values());
      })
      .addCase(fetchAvailableFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // ── fetchMyClaims ───────────────────────────────────────────────────────
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

      // ── fetchFoodDetails ────────────────────────────────────────────────────
      .addCase(fetchFoodDetails.pending, (state) => {
        state.isLoading   = true;
        state.currentFood = null;
      })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.currentFood = action.payload;
        const map = new Map(state.foodCache.map(f => [f.id, f]));
        map.set(action.payload.id, action.payload);
        state.foodCache = Array.from(map.values());
      })
      .addCase(fetchFoodDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // ── claimFood ───────────────────────────────────────────────────────────
      .addCase(claimFood.pending, (state) => {
        state.isActionLoading = true;
        state.actionError     = null;
      })
      .addCase(claimFood.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.success         = true;
        state.myClaims        = [...state.myClaims, action.payload];
        // Optimistically mark the food as claimed in both lists
        const claimedId = action.payload.food?.id ?? action.payload.food;
        [state.availableFood, state.foodCache].forEach(list => {
          const item = list.find(f => f.id === claimedId);
          if (item) item.is_claimed = true;
        });
      })
      .addCase(claimFood.rejected, (state, action) => {
        state.isActionLoading = false;
        state.actionError     = action.payload;
      })

      // ── cancelClaim ─────────────────────────────────────────────────────────
      .addCase(cancelClaim.pending, (state) => {
        state.isActionLoading = true;
        state.actionError     = null;
      })
      .addCase(cancelClaim.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const { claimId }     = action.payload;
        const target          = state.myClaims.find(c => c.id === claimId);
        const foodId          = target ? (target.food?.id ?? target.food) : null;
        // Keep claim in list as 'cancelled' — needed for history
        state.myClaims = state.myClaims.map(c =>
          c.id === claimId ? { ...c, status: 'cancelled' } : c
        );
        // Release the food back to available
        if (foodId) {
          [state.availableFood, state.foodCache].forEach(list => {
            const item = list.find(f => f.id === foodId);
            if (item) item.is_claimed = false;
          });
        }
      })
      .addCase(cancelClaim.rejected, (state, action) => {
        state.isActionLoading = false;
        state.actionError     = action.payload;
      })

      // ── verifyPickup ────────────────────────────────────────────────────────
      .addCase(verifyPickup.fulfilled, (state, action) => {
        state.myClaims = state.myClaims.map(c =>
          c.id === action.payload.claimId
            ? { ...c, pickup_code_verified: true, status: 'picked_up' }
            : c
        );
      })

      // ── recordDistribution ──────────────────────────────────────────────────
      .addCase(recordDistribution.fulfilled, (state, action) => {
        state.success  = true;
        const dist     = action.payload;
        state.myClaims = state.myClaims.map(c =>
          c.id === dist.claim
            ? { ...c, distribution: dist, status: 'distributed' }
            : c
        );
      });
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  resetPartnerStatus,
} = partnerSlice.actions;

// ── Base selectors ────────────────────────────────────────────────────────────

export const selectAllAvailableFood  = s => s.partner?.availableFood  ?? EMPTY;
export const selectMyClaims          = s => s.partner?.myClaims       ?? EMPTY;
export const selectFoodCache         = s => s.partner?.foodCache       ?? EMPTY;
export const selectSearchQuery       = s => s.partner?.searchQuery     ?? '';
export const selectCategoryFilter    = s => s.partner?.categoryFilter  ?? 'all';
export const selectPartnerError      = s => s.partner?.error           ?? null;
export const selectActionError       = s => s.partner?.actionError     ?? null;
export const selectPartnerSuccess    = s => s.partner?.success         ?? false;
export const selectIsLoading         = s => s.partner?.isLoading       ?? false;
export const selectIsActionLoading   = s => s.partner?.isActionLoading ?? false;

// ── Food selectors ────────────────────────────────────────────────────────────

/**
 * Active listings only — expired ones filtered out client-side.
 * The backend should also filter these, but we do it here as a safety net
 * in case the backend returns stale data or the device clock ticks past expiry
 * while the user is on screen.
 */
export const selectActiveFood = createSelector(
  [selectAllAvailableFood],
  (food) => food.filter(f => !isExpired(f))
);

/**
 * Listings expiring within 6 hours — for "act fast" UI urgency indicators.
 */
export const selectExpiringSoonFood = createSelector(
  [selectActiveFood],
  (food) => food.filter(f => isExpiringSoon(f))
);

/**
 * Visible food after search + category filters applied.
 * Always uses activeFood (expired already removed).
 */
export const selectVisibleFood = createSelector(
  [selectActiveFood, selectSearchQuery, selectCategoryFilter],
  (food, query, category) => {
    let result = food;
    if (query.trim()) {
      const q = query.toLowerCase();
      result  = result.filter(f =>
        f.food_type?.toLowerCase().includes(q) ||
        f.pickup_address?.toLowerCase().includes(q) ||
        f.pickup_city?.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') {
      result = result.filter(f => f.category === category);
    }
    return result;
  }
);

/**
 * Count of available (unclaimed, unexpired) listings.
 */
export const selectAvailableCount = createSelector(
  [selectActiveFood],
  (food) => food.filter(f => !f.is_claimed).length
);

// ── Claim selectors ───────────────────────────────────────────────────────────

/**
 * All non-cancelled claims (the ones that matter for active tracking).
 */
export const selectActiveClaims = createSelector(
  [selectMyClaims],
  (claims) => claims.filter(c => c.status !== 'cancelled')
);

/**
 * Cancelled claims — for history/audit view.
 */
export const selectCancelledClaims = createSelector(
  [selectMyClaims],
  (claims) => claims.filter(c => c.status === 'cancelled')
);

/**
 * Claims by status — pass the status string you want.
 * e.g. selectClaimsByStatus(state, 'pending')
 */
export const selectClaimsByStatus = createSelector(
  [selectMyClaims, (_, status) => status],
  (claims, status) => claims.filter(c => c.status === status)
);

/**
 * Total active claim count — used for dashboard stats.
 */
export const selectMyClaimsCount = createSelector(
  [selectActiveClaims],
  (claims) => claims.length
);

/**
 * Set of food IDs the partner currently holds an ACTIVE claim on.
 * Built from selectActiveClaims, not raw myClaims — cancelClaim.fulfilled
 * keeps cancelled claim records around for history, so checking against
 * myClaims directly would make a cancelled claim look claimed forever.
 */
export const selectMyClaimedFoodIds = createSelector(
  [selectActiveClaims],
  (claims) => new Set(claims.map(c => c.food?.id ?? c.food))
);

/**
 * Looks up one food listing by ID. Checks the live availableFood list
 * first, then falls back to foodCache — covers deep links, page refreshes,
 * and listings that fell out of availableFood after being claimed elsewhere.
 * e.g. selectFoodById(state, 42)
 */
export const selectFoodById = createSelector(
  [selectAllAvailableFood, selectFoodCache, (_, foodId) => foodId],
  (availableFood, foodCache, foodId) =>
    availableFood.find(f => f.id === foodId) ||
    foodCache.find(f => f.id === foodId) ||
    null
);
/**
 * Safely reads full food details from a nested claim.food object.
 * The backend now returns the full food object inside each claim.
 */
export const selectFoodFromClaim = (claim) => {
  if (!claim) return null;
  if (claim.food && typeof claim.food === 'object' && claim.food.food_type) {
    return claim.food;
  }
  return null;
};

// Alias kept for backward compat with any component using selectActiveMyClaims
export const selectActiveMyClaims = selectActiveClaims;

export default partnerSlice.reducer;
