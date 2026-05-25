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
import PartnerDashboard from './pages/PartnerDashboard';
import MyClaims from './pages/Claims';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return children;
};

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
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login"                  element={<Login />} />
        <Route path="/register/select-role"   element={<RoleSelection />} />
        <Route path="/register/details/:role" element={<RegisterDetails />} />
        <Route path="/verification-pending"   element={<VerificationPage />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard"                element={<DashboardHome />} />
        <Route path="/dashboard/create-listing" element={<PostFood />} />
        <Route path="/dashboard/my-listings"    element={<MyListings />} />
        <Route path="/dashboard/notifications"  element={<Notifications />} />

        {/* Partner — drawer handles detail, no /:id route needed */}
        <Route path="/dashboard/browse"         element={<PartnerDashboard />} />
        <Route path="/dashboard/my-claims"      element={<MyClaims />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
