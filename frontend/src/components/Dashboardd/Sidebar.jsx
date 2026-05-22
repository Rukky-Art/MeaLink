import {
  LayoutDashboard,
  List,
  Plus,
  Bell,
  User,
  Users,
  Package,
  LogOut
} from "lucide-react";

function Sidebar({ role, activeView, setView, onLogout, isOpen, onClose }) {
  const donorLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-listings", label: "My Listings", icon: List },
    { id: "create-listing", label: "Create Listing", icon: Plus },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  const partnerLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "available", label: "Available Food", icon: Package },
    { id: "my-claims", label: "My Claims", icon: List },
    { id: "profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "all-listings", label: "All Listings", icon: List },
    { id: "partners", label: "Partners", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  const links =
    role === "donor"
      ? donorLinks
      : role === "partner"
      ? partnerLinks
      : adminLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full w-[200px] bg-white border-r z-40
        flex flex-col py-5 transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}
      >
        <div className="flex items-center gap-2 px-5 mb-7">
          <div className="w-8 h-8 bg-[#1a6b4a] rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="font-semibold">MeaLink</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;

            return (
              <button
                key={id}
                onClick={() => {
                  setView(id);
                  onClose();
                }}
                className={`w-full flex flex-col items-center py-3 text-xs rounded-xl
                  ${
                    active
                      ? "bg-[#e8f5ef] text-[#1a6b4a]"
                      : "text-gray-500"
                  }
                `}
              >
                <Icon />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3">
          <button
            onClick={onLogout}
            className="w-full flex flex-col items-center py-3 text-xs text-red-500"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;