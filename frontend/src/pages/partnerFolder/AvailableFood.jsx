import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin, Clock, CheckCircle, ShoppingBag,
  ArrowLeft, User, Phone, AlertCircle, ShieldCheck, Info
} from 'lucide-react';
import { fetchAvailableFood, fetchMyClaims, claimFood } from '../../store/slices/partnerSlice';
import {selectVisibleFood, selectMyClaims, selectIsLoading, selectIsActionLoading} from '../../store/slices/partnerSlice';

const AvailableFood = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [claimError,   setClaimError]   = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

const availableFood = useSelector(selectVisibleFood);
  const myClaims = useSelector(selectMyClaims);
  const loading = useSelector(selectIsLoading);
  const claimLoading = useSelector(selectIsActionLoading);
  useEffect(() => {
    dispatch(fetchAvailableFood());
    dispatch(fetchMyClaims());
  }, [dispatch]);

  // ── FIX: don't use useEffect to reset state ──────────────────────────────
  // Instead, derive a stable key from `id` and pass it to the detail view
  // so React unmounts/remounts it cleanly when the ID changes.
  // State resets happen naturally on unmount, no setState-in-effect needed.

  const selectedFood = id
    ? availableFood.find(f => f.id === Number(id)) || null
    : null;

const isClaimedByMe = selectedFood && myClaims.length > 0
  ? myClaims.some(c => {
      // 1. If it's a cancelled claim, don't let it mark the food as "claimed by me"
      if (c.status === 'cancelled') return false; 
      
      // 2. Extract the food ID out of the object safely
      const claimFoodId = typeof c.food === 'object' ? c.food?.id : c.food;
      return claimFoodId && Number(claimFoodId) === Number(selectedFood.id);
    })
  : false;

  const isClaimedByOthers = selectedFood?.is_claimed && !isClaimedByMe;

  const handleClaim = async () => {
    if (!selectedFood) return;
    setClaimError('');
    const result = await dispatch(claimFood(Number(selectedFood.id)));
    if (claimFood.fulfilled.match(result)) {
      setClaimSuccess(true);
      dispatch(fetchAvailableFood());
      dispatch(fetchMyClaims());
    }
    if (claimFood.rejected.match(result)) {
      const p = result.payload;
      setClaimError(p?.error || p?.detail || p?.non_field_errors?.[0] || 'Failed to claim. Please try again.');
    }
  };

  // ── DETAIL VIEW ───────────────────────────────────────────────────────────
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

    if (!selectedFood) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-500 font-bold mb-4">Donation not found.</p>
            <button onClick={() => navigate('/dashboard/browse')} className="text-brand-green font-bold underline">
              Back to listings
            </button>
          </div>
        </div>
      );
    }

    return (
      // ── key={id} is the fix: when ID changes React fully remounts this subtree
      // so claimError and claimSuccess reset to their initial values automatically
      // without needing a useEffect setState call
      <div key={id} className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/dashboard/browse')} className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Back to listings</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Food detail */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-80 relative">
                  <img
                    src={selectedFood.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                    className="w-full h-full object-cover"
                    alt={selectedFood.food_type}
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-brand-green uppercase">
                    {isClaimedByMe || claimSuccess ? 'Reserved by you' : selectedFood.is_claimed ? 'Reserved' : 'Available'}
                  </div>
                </div>

                <div className="p-8">
                  <h1 className="text-3xl font-black text-gray-900 mb-1">{selectedFood.food_type}</h1>
                  <p className="text-brand-green font-bold text-lg mb-2">{selectedFood.quantity_estimated} {selectedFood.quantity_unit}</p>

                  {selectedFood.donor_name && (
                    <div className="flex items-center gap-2 mt-3 mb-8 text-gray-500">
                      <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {selectedFood.donor_name[0]}
                      </div>
                      <span className="text-sm">Posted by <span className="font-bold text-gray-900">{selectedFood.donor_name}</span> · Verified Donor</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <InfoCell label="Quantity"       value={`${selectedFood.quantity_estimated} ${selectedFood.quantity_unit}`} />
                    <InfoCell label="Category"       value={selectedFood.category || 'General'} />
                    <InfoCell label="Pickup Zone"    value={`${selectedFood.pickup_city || ''}${selectedFood.country ? ', ' + selectedFood.country : ''}`} />
                    <InfoCell label="Pickup Deadline" value={new Date(selectedFood.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} valueClass="text-red-500" />
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
                    <Clock size={18} className="text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Window</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {new Date(selectedFood.pickup_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' → '}
                        {new Date(selectedFood.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
                    <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Address</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedFood.pickup_address}</p>
                    </div>
                  </div>

                  {selectedFood.notes && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                      <Info size={18} className="text-brand-green shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes</p>
                        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{selectedFood.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Claim sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                {isClaimedByMe || claimSuccess ? (
                  <div className="flex flex-col items-center text-center gap-3 py-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                      <CheckCircle size={28} className="text-blue-500" />
                    </div>
                    <p className="font-black text-gray-900">You've claimed this!</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Go to the pickup address before the deadline to collect.</p>
                    <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">What's next</p>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Go to My Claims to confirm pickup and track your donation journey.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/my-claims')}
                      className="w-full bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-opacity-90 transition-all text-sm"
                    >
                      Go to My Claims →
                    </button>
                  </div>
                ) : isClaimedByOthers ? (
                  <div className="flex gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <ShieldCheck size={20} className="text-gray-400 shrink-0" />
                    <p className="text-xs font-bold text-gray-500">This listing has already been claimed by another partner.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                      <Clock size={20} className="text-red-500 shrink-0" />
                      <p className="text-xs text-red-600 leading-tight">Pickup closes soon — claim now to secure this donation.</p>
                    </div>

                    {claimError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <p className="text-xs font-medium">{claimError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleClaim}
                      disabled={claimLoading}
                      className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claimLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Processing…
                        </span>
                      ) : 'Claim this donation'}
                    </button>
                  </>
                )}
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pickup Contact</h4>
                <div className="space-y-4">
                  <ContactRow icon={User}  label="Contact Person" value={selectedFood.donor_name || selectedFood.contact_person_name || '—'} />
                  <ContactRow icon={Phone} label="Phone"
                    value={isClaimedByMe || claimSuccess
                      ? selectedFood.contact_person_phone || selectedFood.donor_phone || '—'
                      : '+234 ••• ••• •••'}
                  />
                  <ContactRow icon={MapPin} label="Address" value={selectedFood.pickup_address || '—'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-be-vietnam">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Food</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-brand-mint/30 text-brand-green px-3 py-1 rounded-full border border-brand-green/10">
            <MapPin size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">{user?.city || 'Your City'}</span>
          </div>
          <span className="text-gray-400 text-xs font-medium">
            {availableFood.length} listing{availableFood.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : availableFood.length > 0 ? (
          availableFood.map((food) => {
  // Check if this specific food is attached to any active (non-cancelled) claim of yours
  const isMyClaim = myClaims.some(c => {
    if (c.status === 'cancelled') return false;
    
    const claimFoodId = typeof c.food === 'object' ? c.food?.id : c.food;
    return claimFoodId && Number(claimFoodId) === Number(food.id);
  });

  return (
    <FoodCard
      key={food.id}
      food={food}
      isMyClaim={isMyClaim}
      onView={() => navigate(`/dashboard/browse/${food.id}`)}
    />
  );
})
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No food listings in {user?.city || 'your city'} right now</h3>
            <p className="text-gray-500 mt-2">Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCell = ({ label, value, valueClass = 'text-gray-900' }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`font-bold ${valueClass}`}>{value}</p>
  </div>
);

const ContactRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gray-50 rounded-lg"><Icon size={18} className="text-gray-400" /></div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const FoodCard = ({ food, isMyClaim, onView }) => {
  const isClaimedByOthers = food.is_claimed && !isMyClaim;
  return (
    <div className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={food.food_type}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-brand-green">
          {food.category || 'Surplus'}
        </div>
        {isMyClaim && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Claimed</div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-gray-900 leading-tight truncate mb-2">{food.food_type}</h3>
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} className="text-brand-green" />
            <span className="text-sm font-medium truncate">{food.pickup_address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={16} className="text-brand-green" />
            <span className="text-sm font-medium">Until {new Date(food.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Quantity</p>
            <p className="text-lg font-black text-brand-green">
              {food.quantity_estimated}{' '}
              <span className="text-xs font-bold text-gray-400 uppercase">{food.quantity_unit}</span>
            </p>
          </div>
          {isClaimedByOthers ? (
            <div className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold text-sm">Taken</div>
          ) : (
            <button onClick={onView} className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-green/90 transition-all active:scale-95 shadow-lg shadow-brand-green/20">
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableFood;