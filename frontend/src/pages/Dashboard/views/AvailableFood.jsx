import { Package } from "lucide-react";

function AvailableFood() {
  const items = [
    { id: 1, name: "Fresh Bread", location: "Mombasa", status: "Available" },
    { id: 2, name: "Rice Bags", location: "Nairobi", status: "Available" },
    { id: 3, name: "Vegetables", location: "Kilifi", status: "Available" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Available Food</h1>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border p-4 rounded-2xl flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <Package />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            </div>

            <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableFood;