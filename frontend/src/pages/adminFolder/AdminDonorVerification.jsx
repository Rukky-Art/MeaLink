// import { useState, useMemo, useEffect } from 'react';
// import { useSearchParams } from 'react-router';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   CheckCircle, XCircle, Search, Eye, X, AlertTriangle,
//   MapPin, Shield, ClipboardList, Check, ZoomIn,
// } from 'lucide-react';
// import {
//   fetchPanelUsers, reviewPanelUser, resetAdminStatus,
//   selectPanelUsers, selectAdminIsLoading, selectAdminError,
//   selectAdminActionLoading, selectAdminActionError,
// } from '../../store/slices/adminSlice';

// const REJECTION_REASONS = [
//   'Invalid or unverifiable registration number',
//   'Incomplete or missing documents',
//   'Registration certificate expired',
//   'Organisation details do not match certificate',
//   'Not a legitimate food business',
//   'Suspicious or fraudulent activity suspected',
//   'Other (add note below)',
// ];

// const ORG_TYPE_LABELS = {
//   food_bank: 'Food Bank', ngo: 'NGO / Non-profit',
//   community_group: 'Community Group', restaurant: 'Restaurant',
//   bakery: 'Bakery', hotel: 'Hotel', catering: 'Catering',
//   supermarket: 'Supermarket', event_center: 'Event Center',
//   cafeteria: 'Cafeteria', other: 'Other',
// };

// const STATUS_CONFIG = {
//   pending:  { label: 'Pending',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  },
//   verified: { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
//   rejected: { label: 'Rejected', bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400'    },
// };

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// const DetailRow = ({ label, value }) => (
//   <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
//     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 w-44">{label}</span>
//     <span className="text-sm font-semibold text-slate-800 text-right">{value || '—'}</span>
//   </div>
// );

// const AdminDonorVerification = () => {
//   const dispatch = useDispatch();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // ── FIX: derive activeTab directly from the URL — no local state mirror ──
//   // This removes the setState-in-effect entirely. The URL is the single
//   // source of truth; activeTab is just a read of it, recomputed on render.
//   const activeTab = searchParams.get('status') || 'pending';

//   const panelUsers   = useSelector(selectPanelUsers);
//   const pageLoading  = useSelector(selectAdminIsLoading);
//   const pageError    = useSelector(selectAdminError);
//   const actionLoading = useSelector(selectAdminActionLoading);
//   const actionErrorFromStore = useSelector(selectAdminActionError);

//   const [search,          setSearch]          = useState('');
//   const [selected,        setSelected]        = useState(null);
//   const [modalMode,       setModalMode]       = useState(null);
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [adminNote,       setAdminNote]       = useState('');
//   const [certZoomed,      setCertZoomed]      = useState(false);
//   const [toast,           setToast]           = useState(null);

//   // Fetch donors whenever the tab (URL status param) changes
//   useEffect(() => {
//     dispatch(fetchPanelUsers({ role: 'donor', status: activeTab }));
//   }, [dispatch, activeTab]);

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // Since the backend already filters by status via the query param,
//   // `panelUsers` already reflects the active tab. We still compute stats
//   // by fetching counts client-side from what's loaded for "all" if needed,
//   // but for simplicity here stats reflect the currently loaded tab's data.
//   const stats = useMemo(() => ({
//     total:    panelUsers.length,
//     verified: panelUsers.filter(d => d.verification_status === 'verified').length,
//     pending:  panelUsers.filter(d => d.verification_status === 'pending').length,
//     rejected: panelUsers.filter(d => d.verification_status === 'rejected').length,
//   }), [panelUsers]);

//   const filtered = useMemo(() => {
//     if (!search.trim()) return panelUsers;
//     const q = search.toLowerCase();
//     return panelUsers.filter(d =>
//       d.name?.toLowerCase().includes(q) ||
//       d.city?.toLowerCase().includes(q) ||
//       d.business_registration_number?.toLowerCase().includes(q)
//     );
//   }, [panelUsers, search]);

//   const openModal = (donor, mode) => {
//     setSelected(donor);
//     setModalMode(mode);
//     setRejectionReason('');
//     setAdminNote(donor.admin_note || '');
//     setCertZoomed(false);
//     dispatch(resetAdminStatus());
//   };

//   const closeModal = () => {
//     setSelected(null);
//     setModalMode(null);
//     dispatch(resetAdminStatus());
//   };

