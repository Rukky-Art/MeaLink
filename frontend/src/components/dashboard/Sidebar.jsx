import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard, Package, Settings, LogOut, Menu, X,
  Plus, List, Bell, User, ChevronRight, UserCheck,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import logo1 from '../../assets/logo1.png';


const STEM_COLOR = '#16a34a';

/* ---------- Helpers ---------- */

/** True when a child link (which may include a `?query`) matches the current URL. */
const isChildActive = (childPath, pathname, search) => {
  const [cPath, cQuery] = childPath.split('?');
  if (pathname !== cPath) return false;
  const current = search.startsWith('?') ? search.slice(1) : search;
  return (cQuery ?? '') === current;
};

/** True if any child under this group matches the current URL (used for auto-open). */
const groupContainsActive = (item, pathname, search) =>
  item.children.some((c) => isChildActive(c.path, pathname, search));


/* ---------- Components ---------- */

const TreeChildren = ({ children, isOpen }) => (
  <div style={{
    display: 'grid',
    gridTemplateRows: isOpen ? '1fr' : '0fr',
    transition: 'grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)',
  }} aria-hidden={!isOpen}>
    <div style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', marginLeft: '18px', paddingTop: '2px', paddingBottom: '4px' }}>
        <span style={{
          position: 'absolute', left: 0, top: 0, bottom: '10px',
          width: '1.5px', background: STEM_COLOR, opacity: 0.35,
        }} />
        {children}
      </div>
    </div>
  </div>
);

const TreeChild = ({ label, path, onNavigate }) => {
  const location = useLocation();
  const isActive = isChildActive(path, location.pathname, location.search);

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        paddingLeft: '22px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px',
        fontSize: '12.5px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.15s',
      }}
      className={isActive ? 'tree-child-active' : 'tree-child'}
    >
      <span style={{
        position: 'absolute', left: 0, top: 0, height: '50%', width: '14px',
        borderLeft: `1.5px solid ${STEM_COLOR}`, borderBottom: `1.5px solid ${STEM_COLOR}`,
        borderBottomLeftRadius: '5px', opacity: 0.5,
      }} />
      {label}
    </NavLink>
  );
};

