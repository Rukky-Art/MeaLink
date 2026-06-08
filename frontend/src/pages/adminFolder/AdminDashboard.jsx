// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllListings } from "../../store/slices/foodSlice";
// import api from "../../auth/api";

// // ── Extra fetchers (claims & distributions aren't in slices yet) ──────────────
// async function fetchClaims() {
//   const res = await api.get("claims/");
//   const data = res.data;
//   return Array.isArray(data) ? data : data?.results || [];
// }
// async function fetchDistributions() {
//   const res = await api.get("distribution/");
//   const data = res.data;
//   return Array.isArray(data) ? data : data?.results || [];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const MONTHS = ["January","February","March","April","May","June",
//   "July","August","September","October","November","December"];

// function monthLabel() {
//   const d = new Date();
//   return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
// }

// function getUserInitials() {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.name) {
//       const p = user.name.trim().split(" ");
//       return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase();
//     }
//   } catch {}
//   return "AD";
// }

// function formatDeadline(iso) {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   const diff = d - Date.now();
//   if (diff < 0) return "Expired";
//   if (diff < 3_600_000) return "Soon";
//   const h = Math.round(diff / 3_600_000);
//   if (h < 24) return "Today " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   if (h < 48) return "Tomorrow";
//   return d.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// function exportCSV(listings) {
//   if (!listings.length) return;
//   const headers = ["Food type","Quantity","Unit","Donor","City","Status","Pickup end"];
//   const rows = listings.map((l) =>
//     [l.food_type, l.quantity_estimated, l.quantity_unit,
//      l.posted_by?.name, l.pickup_city, l.status, l.pickup_end_time]
//       .map((v) => `"${v || ""}"`)
//       .join(",")
//   );
//   const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = "mealink-export.csv";
//   a.click();
// }

// // ── Status badge config ───────────────────────────────────────────────────────
// const STATUS_STYLES = {
//   available:   "bg-green-100 text-green-800",
//   claimed:     "bg-orange-100 text-orange-700",
//   picked_up:   "bg-blue-100 text-blue-800",
//   distributed: "bg-emerald-100 text-emerald-800",
//   expired:     "bg-gray-100 text-gray-500",
// };
// const STATUS_LABELS = {
//   available: "Available", claimed: "Claimed", picked_up: "Picked up",
//   distributed: "Distributed", expired: "Expired",
// };

// function StatusBadge({ status, onClick }) {
//   const key = (status || "").toLowerCase().replace(/ /g, "_");
//   return (
//     <button
//       onClick={() => onClick(key)}
//       className={`text-[11px] px-2.5 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${STATUS_STYLES[key] || "bg-gray-100 text-gray-500"}`}
//     >
//       {STATUS_LABELS[key] || status}
//     </button>
//   );
// }

// // ── Stat card ─────────────────────────────────────────────────────────────────
// function StatCard({ label, value, sub, subClass }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
//       <p className="text-xs text-gray-500 mb-1">{label}</p>
//       <p className="text-2xl font-medium text-gray-900">{value ?? "—"}</p>
//       {sub && <p className={`text-[11px] mt-0.5 ${subClass}`}>{sub}</p>}
//     </div>
//   );
// }

// // ── Spinner ───────────────────────────────────────────────────────────────────
// function Spinner({ sm }) {
//   return (
//     <div className={`${sm ? "w-4 h-4" : "w-5 h-5"} border-2 border-gray-200 border-t-emerald-700 rounded-full animate-spin`} />
//   );
// }

// const DONOR_COLORS = ["#1a7a4a","#2196f3","#ff9800","#9c27b0","#e91e63","#00bcd4"];

// // ── Main component ────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const dispatch   = useDispatch();
//   const { listings, loading: foodLoading } = useSelector((s) => s.food);
//   const { user }   = useSelector((s) => s.auth);
//   const token      = useSelector((s) => s.auth.token);

//   const [claims,        setClaims]        = useState([]);
//   const [distributions, setDistributions] = useState([]);
//   const [extraLoading,  setExtraLoading]  = useState(true);
//   const [statusFilter,  setStatusFilter]  = useState("");
//   const [noAuth,        setNoAuth]        = useState(false);

