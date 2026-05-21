import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import logo1 from '../../assets/logo1.png'

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* 1. Improved Hamburger (Clean, no background) */}
  <button 
        onClick={() => setIsOpen(!isOpen)} // Toggles state back and forth
        className="md:hidden fixed top-4 z-50 p-1 text-gray-600 hover:text-brand-green transition-colors"
      >
        {!isOpen ? <Menu size={28} /> : <X size={24} />}
      </button>

      {/* 2. Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. The Responsive Sidebar */}
  <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col h-full font-be-vietnam transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex
      `}>
        {/* Brand Logo - Added padding-top to mobile so it doesn't hit the toggle button */}
        <div className="p-8 pt-16 md:pt-8 flex items-center gap-2">
          <div className="bg-brand-green p-1.5 rounded-lg text-white">
            <img src={logo1} alt="Logo" srcset=" " className="w-10 h-10 object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
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

        {/* Logout */}
        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;