// const handleApprove = async () => {
//   const result = await dispatch(reviewPanelUser({
//     userId: selected.id, 
//     isVerified: true, 
//     adminNote, // Will map cleanly to "note" in the thunk payload
//   }));
//   if (reviewPanelUser.fulfilled.match(result)) {
//     closeModal();
//     showToast(`${selected.user.business_name} has been verified`);
//   }
// };

// const handleReject = async () => {
//   if (!rejectionReason) return;
//   const result = await dispatch(reviewPanelUser({
//     userId: selected.id, 
//     isVerified: false, 
//     rejectionReason, 
//     adminNote,
//   }));
//   if (reviewPanelUser.fulfilled.match(result)) {
//     closeModal();
//     showToast(`${selected.user.business_name} has been rejected`, 'error');
//   }
// };

//   const switchTab = (key) => {
//     setSearchParams(key === 'all' ? {} : { status: key });
//   };
//   const tabs = [
//     { key: 'all',      label: 'All'      },
//     { key: 'pending',  label: 'Pending'  },
//     { key: 'verified', label: 'Verified' },
//     { key: 'rejected', label: 'Rejected' },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-be-vietnam">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <Shield size={20} className="text-blue-500" />
//               <h1 className="text-2xl font-black text-slate-900">Donor Verification</h1>
//               <span className="text-[10px] font-bold bg-slate-800 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">Admin</span>
//             </div>
//             <p className="text-sm text-slate-400">
//               Review donor organisations — verify their business registration before they can post food listings.
//             </p>
//           </div>
//           {stats.pending > 0 && activeTab === 'pending' && (
//             <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-right shrink-0">
//               <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
//               <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Pending review</p>
//             </div>
//           )}
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//           {[
//             { label: 'Loaded',   value: stats.total,    color: 'text-slate-800'   },
//             { label: 'Verified', value: stats.verified, color: 'text-emerald-600' },
//             { label: 'Pending',  value: stats.pending,  color: 'text-amber-600'   },
//             { label: 'Rejected', value: stats.rejected, color: 'text-red-600'     },
//           ].map(s => (
//             <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
//               <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Table card */}
//         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//             <div className="flex gap-2 flex-wrap">
//               {tabs.map(t => (
//                 <button key={t.key} onClick={() => switchTab(t.key)}
//                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2
//                     ${activeTab === t.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-transparent hover:border-slate-200'}`}>
//                   {t.label}
//                 </button>
//               ))}
//             </div>
//             <div className="relative w-full sm:w-64">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input value={search} onChange={e => setSearch(e.target.value)}
//                 placeholder="Search name, city, reg no…"
//                 className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-300 transition-all" />
//             </div>
//           </div>

//           {pageLoading ? (
//             <div className="p-16 flex flex-col items-center gap-3">
//               <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//               </svg>
//               <p className="text-sm text-slate-400">Loading donors…</p>
//             </div>
//           ) : pageError ? (
//             <div className="p-16 text-center">
//               <p className="text-red-500 font-bold mb-2">
//                 {typeof pageError === 'string' ? pageError : pageError?.detail || 'Failed to load donors.'}
//               </p>
//               <button onClick={() => dispatch(fetchPanelUsers({ role: 'donor', status: activeTab }))} className="text-brand-green font-bold underline text-sm">
//                 Retry
//               </button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50/60">
//                     {['Organisation', 'Type', 'Reg Number', 'Zone', 'Status', 'Actions'].map(h => (
//                       <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {filtered.length === 0 ? (
//                     <tr><td colSpan={6} className="px-5 py-16 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <ClipboardList size={32} className="text-slate-200" />
//                         <p className="text-sm font-bold text-slate-400">No donor organisations found</p>
//                       </div>
//                     </td></tr>
//                   ) : filtered.map(d => (
//                     <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
//                       <td className="px-5 py-4">
//                         <p className="font-bold text-slate-800 text-sm">{d.user.business_name}</p>
//                         <p className="text-xs text-slate-400 mt-0.5">{d.email}</p>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
//                         {ORG_TYPE_LABELS[d.user.organisation_type] || d.user.organisation_type || '—'}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-slate-600">
//                         {d.user.business_registration_number || '—'}
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-1 text-slate-500 text-sm">
//                           <MapPin size={13} className="text-slate-400 shrink-0" />{d.user.country || '—'}
//                         </div>
//                       </td>
//                       <td className="px-5 py-4"><StatusBadge status={d.donor_detail?.verification_status || '-'} /></td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <button onClick={() => openModal(d, 'view')}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
//                             <Eye size={13} /> View
//                           </button>
//                           {(d.verification_status === 'pending' || !d.verification_status) && (<>
//                             <button onClick={() => openModal(d, 'approve')}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all">
//                               <CheckCircle size={13} /> Approve
//                             </button>
//                             <button onClick={() => openModal(d, 'reject')}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-all">
//                               <XCircle size={13} /> Reject
//                             </button>
//                           </>)}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {selected && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-7 py-5 flex items-start justify-between z-10">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <h2 className="text-lg font-black text-slate-900">{selected.user.business_name}</h2>
//                   <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Donor</span>
//                 </div>
//                 <p className="text-xs text-slate-400">Reg. {selected.user.business_registration_number || '—'}</p>
//               </div>
//               <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
//                 <X size={18} className="text-slate-400" />
//               </button>
//             </div>