//   // Safely unwrap listings (handles array or paginated object)
//   const allListings = Array.isArray(listings) ? listings : listings?.results || [];

//   // ── Fetch on mount ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!token) { setNoAuth(true); setExtraLoading(false); return; }
//     dispatch(fetchAllListings());
//     (async () => {
//       try {
//         const [c, d] = await Promise.all([fetchClaims(), fetchDistributions()]);
//         setClaims(c);
//         setDistributions(d);
//       } catch (e) {
//         if (e?.response?.status === 401) setNoAuth(true);
//       } finally {
//         setExtraLoading(false);
//       }
//     })();
//   }, [dispatch, token]);

//   const loading = foodLoading || extraLoading;

//   // ── Computed stats ──────────────────────────────────────────────────────────
//   const total        = allListings.length;
//   const available    = allListings.filter((l) => l.status === "available").length;
//   const claimed      = allListings.filter((l) => l.status === "claimed").length;
//   const pickedUp     = allListings.filter((l) => l.status === "picked_up").length;
//   const distributed  = allListings.filter((l) => l.status === "distributed").length;
//   const expired      = allListings.filter((l) => l.status === "expired").length;
//   const claimable    = total - expired;
//   const claimRate    = claimable > 0
//     ? Math.round(((claimed + pickedUp + distributed) / claimable) * 100)
//     : 0;

//   const totalMeals  = distributions.reduce((a, d) => a + (d.recipients_count || 0), 0);
//   const households  = distributions.reduce((a, d) => a + (d.households_served || 0), 0);
//   const wasteKg     = Math.round(
//     allListings.filter((l) => l.status === "distributed")
//       .reduce((a, l) => a + (parseFloat(l.quantity_estimated) || 0), 0)
//   );

//   const completedClaims = claims.filter((c) => c.claim_time && c.pickup_time);
//   const avgClaim = completedClaims.length
//     ? (completedClaims
//         .reduce((a, c) => a + (new Date(c.pickup_time) - new Date(c.claim_time)) / 3_600_000, 0)
//         / completedClaims.length
//       ).toFixed(1)
//     : null;

//   const thisWeek = allListings.filter((l) => {
//     const d = new Date(l.created_at);
//     return Date.now() - d < 7 * 86_400_000;
//   }).length;

//   // Top donors
//   const donorMap = {};
//   allListings.forEach((l) => {
//     if (l.posted_by?.name) donorMap[l.posted_by.name] = (donorMap[l.posted_by.name] || 0) + 1;
//   });
//   const topDonors = Object.entries(donorMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

//   const activeDonors = new Set(
//     allListings.filter((l) => l.posted_by?.role === "donor").map((l) => l.posted_by?.id).filter(Boolean)
//   ).size || topDonors.length;

//   const activePartners = new Set(
//     allListings.filter((l) => l.posted_by?.role === "partner").map((l) => l.posted_by?.id).filter(Boolean)
//   ).size;

//   // ── Filtered table ──────────────────────────────────────────────────────────
//   const filtered = statusFilter
//     ? allListings.filter((l) => (l.status || "").toLowerCase().replace(/ /g, "_") === statusFilter)
//     : allListings;

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">

//       {/* ── Top bar ── */}
//       <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-[52px]">
//         <div className="flex items-center gap-2.5">
//           <img src="/src/assets/logo1.png" alt="MeaLink logo" className="w-8 h-8 object-contain" />
//           <span className="text-[15px] font-medium text-gray-900">MeaLink</span>
//           <span className="text-[13px] text-emerald-700 font-medium ml-1">Admin</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md">
//             This month
//           </span>
//           <div className="w-[30px] h-[30px] rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-medium">
//             {user?.name
//               ? user.name.trim().split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
//               : getUserInitials()}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-[1200px] mx-auto px-6 py-6">

//         {/* ── Auth banner ── */}
//         {noAuth && (
//           <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 text-xs text-orange-700 mb-4 flex items-center gap-2">
//             🔒 Not authenticated — log in first so the token is saved, then reload this page.
//           </div>
//         )}