const NavGroup = ({ item, isOpen, hasActive, onToggle, onNavigate }) => {
  const groupId = `nav-group-${item.label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={groupId}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
          ${hasActive
            ? 'bg-[#F59F0A1A] text-brand-green'
            : isOpen
              ? 'bg-gray-50 text-gray-900'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <item.icon size={20} />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronRight
          size={15}
          className="text-gray-400 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div id={groupId}>
        <TreeChildren isOpen={isOpen}>
          {item.children.map((child) => (
            <TreeChild
              key={child.label}
              label={child.label}
              path={child.path}
              onNavigate={onNavigate}
            />
          ))}
        </TreeChildren>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const location  = useLocation();
  const [isOpen,    setIsOpen]    = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (label) =>
    setOpenGroup((prev) => (prev === label ? null : label));

  // Memoize the link tree so we don't rebuild it every render.
  const roleLinks = useMemo(() => ({
    donor: [
      {
        label: 'Overview',
        icon: LayoutDashboard,
        children: [
          { label: 'Dashboard',    path: '/dashboard' },
        ],
      },
      {
        label: 'My Listings',
        icon: List,
        children: [
          { label: 'All',          path: '/dashboard/my-listings'                      },
          { label: 'Available',    path: '/dashboard/my-listings?status=available'     },
          { label: 'Claimed',      path: '/dashboard/my-listings?status=claimed'       },
          { label: 'Picked up',    path: '/dashboard/my-listings?status=picked_up'     },
          { label: 'Distributed',  path: '/dashboard/my-listings?status=distributed'   },
          { label: 'Expired',      path: '/dashboard/my-listings?status=expired'       },
        ],
      },
      {
        label: 'Create Listing',
        icon: Plus,
        children: [
          { label: 'New Listing',  path: '/dashboard/create-listing' },
        ],
      },
      {
        label: 'Notifications',
        icon: Bell,
        children: [
          { label: 'All',          path: '/dashboard/notifications' },
        ],
      },
    ],
    partner: [
      {
        label: 'Overview',
        icon: LayoutDashboard,
        children: [
          { label: 'Dashboard',    path: '/dashboard' },
        ],
      },
      {
        label: 'Available Food',
        icon: Package,
        children: [
          { label: 'Browse All',   path: '/dashboard/browse' },
        ],
      },
      {
        label: 'My Claims',
        icon: List,
        children: [
          { label: 'All',          path: '/dashboard/my-claims?status=all'                        },
          { label: 'Claimed',      path: '/dashboard/my-claims?status=pending'         },
          { label: 'Picked up',    path: '/dashboard/my-claims?status=picked_up'       },
          { label: 'Distributed',  path: '/dashboard/my-claims?status=distributed'     },
          { label: 'Cancelled',    path: '/dashboard/my-claims?status=cancelled'       },
        ],
      },
    ],
    admin: [
      {
        label: 'Overview',
        icon: LayoutDashboard,
        children: [
          { label: 'Dashboard',    path: '/dashboard' },
        ],
      },
      {
        label: 'Donor Verification',
        icon: UserCheck,
        children: [
          { label: 'Pending',      path: '/dashboard/admin/donor-verification?status=pending' },
          { label: 'Verified',     path: '/dashboard/admin/donor-verification?status=verified' },
          { label: 'Rejected',     path: '/dashboard/admin/donor-verification?status=rejected' },
        ],
      },
      {
        label: 'Partner Verification',
        icon: UserCheck,
        children: [
          { label: 'Pending',      path: '/dashboard/admin/partner-verification?status=pending' },
          { label: 'Approved',     path: '/dashboard/admin/partner-verification?status=approved' },
          { label: 'Rejected',     path: '/dashboard/admin/partner-verification?status=rejected' },
        ],
      }
    ],
  }), []);

  // FIX: don't silently fall back to partner — fall back to empty array.
  const links = useMemo(
  () => (user?.role ? (roleLinks[user.role] || []) : []),
  [user, roleLinks] // FIX: depend on `user` itself, matching the compiler's inferred granularity
);

  /* FIX: auto-open the group that contains the currently active route.
   * Runs whenever the URL changes, so deep links and page refreshes work. */
  // useEffect(() => {
  //   const owner = links.find((g) =>
  //     groupContainsActive(g, location.pathname, location.search)
  //   );
  //   if (owner) setOpenGroup(owner.label);
  //   // Note: we don't close other groups on no-match — preserves the user's manual toggle state.
  // }, [location.pathname, location.search, links]);
const locationSignature = `${location.pathname}${location.search}`;
const [prevLocationSignature, setPrevLocationSignature] = useState(null);
if (locationSignature !== prevLocationSignature) {
  setPrevLocationSignature(locationSignature);
  const owner = links.find((g) =>
    groupContainsActive(g, location.pathname, location.search)
  );
  if (owner) setOpenGroup(owner.label);
  // Note: we don't close other groups on no-match — preserves the user's manual toggle state.
}
  /* FIX: lock body scroll while the mobile drawer is open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  /* FIX: a single close-on-navigate helper, used by every NavLink/TreeChild. */
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md text-gray-600 border border-gray-100"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100
          flex flex-col h-full font-be-vietnam overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
        aria-label="Primary"
      >
        <div className="p-8 flex items-center gap-3 flex-shrink-0">
          <img src={logo1} alt="MeaLink" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
        </div>

   <nav className="flex-1 no-scrollbar overflow-y-auto overflow-x-hidden flex flex-col gap-1.5 px-3 py-4">
  {links.map((item) => {
    const hasActive = groupContainsActive(item, location.pathname, location.search);

    if (item.children.length === 1) {
      // Single child — plain NavLink, no dropdown
      const only = item.children[0];
      return (
        <NavLink
          key={item.label}
          to={only.path}
          end
          onClick={closeDrawer}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
            ${isActive
              ? 'bg-[#F59F0A1A] text-brand-green shadow-sm'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
          `}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </NavLink>
      );
    }

    // Multiple children — dropdown
    return (
      <NavGroup
        key={item.label}
        item={item}
        isOpen={openGroup === item.label}
        hasActive={hasActive}
        onToggle={() => toggleGroup(item.label)}
        onNavigate={closeDrawer}
      />
    );
  })}

  <NavLink
    to="/dashboard/settings"
    end
    onClick={closeDrawer}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all
      ${isActive ? 'bg-brand-mint text-brand-green' : 'text-gray-500 hover:bg-gray-50'}
    `}
  >
    <Settings size={20} />
    <span>Settings</span>
  </NavLink>
</nav>

        <div className="p-4 border-t border-gray-50 flex-shrink-0">
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
            type="button"
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        .tree-child { color: #6b7280; }
        .tree-child:hover { background: #f9fafb; color: #111827; }
        .tree-child-active { color: #16a34a; font-weight: 600; background: #f0fdf4; }
      `}</style>
    </>
  );
};

export default Sidebar;
