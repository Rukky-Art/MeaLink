// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { ChevronLeft, ShoppingBag } from 'lucide-react';
// import { fetchMyClaims } from '../../store/slices/partnerSlice';

// // Status badge styles
// const STATUS_STYLES = {
//   pending:     'bg-amber-100 text-amber-700',
//   picked_up:   'bg-blue-100 text-blue-700',
//   distributed: 'bg-green-100 text-green-700',
//   cancelled:   'bg-red-100 text-red-700',
// };

// const STATUS_LABELS = {
//   pending:     'Claimed',
//   picked_up:   'Picked up',
//   distributed: 'Distributed',
//   cancelled:   'Cancelled',
// };

// const MyClaims = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { myClaims, loading, } = useSelector((state) => state.partner);

//   useEffect(() => {
//     dispatch(fetchMyClaims());
//   }, [dispatch]);

//   // Stat counts
//   const total       = myClaims.length;
//   const awaitingPickup = myClaims.filter(c => c.status === 'pending').length;
//   const pendingDist    = myClaims.filter(c => c.status === 'picked_up').length;
//   const distributed    = myClaims.filter(c => c.status === 'distributed').length;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-be-vietnam">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
//             <ChevronLeft size={22} />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
//           <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Partner view</span>
//         </div>

//         {/* Stats row */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <StatCard label="Total claims"         value={total}          sub="All time"       subColor="text-gray-400" />
//           <StatCard label="Awaiting pickup"       value={awaitingPickup} sub="Action needed"  subColor="text-red-500"  />
//           <StatCard label="Pending distribution"  value={pendingDist}    sub="Picked up"      subColor="text-gray-400" />
//           <StatCard label="Fully distributed"     value={distributed}    sub="Completed"      subColor="text-brand-green" />
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
//             <div className="animate-pulse space-y-4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
//               ))}
//             </div>
//           </div>
//         ) : myClaims.length === 0 ? (
//           <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
//             <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900">No claims yet</h3>
//             <p className="text-gray-500 mt-2 mb-6">Browse available food and claim a donation.</p>
//             <button
//               onClick={() => navigate('/dashboard/browse')}
//               className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all"
//             >
//               Browse Food
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50">
//                   <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Donation</th>
//                   <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
//                   <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup By</th>
//                   <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
//                   <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {myClaims.map((claim) => {
//                   const food     = claim.food_details || claim.food_data || null;
//                   const foodName = food?.food_type          || claim.food_type          || `Claim #${claim.id}`;
//                   const donor    = food?.donor_name         || claim.donor_name         || '—';
//                   const location = food?.pickup_city        || claim.pickup_city        || '';
//                   const qty      = food?.quantity_estimated || claim.quantity_estimated || '—';
//                   const unit     = food?.quantity_unit      || claim.quantity_unit      || '';
//                   const deadline = food?.pickup_end_time    || claim.pickup_end_time;

//                   return (
//                     <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">

//                       {/* Donation */}
//                       <td className="px-6 py-5">
//                         <p className="font-bold text-gray-900">{foodName}</p>
//                         <p className="text-xs text-gray-400 mt-0.5">{donor}{location ? ` · ${location}` : ''}</p>
//                       </td>

//                       {/* Quantity */}
//                       <td className="px-4 py-5 text-sm font-medium text-gray-700">
//                         {qty} {unit}
//                       </td>

//                       {/* Pickup by */}
//                       <td className="px-4 py-5 text-sm text-gray-600">
//                         {deadline
//                           ? (() => {
//                               const d = new Date(deadline);
//                               const now = new Date();
//                               const diffDays = Math.floor((d - now) / (1000 * 60 * 60 * 24));
//                               if (diffDays === 0) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//                               if (diffDays === -1) return 'Picked up yesterday';
//                               if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
//                               return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
//                             })()
//                           : '—'}
//                       </td>

