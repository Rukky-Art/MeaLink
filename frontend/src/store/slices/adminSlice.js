import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../auth/api';

const EMPTY_ARRAY = [];

// ── Thunks ────────────────────────────────────────────────────────────────────

// GET /api/admin/panel-list/?role=donor|partner&status=pending|verified|rejected
export const fetchPanelUsers = createAsyncThunk(
  'admin/fetchPanelUsers',
  async ({ role, status } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (role)               params.role   = role;
      if (status && status !== 'all') params.status = status;
      const response = await api.get('admin/panel-list/', { params });
      const data = response.data;
      return Array.isArray(data) ? data : data?.results || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch users');
    }
  }
);

export const fetchPanelUserDetail = createAsyncThunk(
  'admin/fetchPanelUserDetail',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`admin/panel-list/${userId}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not fetch user details');
    }
  }
);

// PATCH approve or reject — reason required when rejecting
// PATCH approve or reject using backend payload guidelines
export const reviewPanelUser = createAsyncThunk(
  'admin/reviewPanelUser',
  async ({ userId, isVerified, rejectionReason, adminNote }, { rejectWithValue }) => {
    try {
      // 1. Map the true/false status to what the backend expects ("verified" or "rejected")
      const payload = {
        verification_status: isVerified ? 'verified' : 'rejected',
      };

      // 2. Map notes. If rejecting, we can combine the selected radio reason and extra admin context
      if (!isVerified) {
        payload.note = adminNote 
          ? `${rejectionReason} — Note: ${adminNote}` 
          : rejectionReason;
      } else if (adminNote) {
        payload.note = adminNote;
      }

      // 3. Fire request to the correct endpoint
      const response = await api.patch(`admin/verifications/${userId}/`, payload);
      return { userId, isVerified, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Could not complete this action');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    panelUsers:      EMPTY_ARRAY,
    selectedUser:    null,

    isLoading:       false,
    isDetailLoading: false,
    isActionLoading: false,

    error:           null,
    actionError:     null,
    success:         false,
  },
  reducers: {
    clearSelectedUser: (state) => { state.selectedUser = null; },
    resetAdminStatus: (state) => {
      state.success     = false;
      state.error        = null;
      state.actionError  = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchPanelUsers.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchPanelUsers.fulfilled, (state, action) => {
        state.isLoading  = false;
        state.panelUsers = action.payload;
      })
      .addCase(fetchPanelUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      .addCase(fetchPanelUserDetail.pending, (state) => {
        state.isDetailLoading = true;
        state.selectedUser    = null;
      })
      .addCase(fetchPanelUserDetail.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedUser    = action.payload;
      })
      .addCase(fetchPanelUserDetail.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error           = action.payload;
      })

      .addCase(reviewPanelUser.pending, (state) => {
        state.isActionLoading = true;
        state.actionError     = null;
      })
      .addCase(reviewPanelUser.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.success         = true;

        const { userId, isVerified } = action.payload;
        const newStatus = isVerified ? 'verified' : 'rejected';

        state.panelUsers = state.panelUsers.map(u =>
          u.id === userId ? { ...u, verification_status: newStatus } : u
        );
        if (state.selectedUser?.id === userId) {
          state.selectedUser = { ...state.selectedUser, verification_status: newStatus };
        }
      })
      .addCase(reviewPanelUser.rejected, (state, action) => {
        state.isActionLoading = false;
        state.actionError     = action.payload;
      });
  },
});

export const { clearSelectedUser, resetAdminStatus } = adminSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectPanelUsers         = s => s.admin?.panelUsers      ?? EMPTY_ARRAY;
export const selectSelectedUser       = s => s.admin?.selectedUser    ?? null;
export const selectAdminIsLoading     = s => s.admin?.isLoading       ?? false;
export const selectAdminDetailLoading = s => s.admin?.isDetailLoading ?? false;
export const selectAdminActionLoading = s => s.admin?.isActionLoading ?? false;
export const selectAdminError         = s => s.admin?.error           ?? null;
export const selectAdminActionError   = s => s.admin?.actionError     ?? null;

export const selectPanelStats = createSelector(
  [selectPanelUsers],
  (users) => ({
    total:    users.length,
    pending:  users.filter(u => u.verification_status === 'pending').length,
    verified: users.filter(u => u.verification_status === 'verified').length,
    rejected: users.filter(u => u.verification_status === 'rejected').length,
  })
);

export default adminSlice.reducer;
