import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import { useEffect } from 'react';
import { fetchUserProfile } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';


const MainLayout = () => {
  const { token, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile()); // Go get the role!
    }
  }, [token, user, dispatch]);

  if (!token) return <Navigate to="/login" />;

  // IMPORTANT: Don't show the dashboard until we know the role
  if (!user || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-brand-green font-bold">Loading MeaLink...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;