//             <div className="px-7 py-6 space-y-6">
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Registration Details</p>
//                 <div className="bg-slate-50 rounded-2xl px-4 divide-y divide-slate-100">
//                   <DetailRow label="Organisation"   value={selected.user.business_name} />
//                   <DetailRow label="Type"           value={ORG_TYPE_LABELS[selected.user.organisation_type] || selected.organisation_type} />
//                   <DetailRow label="Reg. number"    value={selected.user.business_registration_number} />
//                   <DetailRow label="Email"          value={selected.user.email} />
//                   <DetailRow label="Phone"          value={selected.user.phone_number} />
//                   <DetailRow label="Operating zone" value={`${selected.user.city || '—'}${selected.country ? ', ' + selected.country : ''}`} />
//                   <DetailRow label="Address"        value={selected.user.address} />
//                   <DetailRow label="Status"         value={<StatusBadge status={selected.donor_detail?.verification_status || '-'} />} />
//                 </div>
//               </div>

// {/* Change selected.donor_detail to selected.user?.donor_detail */}
// {selected.user?.donor_detail?.food_safety_certificate_url && (
//   <div>
//     <div className="flex items-center justify-between mb-3">
//       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//         Food Safety Certificate
//       </p>

//       <button
//         onClick={() => setCertZoomed(true)}
//         className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
//       >
//         <ZoomIn size={13} />
//         Full view
//       </button>
//     </div>

//     <div
//       className="relative h-48 bg-slate-100 rounded-2xl overflow-hidden cursor-zoom-in border border-slate-200"
//       onClick={() => setCertZoomed(true)}
//     >
//       {/* Update src path here as well */}
//       <img
//         src={selected.user.donor_detail.food_safety_certificate_url}
//         alt="Food Safety Certificate"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   </div>
// )}

//               {selected.admin_note && modalMode === 'view' && (
//                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
//                   <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Admin Note</p>
//                   <p className="text-sm text-amber-800 font-medium">{selected.admin_note}</p>
//                 </div>
//               )}

//               {actionErrorFromStore && (
//                 <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
//                   {typeof actionErrorFromStore === 'string' ? actionErrorFromStore : actionErrorFromStore?.detail || 'Action failed.'}
//                 </div>
//               )}

