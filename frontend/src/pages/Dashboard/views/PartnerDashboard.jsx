import { Package, CheckCircle } from "lucide-react";

function PartnerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partner Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Discover and claim available food donations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Available Food</p>
          <h2 className="text-3xl font-bold">7</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">My Claims</p>
          <h2 className="text-3xl font-bold">3</h2>
        </div>
      </div>

      {/* Sample Listings */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
        <h3 className="font-semibold">Available Food</h3>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex justify-between items-center border p-3 rounded-xl"
          >
            <div>
              <p className="font-medium">Fresh Bread Batch</p>
              <p className="text-xs text-gray-500">Mombasa Center</p>
            </div>

            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerDashboard;