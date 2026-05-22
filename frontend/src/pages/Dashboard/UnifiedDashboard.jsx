import { useState } from "react";

import Sidebar from "../../components/Dashboardd/Sidebar";
import Topbar from "../../components/Dashboardd/Topbar";

import DonorDashboard from "./views/DonorDashboard";
import PartnerDashboard from "./views/PartnerDashboard";
import AdminDashboard from "./views/AdminDashboard";

import MyListings from "./views/MyListings";
import AllListings from "./views/AllListings";
import PartnersView from "./views/PartnersView";
import AvailableFood from "./views/AvailableFood";
import MyClaims from "./views/MyClaims";
import ProfileView from "./views/ProfileView";
import NotificationsView from "./views/NotificationsView";

export default function UnifiedDashboard() {
  const [auth, setAuth] = useState({
    role: "donor",
    userName: "Eko Hotel",
  });

  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { role, userName } = auth;

  const renderView = () => {
    if (role === "donor") {
      return {
        dashboard: <DonorDashboard />,
        "my-listings": <MyListings />,
        notifications: <NotificationsView />,
        profile: <ProfileView />,
      }[view];
    }

    if (role === "partner") {
      return {
        dashboard: <PartnerDashboard />,
        available: <AvailableFood />,
        "my-claims": <MyClaims />,
        profile: <ProfileView />,
      }[view];
    }

    if (role === "admin") {
      return {
        dashboard: <AdminDashboard />,
        "all-listings": <AllListings />,
        partners: <PartnersView />,
        profile: <ProfileView />,
      }[view];
    }

    return <div className="p-5">Invalid role selected</div>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        role={role}
        activeView={view}
        setView={setView}
        onLogout={() =>
          setAuth({ role: "donor", userName: "Eko Hotel" })
        }
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <Topbar
          role={role}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-5">{renderView()}</main>
      </div>

      {/* DEV ROLE SWITCHER (REMOVE LATER) */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={() =>
            setAuth({ role: "donor", userName: "Eko Hotel" })
          }
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Donor
        </button>

        <button
          onClick={() =>
            setAuth({ role: "partner", userName: "Partner User" })
          }
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Partner
        </button>

        <button
          onClick={() =>
            setAuth({ role: "admin", userName: "Admin User" })
          }
          className="px-3 py-1 bg-black text-white rounded"
        >
          Admin
        </button>
      </div>
    </div>
  );
}