//               {modalMode === 'approve' && (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
//                     <CheckCircle size={20} className="text-emerald-500 shrink-0" />
//                     <div>
//                       <p className="text-sm font-bold text-emerald-800">Approve this donor</p>
//                       <p className="text-xs text-emerald-600 mt-0.5">They will be able to post food listings immediately and will get an in-app notification.</p>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin note (optional)</label>
//                     <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
//                       placeholder="Add a note for this decision…" rows={3}
//                       className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm outline-none focus:border-emerald-300 resize-none transition-all" />
//                   </div>
//                   <div className="flex gap-3">
//                     <button onClick={closeModal} className="flex-1 h-12 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
//                     <button onClick={handleApprove} disabled={actionLoading}
//                       className="flex-1 h-12 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
//                       {actionLoading
//                         ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Approving…</>
//                         : <><Check size={16} />Approve Donor</>}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {modalMode === 'reject' && (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
//                     <AlertTriangle size={20} className="text-red-500 shrink-0" />
//                     <div>
//                       <p className="text-sm font-bold text-red-800">Reject this donor</p>
//                       <p className="text-xs text-red-500 mt-0.5">They will be notified and can reapply after resolving the issue.</p>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
//                       Rejection reason <span className="text-red-400">*</span>
//                     </label>
//                     <div className="space-y-2">
//                       {REJECTION_REASONS.map(reason => (
//                         <label key={reason} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
//                           ${rejectionReason === reason ? 'border-red-300 bg-red-50' : 'border-slate-100 hover:border-slate-200'}`}>
//                           <input type="radio" name="rejection" value={reason} checked={rejectionReason === reason}
//                             onChange={() => setRejectionReason(reason)} className="accent-red-500" />
//                           <span className="text-sm font-medium text-slate-700">{reason}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin note (optional)</label>
//                     <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
//                       placeholder="Add context for this rejection…" rows={3}
//                       className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm outline-none focus:border-red-300 resize-none transition-all" />
//                   </div>
//                   <div className="flex gap-3">
//                     <button onClick={closeModal} className="flex-1 h-12 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
//                     <button onClick={handleReject} disabled={actionLoading || !rejectionReason}
//                       className="flex-1 h-12 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
//                       {actionLoading
//                         ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Rejecting…</>
//                         : <><XCircle size={16} />Reject Donor</>}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {modalMode === 'view' && (selected.verification_status === 'pending' || !selected.verification_status) && (
//                 <div className="flex gap-3 pt-2">
//                   <button onClick={() => setModalMode('approve')}
//                     className="flex-1 h-12 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
//                     <CheckCircle size={16} /> Approve
//                   </button>
//                   <button onClick={() => setModalMode('reject')}
//                     className="flex-1 h-12 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100">
//                     <XCircle size={16} /> Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//    {certZoomed && selected.user?.donor_detail?.food_safety_certificate_url && (
//   <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setCertZoomed(false)}>
//     <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
//       <button onClick={() => setCertZoomed(false)}
//         className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
//         <X size={16} className="text-slate-600" />
//       </button>
//       {/* Fixed target path below */}
//       <img src={selected.user.donor_detail.food_safety_certificate_url} alt="Certificate" className="w-full rounded-2xl shadow-2xl" />
//     </div>
//   </div>
// )}

//       {toast && (
//         <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold
//           ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
//           {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
//           {toast.msg}
//           <button onClick={() => setToast(null)}><X size={14} /></button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDonorVerification;
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircle, XCircle, Search, Eye, X, AlertTriangle,
  MapPin, Shield, ClipboardList, Check, ZoomIn,
} from 'lucide-react';
import {
  fetchPanelUsers, reviewPanelUser, resetAdminStatus,
  selectPanelUsers, selectAdminIsLoading, selectAdminError,
  selectAdminActionLoading, selectAdminActionError,
} from '../../store/slices/adminSlice';

const REJECTION_REASONS = [
  'Invalid or unverifiable registration number',
  'Incomplete or missing documents',
  'Registration certificate expired',
  'Organisation details do not match certificate',
  'Not a legitimate food business',
  'Suspicious or fraudulent activity suspected',
  'Other (add note below)',
];

const ORG_TYPE_LABELS = {
  food_bank: 'Food Bank', ngo: 'NGO / Non-profit',
  community_group: 'Community Group', restaurant: 'Restaurant',
  bakery: 'Bakery', hotel: 'Hotel', catering: 'Catering',
  supermarket: 'Supermarket', event_center: 'Event Center',
  cafeteria: 'Cafeteria', other: 'Other',
};

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  },
  verified: { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    dot: 'bg-red-400'    },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 w-44">{label}</span>
    <span className="text-sm font-semibold text-slate-800 text-right">{value || '—'}</span>
  </div>
);