//                       {/* Status badge */}
//                       <td className="px-4 py-5">
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[claim.status] || 'bg-gray-100 text-gray-600'}`}>
//                           {STATUS_LABELS[claim.status] || claim.status}
//                         </span>
//                       </td>

//                       {/* Action — dynamic based on status */}
//                       <td className="px-4 py-5">
//                         <ActionButton claim={claim} navigate={navigate} />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── ActionButton — changes based on claim status ──────────────────────────────
// const ActionButton = ({ claim, navigate }) => {
//   if (claim.status === 'pending') {
//     return (
//       <button
//         onClick={() => navigate(`/dashboard/claims/${claim.id}/confirm-pickup`)}
//         className="bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-opacity-90 transition-all whitespace-nowrap"
//       >
//         Confirm pickup
//       </button>
//     );
//   }

//   if (claim.status === 'picked_up') {
//     return (
//       <button
//         onClick={() => navigate(`/dashboard/claims/${claim.id}/confirm-distribution`)}
//         className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-opacity-90 transition-all whitespace-nowrap"
//       >
//         Confirm distributed
//       </button>
//     );
//   }

//   if (claim.status === 'distributed') {
//     return (
//       <button
//         onClick={() => navigate(`/dashboard/claims/${claim.id}/impact`)}
//         className="border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all whitespace-nowrap"
//       >
//         View details
//       </button>
//     );
//   }

//   return <span className="text-xs text-gray-400">—</span>;
// };

// const StatCard = ({ label, value, sub, subColor }) => (
//   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
//     <p className="text-3xl font-black text-gray-900">{value}</p>
//     <p className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</p>
//   </div>
// );

// export default MyClaims;


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ChevronLeft, ShoppingBag, MapPin, Clock, Package, X, AlertCircle } from 'lucide-react';
import { fetchMyClaims, fetchAvailableFood, cancelClaim } from '../../store/slices/partnerSlice';

const STATUS_STYLES = {
  pending:     'bg-amber-100 text-amber-700',
  picked_up:   'bg-blue-100 text-blue-700',
  distributed: 'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  pending:     'Claimed',
  picked_up:   'Picked up',
  distributed: 'Distributed',
  cancelled:   'Cancelled',
};

const MyClaims = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myClaims, availableFood, loading, cancelLoading } = useSelector((state) => state.partner);

  // Track which claim is showing the cancel confirmation prompt
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancelError,     setCancelError]     = useState('');

  useEffect(() => {
    dispatch(fetchMyClaims());
    dispatch(fetchAvailableFood());
  }, [dispatch]);

  const getFoodDetails = (claim) => {
    const foodId = typeof claim.food === 'object' ? claim.food?.id : claim.food;
    return availableFood.find(f => f.id === foodId) || null;
  };

  const handleCancel = async (claimId) => {
    setCancelError('');
    const result = await dispatch(cancelClaim(claimId));
    if (cancelClaim.fulfilled.match(result)) {
      setCancelConfirmId(null);
    } else {
      const p = result.payload;
      setCancelError(p?.detail || p?.error || 'Could not cancel. Please try again.');
    }
  };

  const total          = myClaims.length;
  const awaitingPickup = myClaims.filter(c => c.status === 'pending').length;
  const pendingDist    = myClaims.filter(c => c.status === 'picked_up').length;
  const distributed    = myClaims.filter(c => c.status === 'distributed').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10 font-be-vietnam">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors shrink-0">
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Claims</h1>
            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Partner view</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard label="Total claims"        value={total}          sub="All time"      subColor="text-gray-400"    />
          <StatCard label="Awaiting pickup"      value={awaitingPickup} sub="Action needed" subColor="text-red-500"     />
          <StatCard label="Pending distribution" value={pendingDist}    sub="Picked up"     subColor="text-gray-400"    />
          <StatCard label="Fully distributed"    value={distributed}    sub="Completed"     subColor="text-brand-green" />
        </div>

        {/* Global cancel error */}
        {cancelError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4">
            <AlertCircle size={15} />
            <p className="text-xs font-medium">{cancelError}</p>
            <button onClick={() => setCancelError('')} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
            ))}
          </div>
        ) : myClaims.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 md:p-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No claims yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Browse available food and claim a donation.</p>
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all"
            >
              Browse Food
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Donation</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup By</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myClaims.map((claim) => {
                    const food = getFoodDetails(claim);
                    return (
                      <DesktopRow
                        key={claim.id}
                        claim={claim}
                        food={food}
                        navigate={navigate}
                        cancelConfirmId={cancelConfirmId}
                        setCancelConfirmId={setCancelConfirmId}
                        handleCancel={handleCancel}
                        cancelLoading={cancelLoading}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {myClaims.map((claim) => {
                const food = getFoodDetails(claim);
                return (
                  <MobileCard
                    key={claim.id}
                    claim={claim}
                    food={food}
                    navigate={navigate}
                    cancelConfirmId={cancelConfirmId}
                    setCancelConfirmId={setCancelConfirmId}
                    handleCancel={handleCancel}
                    cancelLoading={cancelLoading}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Cancel confirmation inline prompt ─────────────────────────────────────────
// Shows inline in the row/card instead of a modal — less disruptive
const CancelConfirm = ({ claimId, onConfirm, onDismiss, loading }) => (
  <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-2">
    <p className="text-xs font-bold text-red-700 mb-2">Cancel this claim?</p>
    <p className="text-[11px] text-red-500 mb-3 leading-relaxed">
      This will release the food back to other partners. This cannot be undone.
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => onConfirm(claimId)}
        disabled={loading}
        className="flex-1 bg-red-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
      >
        {loading ? 'Cancelling…' : 'Yes, cancel'}
      </button>
      <button
        onClick={onDismiss}
        className="flex-1 bg-white text-gray-600 text-xs font-bold py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        Keep it
      </button>
    </div>
  </div>
);

// ── Desktop row ───────────────────────────────────────────────────────────────
const DesktopRow = ({ claim, food, navigate, cancelConfirmId, setCancelConfirmId, handleCancel, cancelLoading }) => {
  const foodName = food?.food_type || `Claim #${claim.id}`;
  const donor    = food?.donor_name || '—';
  const location = food?.pickup_city || '';
  const qty      = food?.quantity_estimated || '—';
  const unit     = food?.quantity_unit || '';
  const deadline = food?.pickup_end_time || null;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors align-top">
      <td className="px-6 py-5">
        <p className="font-bold text-gray-900">{foodName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{donor}{location ? ` · ${location}` : ''}</p>
      </td>
      <td className="px-4 py-5 text-sm font-medium text-gray-700 whitespace-nowrap">{qty} {unit}</td>
      <td className="px-4 py-5 text-sm text-gray-600 whitespace-nowrap">{formatDeadline(deadline)}</td>
      <td className="px-4 py-5"><StatusBadge status={claim.status} /></td>
      <td className="px-4 py-5">
        <div>
          <ActionButton claim={claim} navigate={navigate} setCancelConfirmId={setCancelConfirmId} />
          {cancelConfirmId === claim.id && (
            <CancelConfirm
              claimId={claim.id}
              onConfirm={handleCancel}
              onDismiss={() => setCancelConfirmId(null)}
              loading={cancelLoading}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

// ── Mobile card ───────────────────────────────────────────────────────────────
const MobileCard = ({ claim, food, navigate, cancelConfirmId, setCancelConfirmId, handleCancel, cancelLoading }) => {
  const foodName = food?.food_type || `Claim #${claim.id}`;
  const donor    = food?.donor_name || '—';
  const qty      = food?.quantity_estimated;
  const unit     = food?.quantity_unit || '';
  const address  = food?.pickup_address || food?.pickup_city || '';
  const deadline = food?.pickup_end_time || null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
            <Package size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">{foodName}</p>
            <p className="text-xs text-gray-400 truncate">{donor}</p>
          </div>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-gray-500">
        {qty && <span className="flex items-center gap-1"><Package size={12} className="text-brand-green" />{qty} {unit}</span>}
        {address && <span className="flex items-center gap-1"><MapPin size={12} className="text-brand-green" />{address}</span>}
        {deadline && <span className="flex items-center gap-1"><Clock size={12} className="text-brand-green" />{formatDeadline(deadline)}</span>}
      </div>

      <ActionButton claim={claim} navigate={navigate} setCancelConfirmId={setCancelConfirmId} fullWidth />

      {cancelConfirmId === claim.id && (
        <CancelConfirm
          claimId={claim.id}
          onConfirm={handleCancel}
          onDismiss={() => setCancelConfirmId(null)}
          loading={cancelLoading}
        />
      )}
    </div>
  );
};

// ── Shared pieces ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
    {STATUS_LABELS[status] || status}
  </span>
);

const ActionButton = ({ claim, navigate, setCancelConfirmId, fullWidth }) => {
  const base = `text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${fullWidth ? 'w-full text-center block' : ''}`;

  if (claim.status === 'cancelled') {
    return <span className="text-xs text-gray-400">Cancelled</span>;
  }

  if (claim.status === 'pending') {
    return (
      <div className={`flex gap-2 ${fullWidth ? 'flex-col' : ''}`}>
        <button
          onClick={() => navigate(`/dashboard/claims/${claim.id}/confirm-pickup`)}
          className={`${base} bg-brand-green text-white hover:bg-opacity-90 ${fullWidth ? 'w-full' : ''}`}
        >
          Confirm pickup
        </button>
        {/* Cancel only available on pending claims */}
        <button
          onClick={() => setCancelConfirmId(claim.id)}
          className={`${base} border border-red-200 text-red-500 hover:bg-red-50 ${fullWidth ? 'w-full' : ''}`}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (claim.status === 'picked_up') {
    return (
      <button
        onClick={() => navigate(`/dashboard/claims/${claim.id}/confirm-distribution`)}
        className={`${base} bg-blue-600 text-white hover:bg-opacity-90`}
      >
        Confirm distributed
      </button>
    );
  }

  if (claim.status === 'distributed') {
    return (
      <button
        onClick={() => navigate(`/dashboard/claims/${claim.id}/impact`)}
        className={`${base} border border-gray-200 text-gray-600 hover:bg-gray-50`}
      >
        View details
      </button>
    );
  }

  return <span className="text-xs text-gray-400">—</span>;
};

const StatCard = ({ label, value, sub, subColor }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 leading-tight">{label}</p>
    <p className="text-2xl md:text-3xl font-black text-gray-900">{value}</p>
    <p className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</p>
  </div>
);

const formatDeadline = (deadline) => {
  if (!deadline) return '—';
  const d = new Date(deadline);
  const now = new Date();
  const diffDays = Math.floor((d - now) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

export default MyClaims;