//         {/* ── Page header ── */}
//         <div className="flex items-start justify-between mb-5">
//           <div>
//             <h1 className="text-[18px] font-medium text-gray-900">
//               Platform overview — {monthLabel()}
//             </h1>
//             <p className="text-[13px] text-gray-500 mt-0.5">
//               Monitoring all donation activity across the MeaLink network.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => exportCSV(allListings)}
//               className="px-3.5 py-1.5 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
//             >
//               Export CSV
//             </button>
//             <button className="px-3.5 py-1.5 text-[13px] bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors cursor-pointer">
//               Send report
//             </button>
//           </div>
//         </div>

//         {/* ── Stat cards ── */}
//         <div className="grid grid-cols-5 gap-3 mb-4">
//           <StatCard label="Total listings"    value={total}       sub={`+${thisWeek} this week`}  subClass="text-emerald-700" />
//           <StatCard label="Available now"     value={available}   sub="Open for claim"             subClass="text-gray-400" />
//           <StatCard label="Claimed"           value={claimed}     sub="Awaiting pickup"            subClass="text-gray-400" />
//           <StatCard label="Distributed"       value={distributed} sub="Completed"                  subClass="text-emerald-700" />
//           <StatCard label="Expired unclaimed" value={expired}     sub="Needs attention"            subClass="text-red-500" />
//         </div>

//         {/* ── Metrics ── */}
//         <div className="grid grid-cols-3 gap-3 mb-5">
//           {/* Claim rate */}
//           <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
//             <p className="text-xs text-gray-500 mb-1.5">Claim rate</p>
//             <p className="text-[26px] font-medium text-gray-900">{claimRate}%</p>
//             <div className="h-1 bg-gray-100 rounded-full mt-2.5 overflow-hidden">
//               <div
//                 className="h-full bg-emerald-700 rounded-full transition-all duration-700"
//                 style={{ width: `${claimRate}%` }}
//               />
//             </div>
//           </div>
//           {/* Meals */}
//           <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
//             <p className="text-xs text-gray-500 mb-1.5">Meals redistributed</p>
//             <p className="text-[26px] font-medium text-gray-900">{totalMeals.toLocaleString() || "—"}</p>
//             <p className="text-[11px] text-gray-400 mt-0.5">Est. across all donations</p>
//           </div>
//           {/* Avg time */}
//           <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
//             <p className="text-xs text-gray-500 mb-1.5">Avg. time to claim</p>
//             <p className="text-[26px] font-medium text-gray-900">{avgClaim ? `${avgClaim} hrs` : "—"}</p>
//             <p className="text-[11px] text-emerald-700 mt-0.5">{avgClaim ? "Based on completed claims" : ""}</p>
//           </div>
//         </div>

//         {/* ── Content grid ── */}
//         <div className="grid grid-cols-[1fr_280px] gap-4">

//           {/* Table */}
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//             <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-200">
//               <span className="text-[13px] font-medium text-gray-900">All active donations</span>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="text-xs px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-500 cursor-pointer"
//               >
//                 <option value="">All statuses</option>
//                 <option value="available">Available</option>
//                 <option value="claimed">Claimed</option>
//                 <option value="picked_up">Picked up</option>
//                 <option value="distributed">Distributed</option>
//                 <option value="expired">Expired</option>
//               </select>
//             </div>

//             {loading ? (
//               <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
//                 <Spinner sm /> Loading donations…
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="flex items-center justify-center py-10 text-sm text-gray-400">
//                 No donations found.
//               </div>
//             ) : (
//               <table className="w-full">
//                 <thead>
//                   <tr>
//                     {["Donation","Donor","Zone","Deadline","Status"].map((h) => (
//                       <th
//                         key={h}
//                         className="text-[11px] text-gray-400 uppercase tracking-wide px-4 py-2.5 text-left border-b border-gray-100 font-normal"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((l) => (
//                     <tr key={l.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="text-[13px] text-gray-900 px-4 py-3 border-b border-gray-50 max-w-[220px] truncate">
//                         {l.food_type || "—"} — {l.quantity_estimated} {l.quantity_unit}
//                       </td>
//                       <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50 max-w-[160px] truncate">
//                         {l.posted_by?.name || "—"}
//                       </td>
//                       <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50">
//                         {l.pickup_city || "—"}
//                       </td>
//                       <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50 whitespace-nowrap">
//                         {formatDeadline(l.pickup_end_time)}
//                       </td>
//                       <td className="px-4 py-3 border-b border-gray-50">
//                         <StatusBadge status={l.status} onClick={setStatusFilter} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Right column */}
//           <div className="flex flex-col gap-3.5">

