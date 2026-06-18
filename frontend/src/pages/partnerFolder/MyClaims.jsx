import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ChevronLeft, ShoppingBag, Clock, Package, X, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { 
  fetchMyClaims, 
  cancelClaim,
  selectMyClaims,
  selectIsLoading,
  selectIsActionLoading,
  selectMyClaimsCount
} from '../../store/slices/partnerSlice'; 

const STATUS_STYLES = {
  pending:     'bg-amber-50 text-amber-700 border-amber-100',
  picked_up:   'bg-blue-50 text-blue-700 border-blue-100',
  distributed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled:   'bg-red-50 text-red-700 border-red-100',
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
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get('status') || 'all'; 
  const myClaims = useSelector(selectMyClaims);
  const loading = useSelector(selectIsLoading);
  const cancelLoading = useSelector(selectIsActionLoading);
  const myClaimsCount = useSelector(selectMyClaimsCount)
  
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    dispatch(fetchMyClaims());
  }, [dispatch]);

  const handleCancel = async (claimId) => {
    setCancelError('');
    const result = await dispatch(cancelClaim(claimId));
    if (cancelClaim.fulfilled.match(result)) {
      setCancelConfirmId(null);
    } else {
      const payload = result.payload;
      setCancelError(payload?.detail || payload?.error || 'Could not cancel. Please try again.');
    }
  };

  const filtered = myClaims.filter(claim =>
    statusFilter === 'all' ? true : claim.status === statusFilter
  );


  const metrics = {
    total: myClaimsCount,
    awaitingPickup: myClaims.filter(c => c.status === 'pending').length,
    pendingDist: myClaims.filter(c => c.status === 'picked_up').length,
    distributed: myClaims.filter(c => c.status === 'distributed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-be-vietnam">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Top Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white hover:bg-slate-100 border border-slate-100 shadow-sm rounded-xl transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Claims</h1>
            <span className="text-[10px] uppercase font-bold bg-slate-200/60 text-slate-500 px-2.5 py-1 rounded-full tracking-wider">
              Partner view
            </span>
          </div>
        </div>

        {/* Dashboard Grid Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard label="Total claims" value={ metrics.total} sub="All time" subColor="text-slate-400" />
          <StatCard label="Awaiting pickup" value={metrics.awaitingPickup} sub="Action needed" subColor="text-rose-500 font-semibold" />
          <StatCard label="Pending distribution" value={metrics.pendingDist} sub="Picked up" subColor="text-slate-400" />
          <StatCard label="Fully distributed" value={metrics.distributed} sub="Completed" subColor="text-emerald-600 font-semibold" />
        </div>

        {/* Action Error Alerts */}
        {cancelError && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3.5 rounded-2xl mb-6 shadow-sm animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-xs font-semibold">{cancelError}</p>
            <button onClick={() => setCancelError('')} className="ml-auto p-1 hover:bg-rose-100 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Loading Content Placeholders */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-dashed border-slate-200 p-12 md:p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <ShoppingBag size={28} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No active claims found</h3>
            <p className="text-slate-500 mt-1.5 text-sm max-w-sm mx-auto mb-6 font-medium">
              You haven&apos;t reserved any donations matching this filter. Browse open slots to pick up meals.
            </p>
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="bg-slate-900 text-white font-semibold text-sm px-6 h-12 rounded-2xl hover:bg-emerald-500 transition-all duration-200 shadow-sm"
            >
              Browse Available Food
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table Layout Container */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/60 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Donation</th>
                    <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                    <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Claimed on</th>
                    <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((claim) => (
                    <DesktopRow
                      key={claim.id}
                      claim={claim}
                      navigate={navigate}
                      cancelConfirmId={cancelConfirmId}
                      setCancelConfirmId={setCancelConfirmId}
                      handleCancel={handleCancel}
                      cancelLoading={cancelLoading}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Layout Container */}
            <div className="md:hidden space-y-4">
              {filtered.map((claim) => (
                <MobileCard
                  key={claim.id}
                  claim={claim}
                  navigate={navigate}
                  cancelConfirmId={cancelConfirmId}
                  setCancelConfirmId={setCancelConfirmId}
                  handleCancel={handleCancel}
                  cancelLoading={cancelLoading}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Inline Cancel Confirmation Drawer ─────────────────────────────────────────
const CancelConfirm = ({ claimId, onConfirm, onDismiss, loading }) => (
  <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 mt-3 shadow-inner animate-fadeIn">
    <p className="text-xs font-bold text-rose-800 mb-1">Confirm Cancellation?</p>
    <p className="text-[11px] text-rose-600/90 mb-3 leading-relaxed">
      Releasing this claim returns items back to open listings for other collection points. This operation is permanent.
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => onConfirm(claimId)}
        disabled={loading}
        className="flex-1 h-9 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all disabled:opacity-50 shadow-sm"
      >
        {loading ? 'Cancelling…' : 'Yes, Release'}
      </button>
      <button
        onClick={onDismiss}
        disabled={loading}
        className="flex-1 h-9 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
      >
        Keep Reservation
      </button>
    </div>
  </div>
);

// ── Desktop Row Sub-view Component ───────────────────────────────────────────────
const DesktopRow = ({ claim, navigate, cancelConfirmId, setCancelConfirmId, handleCancel, cancelLoading }) => {
  const foodName = claim.food?.food_type || `Claim #${claim.id}`;
  const donor    = claim.donor?.business_name || '-';
  const qty      = claim.food?.quantity_estimated || '—';
  const unit     = claim.food?.quantity_unit || '';
  const timestamp = claim.claim_time || null;

  return (
    <tr className="hover:bg-slate-50/40 transition-colors align-top group">
      <td className="px-6 py-5">
        <p className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors capitalize">{foodName}</p>
        <p className="text-xs text-slate-400 font-medium mt-1">{donor}</p>
      </td>
      <td className="px-4 py-5 text-sm font-semibold text-slate-700 whitespace-nowrap pt-5.5">
        {qty} <span className="text-xs font-medium text-slate-400 uppercase">{unit}</span>
      </td>
      <td className="px-4 py-5 text-sm font-medium text-slate-600 whitespace-nowrap pt-5.5">{formatDeadline(timestamp)}</td>
      <td className="px-4 py-5 pt-4.5"><StatusBadge status={claim.status} /></td>
      <td className="px-6 py-5 text-right w-[240px]">
        <div className="flex flex-col items-end">
          <ActionButton claim={claim} navigate={navigate} setCancelConfirmId={setCancelConfirmId} />
          {cancelConfirmId === claim.id && (
            <div className="w-full max-w-[220px] text-left">
              <CancelConfirm
                claimId={claim.id}
                onConfirm={handleCancel}
                onDismiss={() => setCancelConfirmId(null)}
                loading={cancelLoading}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// ── Mobile Card Sub-view Component ───────────────────────────────────────────────
const MobileCard = ({ claim, navigate, cancelConfirmId, setCancelConfirmId, handleCancel, cancelLoading }) => {
  const foodName = claim.food?.food_type || `Claim #${claim.id}`;
  const donor    = claim.donor?.business_name || '-';
  const qty      = claim.food?.quantity_estimated;
  const unit     = claim.food?.quantity_unit || '';
  const timestamp = claim.claim_time || null;
  const pickupCode = claim.pickup_code || null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
            <Package size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate capitalize">{foodName}</p>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{donor}</p>
          </div>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="flex flex-col gap-1.5 mb-4 text-xs text-slate-500 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
        {qty && <span className="flex items-center gap-2 text-slate-700"><Package size={13} className="text-slate-400" />{qty} {unit}</span>}
        {timestamp && <span className="flex items-center gap-2"><Clock size={13} className="text-slate-400" />Claimed: {formatDeadline(timestamp)}</span>}
        {pickupCode && <span className="flex items-center gap-2 text-amber-700 font-semibold"><span className="text-slate-400 font-normal">Code:</span> {pickupCode}</span>}
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

// ── Shared Inline View Sub-pieces ─────────────────────────────────────────────

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0 tracking-wide ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
    {STATUS_LABELS[status] || status}
  </span>
);

const ActionButton = ({ claim, navigate, setCancelConfirmId, fullWidth }) => {
  const base = `text-xs font-bold px-4 h-9 inline-flex items-center justify-center rounded-xl transition-all whitespace-nowrap shadow-sm ${fullWidth ? 'w-full' : ''}`;

  if (claim.status === 'cancelled') {
    return <span className="text-xs font-semibold text-slate-400 px-2 py-1">Cancelled</span>;
  }

  if (claim.status === 'pending') {
    return (
      <div className={`flex gap-2 items-center ${fullWidth ? 'flex-col w-full' : ''}`}>
        <button
          onClick={() => navigate(`/dashboard/claims/${claim.id}/confirm-pickup`)}
          className={`${base} bg-slate-900 text-white hover:bg-emerald-500`}
        >
          Confirm pickup
        </button>
        <button
          onClick={() => setCancelConfirmId(claim.id)}
          className={`${base} border border-rose-200 bg-white text-rose-500 hover:bg-rose-50 shadow-none`}
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
        className={`${base} bg-blue-600 text-white hover:bg-blue-700`}
      >
        Confirm distributed
      </button>
    );
  }

  if (claim.status === 'distributed') {
    return (
      <button
        onClick={() => navigate(`/dashboard/claims/${claim.id}/impact`)}
        className={`${base} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-none`}
      >
        View details
      </button>
    );
  }

  return <span className="text-xs font-medium text-slate-400">—</span>;
};

const StatCard = ({ label, value, sub, subColor }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5">
    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 leading-tight">{label}</p>
    <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
  </div>
);

const formatDeadline = (deadline) => {
  if (!deadline) return '—';
  const targetDate = new Date(deadline);
  
  if (isNaN(targetDate.getTime())) return '—';

  const sourceToday = new Date();
  const todayStart = new Date(sourceToday.getFullYear(), sourceToday.getMonth(), sourceToday.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  if (targetDate >= todayStart && targetDate < tomorrowStart) {
    return `Today at ${targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (targetDate >= yesterdayStart && targetDate < todayStart) {
    return 'Yesterday';
  }
  if (targetDate < yesterdayStart) {
    const timeDiffMs = todayStart.getTime() - targetDate.getTime();
    const deadDaysAgo = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24)) + 1;
    return `${deadDaysAgo} days ago`;
  }
  
  return targetDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

export default MyClaims;