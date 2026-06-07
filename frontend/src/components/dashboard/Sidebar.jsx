import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, Plus, List, Bell, User, Users } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import logo1 from '../../assets/logo1.png';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const roleLinks = {
    donor: [
      { label: 'Overview',       icon: LayoutDashboard, path: '/dashboard',                end: true  },
      { label: 'My Listings',    icon: List,            path: '/dashboard/my-listings',    end: true  },
      { label: 'Create Listing', icon: Plus,            path: '/dashboard/create-listing', end: true  },
      { label: 'Notifications',  icon: Bell,            path: '/dashboard/notifications',  end: true  },
    ],
    partner: [
      { label: 'Overview',       icon: LayoutDashboard, path: '/dashboard',              end: true  },
      { label: 'Available Food', icon: Package,         path: '/dashboard/browse',       end: true  },
      { label: 'My Claims',      icon: List,            path: '/dashboard/my-claims',    end: true  },
    ],
    admin: [
      { label: 'Overview',     icon: LayoutDashboard, path: '/dashboard',              end: true  },
      { label: 'All Listings', icon: List,            path: '/dashboard/all-listings', end: true  },
      { label: 'Partners',     icon: Users,           path: '/dashboard/partners',     end: true  },
    ],
  };

  const links = roleLinks[user?.role] || roleLinks['partner'];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2 z-50 p-2 bg-white rounded-lg shadow-md text-gray-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col h-full font-be-vietnam transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex
      `}>
        <div className="p-8 flex items-center gap-3">
          <img src={logo1} alt="MeaLink" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {links.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
                ${isActive
                  ? 'bg-[#F59F0A1A] text-brand-green shadow-sm shadow-brand-green/5'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/dashboard/settings"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
              ${isActive ? 'bg-brand-mint text-brand-green' : 'text-gray-500 hover:bg-gray-50'}
            `}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
              <User size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 truncate w-32 capitalize">{user?.name || 'User'}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</span>
            </div>
          </div>
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