//             {/* Top donors */}
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <p className="text-[13px] font-medium text-gray-900 mb-3">Top donors</p>
//               {loading ? (
//                 <div className="flex justify-center py-4"><Spinner sm /></div>
//               ) : topDonors.length === 0 ? (
//                 <p className="text-[13px] text-gray-400 py-2">No donor data yet</p>
//               ) : (
//                 <div className="divide-y divide-gray-50">
//                   {topDonors.map(([name, count], i) => (
//                     <div key={name} className="flex items-center gap-2.5 py-2">
//                       <div
//                         className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
//                         style={{ background: DONOR_COLORS[i % DONOR_COLORS.length] + "22", color: DONOR_COLORS[i % DONOR_COLORS.length] }}
//                       >
//                         {name[0].toUpperCase()}
//                       </div>
//                       <span className="text-[13px] text-gray-900 flex-1 truncate">{name}</span>
//                       <span className="text-xs text-gray-400 whitespace-nowrap">
//                         {count} listing{count > 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Network health */}
//             <div className="bg-emerald-700 rounded-lg p-4">
//               <p className="text-[11px] text-emerald-200 mb-0.5">Network health</p>
//               <p className="text-[13px] font-medium text-white mb-3">This month at a glance</p>
//               <div className="space-y-2">
//                 {[
//                   ["Active donors",     activeDonors  || "—"],
//                   ["Active partners",   activePartners || "—"],
//                   ["Households served", households    || "—"],
//                   ["Food waste avoided", wasteKg ? `~${wasteKg} kg` : "—"],
//                 ].map(([label, val]) => (
//                   <div key={label} className="flex justify-between">
//                     <span className="text-[12px] text-emerald-100">{label}</span>
//                     <span className="text-[12px] text-white font-medium">{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Needs attention */}
//             {expired > 0 && (
//               <div className="bg-white border border-gray-200 rounded-lg p-4">
//                 <p className="text-xs font-medium text-gray-400 mb-1.5">⚠ Needs attention</p>
//                 <p className="text-[13px] text-gray-800 leading-relaxed">
//                   <span className="text-red-600 font-medium">
//                     {expired} listing{expired > 1 ? "s" : ""} expired
//                   </span>{" "}
//                   without being claimed this month. Consider reaching out to donors to improve listing timing.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllListings } from "../../store/slices/foodSlice";
import api from "../../auth/api";
import DonationJourney from "../../components/DonationJourney";

