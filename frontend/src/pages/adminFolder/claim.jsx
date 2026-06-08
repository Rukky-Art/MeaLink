import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { claims } from "../data/mockData.js";

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          c.claimer.name.toLowerCase().includes(s) ||
          c.donor.name.toLowerCase().includes(s) ||
          c.food.food_type.toLowerCase().includes(s) ||
          c.pickup_code.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [statusFilter, search]);

  const stats = useMemo(() => ({
    total:       claims.length,
    pending:     claims.filter(c => c.status === "pending").length,
    claimed:     claims.filter(c => c.status === "claimed").length,
    picked_up:   claims.filter(c => c.status === "picked_up").length,
    distributed: claims.filter(c => c.status === "distributed").length,
    cancelled:   claims.filter(c => c.status === "cancelled").length,
  }), []);

  return (
    <div>
      <PageHeader
        title="Claims"
        subtitle={`${filtered.length} claim${filtered.length === 1 ? "" : "s"} matching filters · ${claims.length} total`}
        actions={
          <button className="px-3.5 py-1.5 text-[13px] border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {[
          { key: "",               label: "All",        value: stats.total, color: "bg-gray-50 text-gray-900" },
          { key: "pending",        label: "Pending",    value: stats.pending, color: "bg-yellow-50 text-yellow-800" },
          { key: "claimed",        label: "Claimed",    value: stats.claimed, color: "bg-orange-50 text-orange-800" },
          { key: "picked_up",      label: "Picked up",  value: stats.picked_up, color: "bg-blue-50 text-blue-800" },
          { key: "distributed",    label: "Distributed",value: stats.distributed, color: "bg-emerald-50 text-emerald-800" },
          { key: "cancelled",      label: "Cancelled",  value: stats.cancelled, color: "bg-red-50 text-red-800" },
        ].map((chip) => {
          const active = statusFilter === chip.key;
          return (
            <button
              key={chip.key || "all"}
              onClick={() => setStatusFilter(chip.key)}
              className={`rounded-xl px-3 py-2.5 text-left transition-all ${
                active ? `${chip.color} ring-2 ring-emerald-500` : "bg-white border border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wide opacity-70">{chip.label}</p>
              <p className="text-[20px] font-bold mt-0.5">{chip.value}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl mb-4">
        <div className="p-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by partner, donor, food, or pickup code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); }}
              className="px-3 py-2 text-[13px] text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Food", "Donor", "Partner", "Pickup code", "Claimed", "Picked up", "Status"].map((h) => (
                  <th key={h} className="text-[11px] text-gray-500 uppercase tracking-wide px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[13px] text-gray-400">
                    No claims match your filters.
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                >
                  <td className="px-4 py-3 text-[12px] text-gray-500 font-mono">#{c.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-gray-900 font-medium">{c.food.food_type}</p>
                    <p className="text-[11px] text-gray-500">{c.food.quantity_estimated} {c.food.quantity_unit}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700">{c.donor.name}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-700">{c.claimer.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12px] font-bold text-emerald-700 tracking-wider">{c.pickup_code}</span>
                    {c.pickup_code_verified && <span className="ml-1.5 text-[10px]">✅</span>}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600 whitespace-nowrap">
                    {formatDateTime(c.claim_time)}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600 whitespace-nowrap">
                    {formatDateTime(c.pickup_time)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} variant="claim" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Claim #{selected.id}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pickup code: <span className="font-mono font-bold text-emerald-700 tracking-wider">{selected.pickup_code}</span>
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} variant="claim" />
                {selected.pickup_code_verified && (
                  <span className="text-[11px] text-emerald-700 font-medium">✓ Code verified</span>
                )}
              </div>

              <Section title="Food">
                <Row label="Type" value={selected.food.food_type} />
                <Row label="Quantity" value={`${selected.food.quantity_estimated} ${selected.food.quantity_unit}`} />
                <Row label="Category" value={selected.food.category} />
                <Row label="Pickup address" value={`${selected.food.pickup_address}, ${selected.food.pickup_city}`} />
                <Row label="Pickup window" value={`${formatDateTime(selected.food.pickup_start_time)} — ${formatDateTime(selected.food.pickup_end_time)}`} />
              </Section>

              <Section title="Donor">
                <Row label="Name" value={selected.donor.name} />
                <Row label="Email" value={selected.donor.email} />
                <Row label="Phone" value={selected.donor.phone_number} />
              </Section>

              <Section title="Partner (claimer)">
                <Row label="Name" value={selected.claimer.name} />
                <Row label="Email" value={selected.claimer.email} />
                <Row label="Phone" value={selected.claimer.phone_number} />
                <Row label="Type" value={selected.claimer.organisation_type || "—"} />
              </Section>

              <Section title="Timeline">
                <Row label="Claim time" value={formatDateTime(selected.claim_time)} />
                <Row label="Pickup time" value={formatDateTime(selected.pickup_time)} />
                {selected.pickup_time && (
                  <Row
                    label="Duration"
                    value={`${((new Date(selected.pickup_time).getTime() - new Date(selected.claim_time).getTime()) / 3_600_000).toFixed(1)} hrs`}
                  />
                )}
              </Section>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[12px]">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}
