import { Menu, Bell } from "lucide-react";

function Topbar({ role, userName, onMenuClick }) {
  const roleLabel =
    role === "donor"
      ? "Donor"
      : role === "partner"
      ? "Partner"
      : "Admin";

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-5">

      {/* Menu button */}
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu />
      </button>

      <div />

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Bell icon */}
        <Bell />

        {/* Avatar */}
        <div className="w-7 h-7 bg-[#1a6b4a] text-white rounded-full flex items-center justify-center text-xs">
          {userName?.[0]}
        </div>

        {/* User info */}
        <div className="hidden sm:block">
          <p className="text-xs font-medium">{userName}</p>
          <p className="text-[10px] text-gray-400">{roleLabel}</p>
        </div>

      </div>
    </header>
  );
}

export default Topbar;