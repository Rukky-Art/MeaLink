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

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;