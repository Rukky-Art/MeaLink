import { Package } from "lucide-react";

function MyListings() {
  const listings = [
    { id: 1, item: "Bread", status: "Available" },
    { id: 2, item: "Vegetables", status: "Claimed" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">My Listings</h1>

      <div className="space-y-3">
        {listings.map((l) => (
          <div
            key={l.id}
            className="bg-white border p-4 rounded-2xl flex justify-between"
          >
            <div className="flex items-center gap-3">
              <Package />
              <p className="font-medium">{l.item}</p>
            </div>

            <span className="text-sm text-gray-600">{l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;