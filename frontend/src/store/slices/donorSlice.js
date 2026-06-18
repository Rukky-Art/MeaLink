import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../auth/api';
import { isExpired } from '../../utils/foodUtils';

const EMPTY = [];

export const fetchMyListings = createAsyncThunk(
  'donor/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('food/my-listings/');
      return response.data ?? EMPTY;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch your listings');
    }
  }
);


export const createListing = createAsyncThunk(
  'donor/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await api.post('food/my-listings/', listingData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create listing');
    }
  }
);

/**
 * Soft-deletes a listing by ID.
 * Endpoint: DELETE food/my-listings/{id}/
 * Returns the deleted listing's ID so the reducer can remove it from state.
 *
 * TODO: confirm endpoint path with backend — may be food/my-listings/{id}/delete/
 */
export const deleteListing = createAsyncThunk(
  'donor/deleteListing',
  async (listingId, { rejectWithValue }) => {
    try {
      await api.delete(`food/my-listings/${listingId}/`);
      return listingId; // return ID so reducer can splice it out
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete listing');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const donorSlice = createSlice({
  name: 'donor',
  initialState: {
    myListings:      EMPTY,
    isLoading:       false,
    isDeleteLoading: false,
    error:           null,
    deleteError:     null,
    success:         false,
  },
  reducers: {
    resetDonorStatus: (state) => {
      state.success      = false;
      state.error        = null;
      state.deleteError  = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── fetchMyListings ─────────────────────────────────────────────────────
      .addCase(fetchMyListings.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.isLoading  = false;
        state.myListings = action.payload;
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // ── createListing ───────────────────────────────────────────────────────
      .addCase(createListing.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
        state.success   = false;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isLoading  = false;
        state.success    = true;
        // Prepend so newest listing appears at top
        state.myListings = [action.payload, ...state.myListings];
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // ── deleteListing ───────────────────────────────────────────────────────
      .addCase(deleteListing.pending, (state) => {
        state.isDeleteLoading = true;
        state.deleteError     = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.isDeleteLoading = false;
        // Remove the deleted listing from local state immediately
        state.myListings      = state.myListings.filter(l => l.id !== action.payload);
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isDeleteLoading = false;
        state.deleteError     = action.payload;
      });
  },
});

export const { resetDonorStatus } = donorSlice.actions;

// ── Base selectors ────────────────────────────────────────────────────────────

export const selectMyListings      = s => s.donor?.myListings      ?? EMPTY;
export const selectDonorIsLoading  = s => s.donor?.isLoading       ?? false;
export const selectDonorSuccess    = s => s.donor?.success         ?? false;
export const selectDonorError      = s => s.donor?.error           ?? null;
export const selectDeleteLoading   = s => s.donor?.isDeleteLoading ?? false;
export const selectDeleteError     = s => s.donor?.deleteError     ?? null;

// ── Derived selectors ─────────────────────────────────────────────────────────

/**
 * Active listings — pickup window or expiry has NOT yet passed.
 * These appear in the main listings feed.
 */
export const selectActiveListings = createSelector(
  [selectMyListings],
  (listings) => listings.filter(l => !isExpired(l))
);

/**
 * Expired listings — pickup window or expiry HAS passed.
 * Shown in the donor's "Expired" tab.
 * Never auto-deleted — kept for impact reporting and audit trail.
 */
export const selectExpiredListings = createSelector(
  [selectMyListings],
  (listings) => listings.filter(l => isExpired(l))
);

/**
 * Listings filtered by backend status field.
 * e.g. selectListingsByStatus(state, 'available')
 *      selectListingsByStatus(state, 'claimed')
 */
export const selectListingsByStatus = createSelector(
  [selectMyListings, (_, status) => status],
  (listings, status) => {
    if (!status || status === 'all') return listings;
    return listings.filter(l => l.status === status);
  }
);

/**
 * Active listing count — for donor dashboard stats.
 */
export const selectActiveListingCount = createSelector(
  [selectActiveListings],
  (listings) => listings.length
);

/**
 * Expired listing count — for donor dashboard badge.
 */
export const selectExpiredListingCount = createSelector(
  [selectExpiredListings],
  (listings) => listings.length
);

/**
 * Claimed listings — active listings that a partner has claimed.
 * Useful for "your food is being collected" dashboard insight.
 */
export const selectClaimedListings = createSelector(
  [selectMyListings],
  (listings) => listings.filter(l => l.status === 'claimed' || l.is_claimed)
);

/**
 * Total meals impact — sum of quantity_estimated across all listings
 * that reached 'distributed' status.
 */
export const selectTotalMealsDistributed = createSelector(
  [selectMyListings],
  (listings) =>
    listings
      .filter(l => l.status === 'distributed')
      .reduce((sum, l) => sum + (Number(l.quantity_estimated) || 0), 0)
);
/**
 * Monthly meal totals for the current year, for the impact chart.
 * Mirrors selectTotalMealsDistributed's definition of "impact" —
 * only listings with status 'distributed' count toward meals shared.
 * If you actually want ALL listings counted here (not just distributed),
 * drop the status filter below and tell me — that changes the numbers.
 */
export const selectMonthlyDistributedMealsData = createSelector(
  [selectMyListings],
  (listings) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const currentYear = new Date().getFullYear();
    const chartData = months.map(name => ({ name, meals: 0 }));

    listings.forEach(listing => {
      if (listing.status !== 'distributed') return;

      const date = new Date(listing.created_at);
      if (isNaN(date.getTime()) || date.getFullYear() !== currentYear) return;

      const quantity = Number(listing.quantity_estimated) || 0;
      if (quantity > 0) {
        chartData[date.getMonth()].meals += quantity;
      }
    });

    return chartData;
  }
);
export default donorSlice.reducer;