// ── Extra fetchers ────────────────────────────────────────────────────────────
async function fetchClaims() {
  const res  = await api.get("claims/");
  const data = res.data;
  return Array.isArray(data) ? data : data?.results || [];
}
async function fetchDistributions() {
  const res  = await api.get("distribution/");
  const data = res.data;
  return Array.isArray(data) ? data : data?.results || [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

function monthLabel() {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function getUserInitials(name) {
  if (!name) return "AD";
  const p = name.trim().split(" ");
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase();
}

function formatDeadline(iso) {
  if (!iso) return "—";
  const d    = new Date(iso);
  const diff = d - Date.now();
  if (diff < 0)         return "Expired";
  if (diff < 3_600_000) return "Soon";
  const h = Math.round(diff / 3_600_000);
  if (h < 24) return "Today " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (h < 48) return "Tomorrow";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function exportCSV(listings) {
  if (!listings.length) return;
  const headers = ["Food type","Quantity","Unit","Donor","City","Status","Pickup end"];
  const rows = listings.map((l) =>
    [l.food_type, l.quantity_estimated, l.quantity_unit,
     l.posted_by?.name, l.pickup_city, l.status, l.pickup_end_time]
      .map((v) => `"${v || ""}"`)
      .join(",")
  );
  const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = "mealink-export.csv";
  a.click();
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  available:   "bg-green-100 text-green-800",
  claimed:     "bg-orange-100 text-orange-700",
  picked_up:   "bg-blue-100 text-blue-800",
  distributed: "bg-emerald-100 text-emerald-800",
  expired:     "bg-gray-100 text-gray-500",
};
const STATUS_LABELS = {
  available: "Available", claimed: "Claimed", picked_up: "Picked up",
  distributed: "Distributed", expired: "Expired",
};

function StatusBadge({ status, onClick }) {
  const key = (status || "").toLowerCase().replace(/ /g, "_");
  return (
    <button
      onClick={() => onClick(key)}
      className={`text-[11px] px-2.5 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${STATUS_STYLES[key] || "bg-gray-100 text-gray-500"}`}
    >
      {STATUS_LABELS[key] || status}
    </button>
  );
}

function StatCard({ label, value, sub, subClass }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value ?? "—"}</p>
      {sub && <p className={`text-[11px] mt-0.5 ${subClass}`}>{sub}</p>}
    </div>
  );
}

function Spinner({ sm }) {
  return (
    <div className={`${sm ? "w-4 h-4" : "w-5 h-5"} border-2 border-gray-200 border-t-emerald-700 rounded-full animate-spin`} />
  );
}

const DONOR_COLORS = ["#1a7a4a","#2196f3","#ff9800","#9c27b0","#e91e63","#00bcd4"];

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { listings, loading: foodLoading } = useSelector((s) => s.food);
  const { user, token } = useSelector((s) => s.auth);

  const [claims,        setClaims]        = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [extraLoading,  setExtraLoading]  = useState(true);
  const [statusFilter,  setStatusFilter]  = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null); // for donation journey drawer

  // ── FIX 1: derive noAuth from token directly — no setState in effect ──────
  const noAuth = !token;

  const allListings = Array.isArray(listings) ? listings : listings?.results || [];

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    // No setState calls here — noAuth is derived above
    if (!token) { setExtraLoading(false); return; }

    dispatch(fetchAllListings());

    (async () => {
      try {
        const [c, d] = await Promise.all([fetchClaims(), fetchDistributions()]);
        setClaims(c);
        setDistributions(d);
      } catch {
        // silently handle — noAuth already derived from token
      } finally {
        setExtraLoading(false);
      }
    })();
  }, [dispatch, token]);

  const loading = foodLoading || extraLoading;

  // ── FIX 2: Date.now() called inside useMemo so it's not in render body ───
  const now = useMemo(() => Date.now(), []);

  // ── Computed stats ────────────────────────────────────────────────────────
  const total       = allListings.length;
  const available   = allListings.filter((l) => l.status === "available").length;
  const claimed     = allListings.filter((l) => l.status === "claimed").length;
  const pickedUp    = allListings.filter((l) => l.status === "picked_up").length;
  const distributed = allListings.filter((l) => l.status === "distributed").length;
  const expired     = allListings.filter((l) => l.status === "expired").length;
  const claimable   = total - expired;
  const claimRate   = claimable > 0
    ? Math.round(((claimed + pickedUp + distributed) / claimable) * 100)
    : 0;

  const totalMeals = distributions.reduce((a, d) => a + (d.recipients_count || 0), 0);
  const households = distributions.reduce((a, d) => a + (d.households_served || 0), 0);
  const wasteKg    = Math.round(
    allListings
      .filter((l) => l.status === "distributed")
      .reduce((a, l) => a + (parseFloat(l.quantity_estimated) || 0), 0)
  );

  const completedClaims = claims.filter((c) => c.claim_time && c.pickup_time);
  const avgClaim = completedClaims.length
    ? (completedClaims.reduce((a, c) =>
        a + (new Date(c.pickup_time) - new Date(c.claim_time)) / 3_600_000, 0)
      / completedClaims.length).toFixed(1)
    : null;

  // FIX 2 applied — use memoized `now` instead of Date.now() in render
  const thisWeek = useMemo(() =>
    allListings.filter((l) => now - new Date(l.created_at) < 7 * 86_400_000).length,
    [allListings, now]
  );

  // Top donors
  const { topDonors, activeDonors, activePartners } = useMemo(() => {
    const donorMap = {};
    const donorIds   = new Set();
    const partnerIds = new Set();

    allListings.forEach((l) => {
      if (l.posted_by?.name) {
        donorMap[l.posted_by.name] = (donorMap[l.posted_by.name] || 0) + 1;
      }
      if (l.posted_by?.role === "donor"   && l.posted_by?.id) donorIds.add(l.posted_by.id);
      if (l.posted_by?.role === "partner" && l.posted_by?.id) partnerIds.add(l.posted_by.id);
    });

    return {
      topDonors:     Object.entries(donorMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
      activeDonors:  donorIds.size   || Object.keys(donorMap).length,
      activePartners: partnerIds.size,
    };
  }, [allListings]);

  // Filtered table rows
  const filtered = useMemo(() =>
    statusFilter
      ? allListings.filter((l) => (l.status || "").toLowerCase().replace(/ /g, "_") === statusFilter)
      : allListings,
    [allListings, statusFilter]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-[52px]">
        <div className="flex items-center gap-2.5">
          <img src="/src/assets/logo1.png" alt="MeaLink logo" className="w-8 h-8 object-contain" />
          <span className="text-[15px] font-medium text-gray-900">MeaLink</span>
          <span className="text-[13px] text-emerald-700 font-medium ml-1">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md">
            This month
          </span>
          <div className="w-[30px] h-[30px] rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-medium">
            {getUserInitials(user?.name)}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6">

        {/* Auth banner */}
        {noAuth && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 text-xs text-orange-700 mb-4 flex items-center gap-2">
            🔒 Not authenticated — log in first so the token is saved, then reload this page.
          </div>
        )}

        {/* Page header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[18px] font-medium text-gray-900">
              Platform overview — {monthLabel()}
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Monitoring all donation activity across the MeaLink network.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV(allListings)}
              className="px-3.5 py-1.5 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Export CSV
            </button>
            <button className="px-3.5 py-1.5 text-[13px] bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors cursor-pointer">
              Send report
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <StatCard label="Total listings"    value={total}       sub={`+${thisWeek} this week`} subClass="text-emerald-700" />
          <StatCard label="Available now"     value={available}   sub="Open for claim"            subClass="text-gray-400" />
          <StatCard label="Claimed"           value={claimed}     sub="Awaiting pickup"           subClass="text-gray-400" />
          <StatCard label="Distributed"       value={distributed} sub="Completed"                 subClass="text-emerald-700" />
          <StatCard label="Expired unclaimed" value={expired}     sub="Needs attention"           subClass="text-red-500" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
            <p className="text-xs text-gray-500 mb-1.5">Claim rate</p>
            <p className="text-[26px] font-medium text-gray-900">{claimRate}%</p>
            <div className="h-1 bg-gray-100 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-emerald-700 rounded-full transition-all duration-700" style={{ width: `${claimRate}%` }} />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
            <p className="text-xs text-gray-500 mb-1.5">Meals redistributed</p>
            <p className="text-[26px] font-medium text-gray-900">{totalMeals.toLocaleString() || "—"}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Est. across all donations</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3.5">
            <p className="text-xs text-gray-500 mb-1.5">Avg. time to claim</p>
            <p className="text-[26px] font-medium text-gray-900">{avgClaim ? `${avgClaim} hrs` : "—"}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">{avgClaim ? "Based on completed claims" : ""}</p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-200">
              <span className="text-[13px] font-medium text-gray-900">All active donations</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-500 cursor-pointer"
              >
                <option value="">All statuses</option>
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="picked_up">Picked up</option>
                <option value="distributed">Distributed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
                <Spinner sm /> Loading donations…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                No donations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      {["Donation","Donor","Zone","Deadline","Status","Journey"].map((h) => (
                        <th key={h} className="text-[11px] text-gray-400 uppercase tracking-wide px-4 py-2.5 text-left border-b border-gray-100 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => {
                      // Find the claim for this listing to get journey status
                      const claim = claims.find(c =>
                        (c.food?.id ?? c.food) === l.id
                      );
                      return (
                        <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                          <td className="text-[13px] text-gray-900 px-4 py-3 border-b border-gray-50 max-w-[200px] truncate">
                            {l.food_type || "—"} — {l.quantity_estimated} {l.quantity_unit}
                          </td>
                          <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50 max-w-[140px] truncate">
                            {l.posted_by?.name || "—"}
                          </td>
                          <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50">
                            {l.pickup_city || "—"}
                          </td>
                          <td className="text-[13px] text-gray-700 px-4 py-3 border-b border-gray-50 whitespace-nowrap">
                            {formatDeadline(l.pickup_end_time)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-50">
                            <StatusBadge status={l.status} onClick={setStatusFilter} />
                          </td>
                          <td className="px-4 py-3 border-b border-gray-50">
                            {/* Journey button — only meaningful for claimed+ */}
                            {['claimed','picked_up','distributed'].includes(l.status) ? (
                              <button
                                onClick={() => setSelectedClaim({ listing: l, claim })}
                                className="text-[11px] text-emerald-700 hover:underline font-medium whitespace-nowrap"
                              >
                                View journey
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3.5">

            {/* Top donors */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[13px] font-medium text-gray-900 mb-3">Top donors</p>
              {loading ? (
                <div className="flex justify-center py-4"><Spinner sm /></div>
              ) : topDonors.length === 0 ? (
                <p className="text-[13px] text-gray-400 py-2">No donor data yet</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {topDonors.map(([name, count], i) => (
                    <div key={name} className="flex items-center gap-2.5 py-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
                        style={{ background: DONOR_COLORS[i % DONOR_COLORS.length] + "22", color: DONOR_COLORS[i % DONOR_COLORS.length] }}
                      >
                        {name[0].toUpperCase()}
                      </div>
                      <span className="text-[13px] text-gray-900 flex-1 truncate">{name}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {count} listing{count > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Network health */}
            <div className="bg-emerald-700 rounded-lg p-4">
              <p className="text-[11px] text-emerald-200 mb-0.5">Network health</p>
              <p className="text-[13px] font-medium text-white mb-3">This month at a glance</p>
              <div className="space-y-2">
                {[
                  ["Active donors",      activeDonors   || "—"],
                  ["Active partners",    activePartners  || "—"],
                  ["Households served",  households      || "—"],
                  ["Food waste avoided", wasteKg ? `~${wasteKg} kg` : "—"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[12px] text-emerald-100">{label}</span>
                    <span className="text-[12px] text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs attention */}
            {expired > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-400 mb-1.5">⚠ Needs attention</p>
                <p className="text-[13px] text-gray-800 leading-relaxed">
                  <span className="text-red-600 font-medium">
                    {expired} listing{expired > 1 ? "s" : ""} expired
                  </span>{" "}
                  without being claimed this month. Consider reaching out to donors to improve listing timing.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Donation Journey drawer ── */}
      {selectedClaim && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setSelectedClaim(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-900 text-base">Donation Journey</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
                  {selectedClaim.listing.food_type} — {selectedClaim.listing.pickup_city}
                </p>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <SummaryRow label="Food"     value={`${selectedClaim.listing.food_type} — ${selectedClaim.listing.quantity_estimated} ${selectedClaim.listing.quantity_unit}`} />
                <SummaryRow label="Donor"    value={selectedClaim.listing.posted_by?.name || "—"} />
                <SummaryRow label="Location" value={`${selectedClaim.listing.pickup_address || "—"}, ${selectedClaim.listing.pickup_city || ""}`} />
                {selectedClaim.claim && (
                  <>
                    <SummaryRow label="Partner"   value={selectedClaim.claim.claimer?.name || "—"} />
                    <SummaryRow label="Pickup code"
                      value={
                        <span className="font-black tracking-widest text-emerald-700">
                          {selectedClaim.claim.pickup_code}
                        </span>
                      }
                    />
                    <SummaryRow label="Code verified" value={selectedClaim.claim.pickup_code_verified ? "✅ Yes" : "⏳ Pending"} />
                  </>
                )}
                <SummaryRow
                  label="Status"
                  value={
                    <StatusBadge status={selectedClaim.listing.status} onClick={() => {}} />
                  }
                />
              </div>

              {/* DonationJourney component — reused from partner/donor views */}
              <DonationJourney
                status={selectedClaim.claim?.status || 'available'}
                pickup_code_verified={selectedClaim.claim?.pickup_code_verified || false}
                donorName={selectedClaim.listing.posted_by?.name}
                partnerName={selectedClaim.claim?.claimer?.name}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const SummaryRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-[11px] text-gray-400 uppercase tracking-wide shrink-0">{label}</span>
    <span className="text-[13px] text-gray-900 font-medium text-right">{value}</span>
  </div>
);
