import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import partnerReducer from './slices/partnerSlice'
import foodReducer from './slices/foodSlice'
import adminReducer from './slices/adminSlice'


import donorReducer from './slices/donorSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    donor: donorReducer,
    partner: partnerReducer,
    food: foodReducer,
    admin: adminReducer
  },
});