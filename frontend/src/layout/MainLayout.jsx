import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';

const MainLayout = () => {
  const { token, user, isLoading } = useSelector((state) => state.auth);

  // 1. If there's no token at all, kick them out immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. While App.jsx is fetching the profile, show the premium loading screen
  // This prevents the Sidebar from flickering with "Guest" or empty data
  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white font-be-vietnam">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-brand-mint rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-green rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-brand-green font-bold animate-pulse tracking-wide uppercase text-xs">
          Authenticating MeaLink...
        </p>
      </div>
    );
  }

  // 3. Once we have a user and a token, show the dashboard
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-be-vietnam">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* We use Outlet to render the specific dashboard page (Home, Inventory, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;