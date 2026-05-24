import { Package, Plus,} from "lucide-react";

function DonorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Manage your food donations and track impact
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Donations</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Listings</p>
          <h2 className="text-3xl font-bold">4</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">People Helped</p>
          <h2 className="text-3xl font-bold">89</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-semibold mb-3">Quick Actions</h3>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl">
            <Plus size={18} /> Donate Food
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl">
            <Package size={18} /> View Listings
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;