import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin, CheckCircle, ShoppingBag,
  ArrowLeft, User, Phone, AlertCircle, ShieldCheck,
  Info, Thermometer, Users, CalendarDays,
  Timer, BadgeCheck, ChevronRight,
} from 'lucide-react';
import {
  fetchAvailableFood,
  fetchMyClaims,
  fetchFoodDetails,
  claimFood,
  selectActiveFood,
  selectFoodById,
  selectMyClaimedFoodIds,
  selectIsLoading,
  selectIsActionLoading,
} from '../../store/slices/partnerSlice';
import {
  isExpired as isFoodExpired,
  isExpiringSoon as isFoodExpiringSoon,
  getDeadline,
  parseCountdown,
  getFoodStatus,
  formatWindow,
  formatDateTime,
  timeAgo,
  displayDistance,
  estimatePeopleServed,
} from '../../utils/foodUtils';
import { getDeviceLocation } from '../../utils/geoUtils';

// ── Status display mapping ───────────────────────────────────────────────────
// Single source of truth for label/colour per getFoodStatus() result.
// Order mirrors getFoodStatus's own priority (claimed_by_me > expired > claimed > expiring_soon > available).
const STATUS_DISPLAY = {
  claimed_by_me: { label: '🔒 Reserved by you', colorClass: 'bg-blue-500/90 text-white' },
  expired:       { label: '❌ Expired',          colorClass: 'bg-slate-500/90 text-white' },
  claimed:       { label: '🔒 Claimed',           colorClass: 'bg-slate-700/90 text-white' },
  expiring_soon: { label: '⚠️ Expiring soon',     colorClass: 'bg-amber-500/90 text-white' },
  available:     { label: '✅ Available',         colorClass: 'bg-white/90 text-brand-green' },
};

