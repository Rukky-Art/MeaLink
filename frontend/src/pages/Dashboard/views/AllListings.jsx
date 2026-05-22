import Badge from "../../../components/Dashboardd/Badge";

function AllListings({ allListings = [] }) {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">All Listings</h1>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left">Food</th>
              <th className="p-3 text-left">Donor</th>
              <th className="p-3 text-left">Partner</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {allListings.map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-3">{l.foodItem}</td>
                <td className="p-3">{l.donor}</td>
                <td className="p-3">{l.partner || "-"}</td>
                <td className="p-3"><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllListings;