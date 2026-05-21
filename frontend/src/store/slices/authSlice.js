import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../auth/api'

// Async thunk for Login
export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('token/', credentials); // Django SimpleJWT endpoint
    localStorage.setItem('token', response.data.access);
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for Registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('users/register/', userData);
      return response.data;
    } catch (error) {
      // This catches the "user with this email already exists" error
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// New Thunk to get user details using the token
// Thunk to get the logged-in user's data
export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('users/me/'); 
    // Save the user object to localStorage so it persists on page refresh
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    // If the token is invalid or expired, handle the error
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch profile");
  }
});



// ... thunks remain the same

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // 1. Critical: use the exact same keys here as you do in setItem
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access; // SimpleJWT returns 'access'
        state.isAuthenticated = true;
        // Don't set state.user here yet, because the login response doesn't have it!
        localStorage.setItem('token', action.payload.access);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // 2. This is where the User identity is actually born
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        // Persist the user object so it survives the refresh
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        // If the profile fetch fails (expired token), clean up everything
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout } = authSlice.actions;


export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;