// ── Live Countdown component ───────────────────────────────────────────────────
// Takes the whole food object (not just expiry_time) so it uses the same
// deadline definition as everywhere else: min(expiry_time, pickup_end_time).
const Countdown = ({ food, compact = false }) => {
  const deadline = getDeadline(food);
  const [cd, setCd] = useState(() => parseCountdown(food));

  useEffect(() => {
    if (deadline === null) return;
    setCd(parseCountdown(food));
    const id = setInterval(() => setCd(parseCountdown(food)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  if (deadline === null || !cd) return null;

  const urgent  = !cd.isExpired && cd.totalSeconds < 3600; // < 1 hr — UI-only tier, no canonical equivalent
  const warning = !cd.isExpired && isFoodExpiringSoon(food); // ties to the same 6hr window everywhere else

  const colorClass = cd.isExpired
    ? 'text-slate-400 bg-slate-100 border-slate-200'
    : urgent
    ? 'text-red-600 bg-red-50 border-red-200'
    : warning
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (cd.isExpired) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${colorClass}`}>
        <Timer size={13} /> Expired
      </span>
    );
  }

  if (compact) {
    const parts = [];
    if (cd.days)  parts.push(`${cd.days}d`);
    if (cd.hours) parts.push(`${cd.hours}h`);
    if (!cd.days) {
      parts.push(`${cd.mins}m`);
      if (!cd.hours) parts.push(`${cd.secs}s`);
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${colorClass}`}>
        <Timer size={13} /> {parts.join(' ')}
      </span>
    );
  }

  const blocks = [
    { label: 'Days',    value: cd.days  },
    { label: 'Hours',   value: cd.hours },
    { label: 'Minutes', value: cd.mins  },
    { label: 'Seconds', value: cd.secs  },
  ];

  return (
    <div className={`rounded-2xl border p-4 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <Timer size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">
          {urgent ? '⚠️ Expiring very soon!' : warning ? 'Expiring soon' : 'Expires in'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {blocks.map(b => (
          <div key={b.label} className="text-center bg-white/60 rounded-xl py-2">
            <p className="text-2xl font-black tabular-nums leading-none">
              {String(b.value).padStart(2, '0')}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Status badge ───────────────────────────────────────────────────────────────
const ListingBadge = ({ food, isClaimedByMe, claimSuccess }) => {
  const status = getFoodStatus(food, isClaimedByMe || claimSuccess);
  const { label, colorClass } = STATUS_DISPLAY[status];

  return (
    <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-xs font-black backdrop-blur ${colorClass}`}>
      {label}
    </div>
  );
};

// ── Detail page ────────────────────────────────────────────────────────────────
const FoodDetail = ({ food, isClaimedByMe, onBack }) => {
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const claimLoading  = useSelector(selectIsActionLoading);
  const [claimError,   setClaimError]   = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const isClaimedByOthers = food.is_claimed && !isClaimedByMe;
  const expired           = isFoodExpired(food);
  const deadline          = getDeadline(food);

  const handleClaim = async () => {
    setClaimError('');
    const result = await dispatch(claimFood(Number(food.id)));
    if (claimFood.fulfilled.match(result)) {
      setClaimSuccess(true);
      dispatch(fetchMyClaims());
      setTimeout(() => navigate('/dashboard/my-claims'), 2000);
    }
    if (claimFood.rejected.match(result)) {
      const p = result.payload;
      setClaimError(p?.error || p?.detail || p?.non_field_errors?.[0] || 'Failed to claim. Please try again.');
    }
  };

  const dist = displayDistance(food.distance_km);
  const postedBy = food.posted_by?.name || food.donor_name || null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-bold text-sm">Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero image */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-80 relative">
                <img
                  src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                  className="w-full h-full object-cover"
                  alt={food.food_type}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <ListingBadge food={food} isClaimedByMe={isClaimedByMe} claimSuccess={claimSuccess} />
                {dist && (
                  <div className="absolute top-5 right-5 bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <MapPin size={12} /> {dist}
                  </div>
                )}
                {postedBy && (
                  <div className="absolute bottom-5 left-5 flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg">
                      {postedBy[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">{postedBy}</p>
                      <p className="text-white/70 text-[10px] font-medium">{food.posted_by?.organisation_type?.replace('_', ' ') || 'Donor'} · {timeAgo(food.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-7">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 capitalize">{food.food_type}</h1>
                    <p className="text-brand-green font-bold text-base mt-0.5 capitalize">{food.category || 'Surplus food'}</p>
                  </div>
                  <div className="shrink-0 bg-brand-green/10 text-brand-green font-black text-lg px-4 py-2 rounded-2xl text-right">
                    {food.quantity_estimated}
                    <span className="text-xs font-bold ml-1 uppercase">{food.quantity_unit}</span>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">≈ {estimatePeopleServed(food)} people</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <InfoCell icon={Users} label="Feeds approx."
                    value={`~${estimatePeopleServed(food)} people`} />
                  <InfoCell icon={CalendarDays} label="Listed"
                    value={timeAgo(food.created_at)} />
                  <InfoCell icon={MapPin} label="Zone"
                    value={`${food.pickup_city || ''}${food.posted_by?.country ? ', ' + food.posted_by.country : ''}`} />
                  <InfoCell icon={Thermometer} label="Category"
                    value={food.category ? food.category.charAt(0).toUpperCase() + food.category.slice(1) : 'General'} />
                  {dist && <InfoCell icon={MapPin} label="Distance" value={dist} highlight />}
                  {food.posted_by?.business_name && (
                    <InfoCell icon={BadgeCheck} label="Donor Org's Name" value={food.posted_by.name} />
                  )}
                  <InfoCell icon={BadgeCheck} label="Donor Org's Type" value={food.posted_by?.organisation_type?.replace('_', ' ') || 'Donor'} />
                </div>

                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100">
                  <CalendarDays size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup Window</p>
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                      {formatWindow(food.pickup_start_time, food.pickup_end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100">
                  <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup Address</p>
                    <p className="text-sm font-bold text-gray-900">{food.pickup_address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{food.pickup_city}</p>
                  </div>
                </div>

                {food.notes && food.notes !== 'None' && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <Info size={18} className="text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes from donor</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{food.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {deadline !== null && (
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Food Expiry</p>
                <Countdown food={food} />
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Expires: {formatDateTime(deadline)}
                </p>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4 sticky top-6">
              {isClaimedByMe || claimSuccess ? (
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-blue-500" />
                  </div>
                  <p className="font-black text-gray-900 text-lg">You've claimed this!</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Head to the pickup address before the window closes.
                  </p>
                  <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">What's next</p>
                    <div className="space-y-1.5">
                      {['Go to the pickup address', 'Show your pickup code', 'Confirm pickup in the app', 'Distribute to beneficiaries'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                          <span className="w-4 h-4 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => navigate('/dashboard/my-claims')}
                    className="w-full bg-brand-green text-white font-bold py-3.5 rounded-2xl hover:bg-opacity-90 transition-all text-sm flex items-center justify-center gap-2">
                    Go to My Claims <ChevronRight size={16} />
                  </button>
                </div>
              ) : isClaimedByOthers ? (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <ShieldCheck size={32} className="text-gray-300" />
                  <p className="font-bold text-gray-700">Already claimed</p>
                  <p className="text-xs text-gray-400">Another partner has reserved this listing.</p>
                </div>
              ) : expired ? (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <Timer size={32} className="text-gray-300" />
                  <p className="font-bold text-gray-700">This listing has expired</p>
                  <p className="text-xs text-gray-400">The food is no longer available for collection.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pickup window</p>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {formatWindow(food.pickup_start_time, food.pickup_end_time)}
                    </p>
                  </div>

                  {deadline !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Expires:</span>
                      <Countdown food={food} compact />
                    </div>
                  )}

                  {claimError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-medium">{claimError}</p>
                    </div>
                  )}

                  <button onClick={handleClaim} disabled={claimLoading}
                    className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    {claimLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing…
                      </span>
                    ) : 'Claim this donation'}
                  </button>

                  <p className="text-[11px] text-center text-gray-400 leading-relaxed">
                    By claiming, you agree to collect within the pickup window and distribute to genuine beneficiaries.
                  </p>
                </>
              )}
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pickup Contact</p>
              <div className="space-y-3">
                <ContactRow icon={User}  label="Contact Person"
                  value={food.posted_by?.name || food.contact_person_name || '—'} />
                <ContactRow icon={Phone} label="Phone"
                  value={isClaimedByMe || claimSuccess
                    ? food.contact_person_phone || food.posted_by?.phone_number || '—'
                    : '•••• •••• ••••'} />
                <ContactRow icon={MapPin} label="Pickup Address"
                  value={`${food.pickup_address}, ${food.pickup_city}`} />
              </div>
              {!(isClaimedByMe || claimSuccess) && (
                <p className="text-[11px] text-gray-400 mt-4 text-center">
                  Full contact details revealed after claiming.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── InfoCell ───────────────────────────────────────────────────────────────────
const InfoCell = ({ icon: Icon, label, value, highlight }) => (
  <div className={`p-4 rounded-2xl border ${highlight ? 'bg-brand-green/5 border-brand-green/20' : 'bg-slate-50 border-slate-100'}`}>
    <div className="flex items-center gap-1.5 mb-1">
      {Icon && <Icon size={12} className={highlight ? 'text-brand-green' : 'text-slate-400'} />}
      <p className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-brand-green' : 'text-gray-400'}`}>{label}</p>
    </div>
    <p className={`font-bold text-sm ${highlight ? 'text-brand-green' : 'text-gray-900'}`}>{value || '—'}</p>
  </div>
);

const ContactRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
      <Icon size={16} className="text-gray-400" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

// ── Food card (list view) ──────────────────────────────────────────────────────
const FoodCard = ({ food, isMyClaim, onView }) => {
  const isClaimedByOthers = food.is_claimed && !isMyClaim;
  const expired = isFoodExpired(food);
  const dist = displayDistance(food.distance_km);
  const postedBy = food.posted_by?.name || food.donor_name;

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={food.food_type}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-brand-green">
          {food.category || 'Surplus'}
        </div>

        {isMyClaim && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
            My Claim
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          {postedBy && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-green rounded-full flex items-center justify-center text-white text-xs font-black shadow">
                {postedBy[0].toUpperCase()}
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{postedBy}</span>
            </div>
          )}
          {dist && (
            <span className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin size={10} /> {dist}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-black text-gray-900 leading-tight capitalize">{food.food_type}</h3>
          {getDeadline(food) !== null && <Countdown food={food} compact />}
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={14} className="text-brand-green shrink-0" />
            <span className="text-xs font-medium truncate">{food.pickup_address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarDays size={14} className="text-brand-green shrink-0" />
            {/* No exact foodUtils match for a single date without a year — formatDateTime adds one. Left local. */}
            <span className="text-xs font-medium text-slate-500 truncate">
              {new Date(food.pickup_start_time).toLocaleString('en-NG', {
                weekday: 'short', day: 'numeric', month: 'short',
                hour: 'numeric', minute: '2-digit', hour12: true,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={14} className="text-brand-green shrink-0" />
            <span className="text-xs font-medium">~{estimatePeopleServed(food)} people · {food.quantity_estimated} {food.quantity_unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Posted</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{timeAgo(food.created_at)}</p>
          </div>
          {isClaimedByOthers || expired ? (
            <div className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl font-bold text-xs">
              {expired ? 'Expired' : 'Taken'}
            </div>
          ) : (
            <button onClick={onView}
              className="bg-brand-green text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-green/90 transition-all active:scale-95 shadow-md shadow-brand-green/20">
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const AvailableFood = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { user }   = useSelector(s => s.auth);

  const activeFood     = useSelector(selectActiveFood); // expired listings already excluded
  const claimedFoodIds = useSelector(selectMyClaimedFoodIds);
  const loading         = useSelector(selectIsLoading);
  const selectedFood    = useSelector((state) => selectFoodById(state, Number(id)));

  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLocLoading(true);
      const coords = await getDeviceLocation();
      dispatch(fetchAvailableFood(coords));
      dispatch(fetchMyClaims());
      setLocLoading(false);
    };
    load();
  }, [dispatch]);

  // Covers deep links / refreshes where the listing isn't in availableFood
  // or foodCache yet (e.g. shared link, first load on the detail route).
  useEffect(() => {
    if (id && !selectedFood) {
      dispatch(fetchFoodDetails(id));
    }
  }, [id, selectedFood, dispatch]);

  if (id) {
    if (loading && !selectedFood) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm font-medium text-gray-400">Loading donation details…</p>
          </div>
        </div>
      );
    }

    // Partners don't get a claim-flow view for expired food — treat it the
    // same as "not found" rather than rendering FoodDetail's expired state.
    const expired = selectedFood && isFoodExpired(selectedFood);
    if (!selectedFood || expired) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-500 font-bold mb-4">
              {expired ? 'This listing is no longer available.' : 'Donation not found.'}
            </p>
            <button onClick={() => navigate('/dashboard/browse')} className="text-brand-green font-bold underline">
              Back to listings
            </button>
          </div>
        </div>
      );
    }

    return (
      <FoodDetail
        key={id}
        food={selectedFood}
        isClaimedByMe={claimedFoodIds.has(selectedFood.id)}
        onBack={() => navigate('/dashboard/browse')}
      />
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-be-vietnam">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Food</h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-brand-mint/30 text-brand-green px-3 py-1.5 rounded-full border border-brand-green/10">
            <MapPin size={13} />
            <span className="text-xs font-bold uppercase tracking-wider">{user?.city || 'Your City'}</span>
          </div>
          <span className="text-gray-400 text-xs font-medium">
            {activeFood.length} listing{activeFood.length !== 1 ? 's' : ''}
          </span>
          {locLoading && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Finding your location…
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : activeFood.length > 0 ? (
          activeFood.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              isMyClaim={claimedFoodIds.has(food.id)}
              onView={() => navigate(`/dashboard/browse/${food.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">
              No food listings in {user?.city || 'your city'} right now
            </h3>
            <p className="text-gray-500 mt-2 text-sm">Check back soon — donors post throughout the day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableFood;