import { Routes, Route, Navigate } from 'react-router';
import AuthLayout from './layout/AuthLayout';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelector';
import RegisterDetails from './pages/RegisterDetails';
import VerificationPage from './pages/VerificationPage';
import MainLayout from './layout/MainLayout';
import DashboardHome from './pages/DashboardHome';
function App() {
  return (
    <Routes>
      {/* Auth Flow */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* Redirect empty path to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register/select-role" element={<RoleSelection />} />
        <Route path="/register/details/:role" element={<RegisterDetails />} />
        <Route path="/verification-pending" element={<VerificationPage />} />
      </Route>
      <Route element={<MainLayout />}>
        {/* This is the only one you need! */}
        <Route path="/dashboard" element={<DashboardHome />} />
      </Route>
    </Routes>
  );
}

export default App;


