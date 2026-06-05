import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, ShoppingBag, Clock, CheckCircle, Package, X, User, Phone, Info, AlertCircle, ShieldCheck } from 'lucide-react';
import { fetchAvailableFood, fetchMyClaims, claimFood } from '../store/slices/partnerSlice';

const PartnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { availableFood, myClaims, loading, claimLoading } = useSelector((state) => state.partner);

  const [selectedFood, setSelectedFood] = useState(null); // controls the drawer
  const [claimError,   setClaimError]   = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const availableCount = availableFood.filter(f => !f.is_claimed).length;
  const myClaimsCount  = myClaims.length;

  useEffect(() => {
    dispatch(fetchAvailableFood());
    dispatch(fetchMyClaims());
  }, [dispatch]);

  // Open drawer with this food item
  const openDrawer = (food) => {
    setSelectedFood(food);
    setClaimError('');
    setClaimSuccess(false);
  };

  const closeDrawer = () => {
    setSelectedFood(null);
    setClaimError('');
    setClaimSuccess(false);
  };

  const handleClaim = async () => {
    if (!selectedFood) return;
    setClaimError('');

    const result = await dispatch(claimFood(Number(selectedFood.id)));

    if (claimFood.fulfilled.match(result)) {
      setClaimSuccess(true);
      // Refresh both lists so counts and badges update
      dispatch(fetchAvailableFood());
      dispatch(fetchMyClaims());
    }

    if (claimFood.rejected.match(result)) {
      const p = result.payload;
      setClaimError(
        p?.error || p?.detail || p?.non_field_errors?.[0] || 'Failed to claim. Please try again.'
      );
    }
  };

  // Is the currently open food already claimed by me?
  const isClaimedByMe = selectedFood
    ? myClaims.some(c => c.food === selectedFood.id || c.food?.id === selectedFood.id)
    : false;

  const isClaimedByOthers = selectedFood?.is_claimed && !isClaimedByMe;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-be-vietnam">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Food</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-brand-mint/30 text-brand-green px-3 py-1 rounded-full border border-brand-green/10">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {user?.city || 'Your City'}
              </span>
            </div>
            <span className="text-gray-400 text-xs font-medium">
              {availableFood.length} listing{availableFood.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <StatCard icon={<Package className="text-brand-green" />}  label="Available" value={availableCount} />
          <StatCard icon={<CheckCircle className="text-blue-500" />} label="My Claims" value={myClaimsCount}  />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : availableFood.length > 0 ? (
          availableFood.map((food) => {
            const isMine = myClaims.some(c => c.food === food.id || c.food?.id === food.id);
            return (
              <FoodCard
                key={food.id}
                food={food}
                isMyClaim={isMine}
                onClick={() => openDrawer(food)}
              />
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No surplus food in {user?.city} right now</h3>
            <p className="text-gray-500 mt-2">Check back soon.</p>
          </div>
        )}
      </div>

      {/* ── Drawer overlay ── */}
      {selectedFood && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer panel — slides in from the right */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">

            {/* Drawer header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-lg">Donation Details</h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto">

              {/* Food image */}
              <div className="h-56 relative">
                <img
                  src={selectedFood.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                  className="w-full h-full object-cover"
                  alt={selectedFood.food_type}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-brand-green">
                  {isClaimedByMe || claimSuccess ? 'Reserved by you' : selectedFood.is_claimed ? 'Reserved' : 'Available'}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {selectedFood.food_type}
                  </h3>
                  <p className="text-brand-green font-bold text-sm mt-1">
                    {selectedFood.quantity_estimated} {selectedFood.quantity_unit}
                  </p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoCell label="Category"    value={selectedFood.category || 'General'} />
                  <InfoCell label="Quantity"    value={`${selectedFood.quantity_estimated} ${selectedFood.quantity_unit}`} />
                  <InfoCell label="City"        value={selectedFood.pickup_city || selectedFood.city || '—'} />
                  <InfoCell
                    label="Pickup Deadline"
                    value={`${new Date(selectedFood.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    valueClass="text-red-500"
                  />
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                  <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Address</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedFood.pickup_address}</p>
                  </div>
                </div>

                {/* Pickup window */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
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

                {/* Notes */}
                {selectedFood.notes && (
                  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                    <Info size={18} className="text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-gray-700 mt-0.5">{selectedFood.notes}</p>
                    </div>
                  </div>
                )}

                {/* Contact — only revealed after claiming */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Donor Contact</p>
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{selectedFood.donor_name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">
                      {isClaimedByMe || claimSuccess
                        ? selectedFood.contact_person_phone || selectedFood.donor_phone || '—'
                        : '+234 ••• ••• •••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer footer — sticky claim action */}
            <div className="p-6 border-t border-gray-100 space-y-3">
              {isClaimedByMe || claimSuccess ? (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-blue-700">You've claimed this!</p>
                    <p className="text-xs text-blue-500 mt-0.5">Go to the address before the deadline to collect.</p>
                  </div>
                </div>
              ) : isClaimedByOthers ? (
                <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-4">
                  <ShieldCheck size={20} className="text-gray-400 shrink-0" />
                  <p className="text-sm font-bold text-gray-500">Already claimed by another partner.</p>
                </div>
              ) : (
                <>
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
          </div>
        </>
      )}
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
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

const FoodCard = ({ food, isMyClaim, onClick }) => {
  const isClaimedByOthers = food.is_claimed && !isMyClaim;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={food.food_type}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-brand-green">
          {food.category || 'Surplus'}
        </div>
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
            <span className="text-sm font-medium">
              Until {new Date(food.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
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

          {isMyClaim ? (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
              <CheckCircle size={18} />
              <span className="font-bold text-sm">Claimed</span>
            </div>
          ) : isClaimedByOthers ? (
            <div className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold text-sm">Taken</div>
          ) : (
            <div className="bg-brand-green/10 text-brand-green px-6 py-3 rounded-xl font-bold text-sm">View →</div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCell = ({ label, value, valueClass = 'text-gray-900' }) => (
  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`font-bold text-sm ${valueClass}`}>{value}</p>
  </div>
);

export default PartnerDashboard;