const AdminDonorVerification = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('status') || 'pending';

  const panelUsers   = useSelector(selectPanelUsers);
  const pageLoading  = useSelector(selectAdminIsLoading);
  const pageError    = useSelector(selectAdminError);
  const actionLoading = useSelector(selectAdminActionLoading);
  const actionErrorFromStore = useSelector(selectAdminActionError);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [certZoomed, setCertZoomed] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchPanelUsers({ role: 'donor', status: activeTab }));
  }, [dispatch, activeTab]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const stats = useMemo(() => ({
    total:    panelUsers.length,
    verified: panelUsers.filter(d => d.verification_status === 'verified').length,
    pending:  panelUsers.filter(d => d.verification_status === 'pending').length,
    rejected: panelUsers.filter(d => d.verification_status === 'rejected').length,
  }), [panelUsers]);

  const filtered = useMemo(() => {
    if (!search.trim()) return panelUsers;
    const q = search.toLowerCase();
    return panelUsers.filter(d =>
      d.user?.business_name?.toLowerCase().includes(q) ||
      d.user?.city?.toLowerCase().includes(q) ||
      d.user?.business_registration_number?.toLowerCase().includes(q)
    );
  }, [panelUsers, search]);

  const openModal = (donor, mode) => {
    setSelected(donor);
    setModalMode(mode);
    setRejectionReason('');
    // Backend payload structure uses 'note'
    setAdminNote(donor.note || '');
    setCertZoomed(false);
    dispatch(resetAdminStatus());
  };

  const closeModal = () => {
    setSelected(null);
    setModalMode(null);
    dispatch(resetAdminStatus());
  };

  const handleApprove = async () => {
    const result = await dispatch(reviewPanelUser({
      userId: selected.id, 
      isVerified: true, 
      adminNote, 
    }));
    if (reviewPanelUser.fulfilled.match(result)) {
      closeModal();
      showToast(`${selected.user?.business_name || 'Donor'} has been verified`);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return;
    const result = await dispatch(reviewPanelUser({
      userId: selected.id, 
      isVerified: false, 
      rejectionReason, 
      adminNote,
    }));
    if (reviewPanelUser.fulfilled.match(result)) {
      closeModal();
      showToast(`${selected.user?.business_name || 'Donor'} has been rejected`, 'error');
    }
  };

  const switchTab = (key) => {
    setSearchParams(key === 'all' ? {} : { status: key });
  };

  const tabs = [
    { key: 'all',      label: 'All'      },
    { key: 'pending',  label: 'Pending'  },
    { key: 'verified', label: 'Verified' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-be-vietnam">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-blue-500" />
              <h1 className="text-2xl font-black text-slate-900">Donor Verification</h1>
              <span className="text-[10px] font-bold bg-slate-800 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">Admin</span>
            </div>
            <p className="text-sm text-slate-400">
              Review donor organisations — verify their business registration before they can post food listings.
            </p>
          </div>
          {stats.pending > 0 && activeTab === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-right shrink-0">
              <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
              <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Pending review</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Loaded',   value: stats.total,    color: 'text-slate-800'   },
            { label: 'Verified', value: stats.verified, color: 'text-emerald-600' },
            { label: 'Pending',  value: stats.pending,  color: 'text-amber-600'   },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600'     },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {tabs.map(t => (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2
                    ${activeTab === t.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-transparent hover:border-slate-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, city, reg no…"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-300 transition-all" />
            </div>
          </div>

          {pageLoading ? (
            <div className="p-16 flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-slate-400">Loading donors…</p>
            </div>
          ) : pageError ? (
            <div className="p-16 text-center">
              <p className="text-red-500 font-bold mb-2">
                {typeof pageError === 'string' ? pageError : pageError?.detail || 'Failed to load donors.'}
              </p>
              <button onClick={() => dispatch(fetchPanelUsers({ role: 'donor', status: activeTab }))} className="text-brand-green font-bold underline text-sm">
                Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Organisation', 'Type', 'Reg Number', 'Zone', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList size={32} className="text-slate-200" />
                        <p className="text-sm font-bold text-slate-400">No donor organisations found</p>
                      </div>
                    </td></tr>
                  ) : filtered.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800 text-sm">{d.user?.business_name || '—'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{d.user?.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {ORG_TYPE_LABELS[d.user?.organisation_type] || d.user?.organisation_type || '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {d.user?.business_registration_number || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <MapPin size={13} className="text-slate-400 shrink-0" />{d.user?.city || '—'}, {d.user?.country || '—'}
                        </div>
                      </td>
                      {/* FIX: Verification status is mapped at root tracking row layout */}
                      <td className="px-5 py-4"><StatusBadge status={d.verification_status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => openModal(d, 'view')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
                            <Eye size={13} /> View
                          </button>
                          {(d.verification_status === 'pending' || !d.verification_status) && (<>
                            <button onClick={() => openModal(d, 'approve')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all">
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button onClick={() => openModal(d, 'reject')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-all">
                              <XCircle size={13} /> Reject
                            </button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-7 py-5 flex items-start justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-black text-slate-900">{selected.user?.business_name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Donor</span>
                </div>
                <p className="text-xs text-slate-400">Reg. {selected.user?.business_registration_number || '—'}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="px-7 py-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Registration Details</p>
                <div className="bg-slate-50 rounded-2xl px-4 divide-y divide-slate-100">
                  <DetailRow label="Organisation"   value={selected.user?.business_name} />
                  <DetailRow label="Type"           value={ORG_TYPE_LABELS[selected.user?.organisation_type] || selected.user?.organisation_type} />
                  <DetailRow label="Reg. number"    value={selected.user?.business_registration_number} />
                  <DetailRow label="Email"          value={selected.user?.email} />
                  <DetailRow label="Phone"          value={selected.user?.phone_number} />
                  <DetailRow label="Operating zone" value={`${selected.user?.city || '—'}, ${selected.user?.country || '—'}`} />
                  <DetailRow label="Address"        value={selected.user?.address} />
                  {/* FIX: Read clean top-level value */}
                  <DetailRow label="Status"         value={<StatusBadge status={selected.verification_status} />} />
                </div>
              </div>

              {selected.user?.donor_detail?.food_safety_certificate_url && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Food Safety Certificate
                    </p>
                    <button onClick={() => setCertZoomed(true)} className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline">
                      <ZoomIn size={13} /> Full view
                    </button>
                  </div>
                  <div className="relative h-48 bg-slate-100 rounded-2xl overflow-hidden cursor-zoom-in border border-slate-200" onClick={() => setCertZoomed(true)}>
                    <img src={selected.user.donor_detail.food_safety_certificate_url} alt="Food Safety Certificate" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* FIX: Map note directly to the backend attribute name */}
              {selected.note && modalMode === 'view' && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Admin Note</p>
                  <p className="text-sm text-amber-800 font-medium">{selected.note}</p>
                </div>
              )}

              {actionErrorFromStore && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                  {typeof actionErrorFromStore === 'string' ? actionErrorFromStore : actionErrorFromStore?.detail || 'Action failed.'}
                </div>
              )}

              {modalMode === 'approve' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Approve this donor</p>
                      <p className="text-xs text-emerald-600 mt-0.5">They will be able to post food listings immediately and will get an in-app notification.</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin note (optional)</label>
                    <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                      placeholder="Add a note for this decision…" rows={3}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm outline-none focus:border-emerald-300 resize-none transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 h-12 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleApprove} disabled={actionLoading}
                      className="flex-1 h-12 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {actionLoading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Approving…</>
                        : <><Check size={16} />Approve Donor</>}
                    </button>
                  </div>
                </div>
              )}

              {modalMode === 'reject' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                    <AlertTriangle size={20} className="text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-800">Reject this donor</p>
                      <p className="text-xs text-red-500 mt-0.5">They will be notified and can reapply after resolving the issue.</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Rejection reason <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {REJECTION_REASONS.map(reason => (
                        <label key={reason} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                          ${rejectionReason === reason ? 'border-red-300 bg-red-50' : 'border-slate-100 hover:border-slate-200'}`}>
                          <input type="radio" name="rejection" value={reason} checked={rejectionReason === reason}
                            onChange={() => setRejectionReason(reason)} className="accent-red-500" />
                          <span className="text-sm font-medium text-slate-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin note (optional)</label>
                    <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                      placeholder="Add context for this rejection…" rows={3}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm outline-none focus:border-red-300 resize-none transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 h-12 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleReject} disabled={actionLoading || !rejectionReason}
                      className="flex-1 h-12 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                      {actionLoading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Rejecting…</>
                        : <><XCircle size={16} />Reject Donor</>}
                    </button>
                  </div>
                </div>
              )}

              {modalMode === 'view' && (selected.verification_status === 'pending' || !selected.verification_status) && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModalMode('approve')}
                    className="flex-1 h-12 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => setModalMode('reject')}
                    className="flex-1 h-12 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {certZoomed && selected.user?.donor_detail?.food_safety_certificate_url && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setCertZoomed(false)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setCertZoomed(false)}
              className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
              <X size={16} className="text-slate-600" />
            </button>
            <img src={selected.user.donor_detail.food_safety_certificate_url} alt="Certificate" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default AdminDonorVerification;