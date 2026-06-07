import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api'

// ── Safe localStorage helpers ─────────────────────────────────────────────────
// Never crash on malformed / "undefined" string values
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user'); // wipe the bad value so it doesn't repeat
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
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('users/register/', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('users/me/');
    // Guard: only store if it's a real object, never store undefined
    if (response.data && typeof response.data === 'object') {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch profile');
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            getStoredUser(),   // safe — never crashes on bad values
    token:           getStoredToken(),  // safe — never returns "undefined" string
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
        state.isLoading      = false;
        state.token          = action.payload.access;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading      = false;
        state.error          = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user            = action.payload;
        state.isAuthenticated = true;
        if (action.payload && typeof action.payload === 'object') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;
