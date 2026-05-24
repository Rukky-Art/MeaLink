import { Routes, Route, Navigate } from 'react-router';
import AuthLayout from './layout/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelector';
import RegisterDetails from './pages/RegisterDetails';
import VerificationPage from './pages/VerificationPage';
import MainLayout from './layout/MainLayout';
import DashboardHome from './pages/DashboardHome';
import LandingPage from './pages/LandingPage';
import { fetchUserProfile } from './store/slices/authSlice';
import PostFood from './pages/donorFolder/PostFood';
import MyListings from './pages/donorFolder/MyListings';
import Notifications from './pages/donorFolder/Notifications';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Flow (No Sidebar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register/select-role" element={<RoleSelection />} />
        <Route path="/register/details/:role" element={<RegisterDetails />} />
        <Route path="/verification-pending" element={<VerificationPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/create-listing" element={<PostFood />} />
        <Route path="/dashboard/my-listings" element={<MyListings />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;