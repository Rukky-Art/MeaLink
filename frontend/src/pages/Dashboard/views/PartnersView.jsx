import { Users } from "lucide-react";

function PartnersView() {
  const partners = [
    { id: 1, name: "Red Cross" },
    { id: 2, name: "Community Kitchen" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Partners</h1>

      <div className="space-y-3">
        {partners.map((p) => (
          <div
            key={p.id}
            className="bg-white border p-4 rounded-2xl flex items-center gap-3"
          >
            <Users />
            <p className="font-medium">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersView;