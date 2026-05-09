import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut,
  Heart
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isDonor = user?.role === 'donor';

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { 
      label: isDonor ? 'My Listings' : 'Available Food', 
      icon: Package, 
      path: isDonor ? '/dashboard/my-listings' : '/dashboard/browse' 
    },
    { label: 'History', icon: History, path: '/dashboard/history' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col h-full font-be-vietnam">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="bg-brand-green p-1.5 rounded-lg text-white">
          <Heart size={18} fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              ${isActive 
                ? 'bg-brand-mint text-brand-green' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;