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



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
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
        state.user = action.payload.user;
        state.token = action.payload.access;
        localStorage.setItem('token', action.payload.access);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;

      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;