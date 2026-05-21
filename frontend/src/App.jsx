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
        <Route path="/login" element={<Login />} />
        <Route path="/register/select-role" element={<RoleSelection />} />
        <Route path="/register/details/:role" element={<RegisterDetails />} />
        <Route path="/verification-pending" element={<VerificationPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;