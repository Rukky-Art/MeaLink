import Badge from "../../../components/Dashboardd/Badge";

function AdminDashboard({ allListings = [], partners = [] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border p-4 rounded-xl">
          Listings {allListings.length}
        </div>
        <div className="bg-white border p-4 rounded-xl">
          Partners {partners.length}
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left">Food</th>
              <th className="p-3 text-left">Donor</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {allListings.slice(0, 5).map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-3">{l.foodItem}</td>
                <td className="p-3">{l.donor}</td>
                <td className="p-3"><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;