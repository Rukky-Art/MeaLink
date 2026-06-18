import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api';

// ── Safe localStorage helpers ─────────────────────────────────────────────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const getStoredToken = () => {
  const token = localStorage.getItem('token');
  return token && token !== 'undefined' ? token : null;
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('token/', credentials);
    localStorage.setItem('token', response.data.access);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});


export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      // File/Blob fields (e.g. the certificate) go in as-is
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    const response = await api.post('users/register/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const verifyEmailToken = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      // Calls your verification endpoint with the query token
      const response = await api.get(`users/verify-email/?token=${token}`);
      
      // If the backend returns access tokens on successful validation:
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
      }
      return response.data; // Should contain { access, refresh, user }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('users/me/');
    if (response.data && typeof response.data === 'object') {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    return thunkAPI.rejectWithValue({
      status,
      // Only logout on 401 — not on network errors or Render cold-start 503s
      shouldLogout: status === 401,
    });
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            getStoredUser(),
    token:           getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    isLoading:       false,
    error:           null,
  },
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.token           = action.payload.access;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading       = false;
        state.error           = action.payload;
        state.isAuthenticated = false;
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user            = action.payload;
        state.isAuthenticated = true;
        if (action.payload && typeof action.payload === 'object') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        // Only clear session on genuine 401 (expired/invalid token)
        // Network errors, 503 cold starts etc. leave the session intact
        if (action.payload?.shouldLogout) {
          state.user            = null;
          state.token           = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
         .addCase(verifyEmailToken.fulfilled, (state, action) => {
              state.isLoading = false;
              state.token = action.payload.access;
              state.isAuthenticated = true;
              
              if (action.payload.user && typeof action.payload.user === 'object') {
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
              }
            });
  },
});

export const { logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export default authSlice.reducer;
