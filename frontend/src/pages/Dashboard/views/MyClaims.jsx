import { CheckCircle } from "lucide-react";

function MyClaims() {
  const claims = [
    { id: 1, item: "Bread", status: "Pending" },
    { id: 2, item: "Rice", status: "Approved" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">My Claims</h1>

      <div className="space-y-3">
        {claims.map((c) => (
          <div
            key={c.id}
            className="bg-white border p-4 rounded-2xl flex justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle />
              <p className="font-medium">{c.item}</p>
            </div>

            <span className="text-sm text-gray-600">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyClaims;