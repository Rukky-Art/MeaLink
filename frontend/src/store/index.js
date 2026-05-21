import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import foodReducer from './slices/foodSlice'


import donorReducer from './slices/donorSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    food: foodReducer,
    donor: donorReducer
  },
});