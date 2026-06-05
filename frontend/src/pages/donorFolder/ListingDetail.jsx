import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, MapPin, Clock, Package, User, Phone,
  CheckCircle, Lock, AlertCircle, Info, ShieldCheck
} from 'lucide-react';
import { fetchMyListings } from '../../store/slices/foodSlice';
import api from '../../auth/api';
import DonationJourney from '../../components/DonationJourney';

// ── ListingDetail — Donor's view of a single food listing ────────────────────
// Route: /dashboard/listings/:id
//
// Status-driven code verification panel:
//   available   → code box hidden, listing info only
//   claimed     → code input active, donor enters partner's code to verify
//   picked_up   → code box frozen (already verified), full journey shown
//   distributed → code box frozen, full journey shown
//   expired     → show expired state

const ListingDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const { myListings, loading } = useSelector((state) => state.food);

  const [code,        setCode]        = useState('');
  const [verifying,   setVerifying]   = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const listing = myListings.find(l => l.id === Number(id));

  // ── Derive the claim associated with this listing ─────────────────────────
  // The listing object from /food/my-listings/ may include claim info.
  // Adjust field names to match what your backend actually returns.
  const claimId        = listing?.claim_id || listing?.claim?.id || null;
  const pickupVerified = listing?.pickup_code_verified || listing?.claim?.pickup_code_verified || false;

  const handleVerify = async () => {
    if (!code.trim() || code.trim().length !== 4) {
      setVerifyError('Please enter the 4-character code shown by the partner.');
      return;
    }
    setVerifyError('');
    setVerifying(true);

    try {
      // Donor hits the same verify endpoint — backend matches codes from both ends
      await api.post(`claims/${claimId}/verify-pickup-code/`, {
        pickup_code: code.trim().toUpperCase(),
      });
      setVerifySuccess(true);
      // Refetch listings so the status updates across the UI
      dispatch(fetchMyListings());
    } catch (err) {
      const p = err.response?.data;
      setVerifyError(
        p?.detail || p?.error || p?.pickup_code?.[0] || 'Code verification failed. Please check the code and try again.'
      );
    } finally {
      setVerifying(false);
    }
  };

  // ── Loading / not found states ────────────────────────────────────────────
  if (loading && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading listing…</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">Listing not found.</p>
          <button onClick={() => navigate('/dashboard/my-listings')} className="text-brand-green font-bold underline">
            Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  const status = listing.status;

  // Map listing status to DonationJourney status prop
  const journeyStatus = {
    available:   'available',
    claimed:     'pending',
    picked_up:   'picked_up',
    distributed: 'distributed',
    expired:     'available',
  }[status] || 'available';

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard/my-listings')}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Back to My Listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Listing info ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">

              {/* Hero image */}
              <div className="h-72 relative">
                <img
                  src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                  className="w-full h-full object-cover"
                  alt={listing.food_type}
                />
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-black uppercase backdrop-blur
                  ${status === 'available'   ? 'bg-white/90 text-brand-green'  : ''}
                  ${status === 'claimed'     ? 'bg-amber-500 text-white'        : ''}
                  ${status === 'picked_up'  ? 'bg-blue-500 text-white'         : ''}
                  ${status === 'distributed'? 'bg-green-500 text-white'        : ''}
                  ${status === 'expired'    ? 'bg-red-500 text-white'          : ''}
                `}>
                  {status?.replace('_', ' ')}
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-black text-gray-900 mb-1">{listing.food_type}</h1>
                <p className="text-brand-green font-bold text-lg mb-8">
                  {listing.quantity_estimated} {listing.quantity_unit}
                </p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <InfoCell label="Quantity"       value={`${listing.quantity_estimated} ${listing.quantity_unit}`} />
                  <InfoCell label="Category"       value={listing.category || 'General'} />
                  <InfoCell label="Pickup Zone"    value={`${listing.pickup_city || ''}${listing.country ? ', ' + listing.country : ''}`} />
                  <InfoCell
                    label="Pickup Deadline"
                    value={new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    valueClass="text-red-500"
                  />
                </div>

                {/* Pickup window */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
                  <Clock size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Window</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {new Date(listing.pickup_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' → '}
                      {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
                  <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Address</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{listing.pickup_address}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
                  <User size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{listing.contact_person_name || '—'}</p>
                    {listing.contact_person_phone && (
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                        <Phone size={12} /> {listing.contact_person_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {listing.notes && (
                  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                    <Info size={18} className="text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{listing.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Status panel + code verification ── */}
          <div className="space-y-6">

            {/* ══════════════════════════════════════
                STATE 1: available — no code panel
            ══════════════════════════════════════ */}
            {status === 'available' && (
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <Package size={20} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Awaiting a partner</p>
                    <p className="text-xs text-gray-400">No one has claimed this yet</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4">
                  Once a partner claims this listing, you'll be able to verify their pickup code here to confirm collection.
                </p>
              </div>
            )}

            {/* ══════════════════════════════════════
                STATE 2: claimed — active code input
            ══════════════════════════════════════ */}
            {status === 'claimed' && (
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Partner is on their way</p>
                    <p className="text-xs text-gray-400">Enter the code they show you</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    When the partner arrives, they will show you a 4-character code on their screen. Enter it below to confirm the handover.
                  </p>
                </div>

                {/* Code input */}
                {!verifySuccess ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Partner's Pickup Code
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={code}
                        onChange={e => {
                          setCode(e.target.value.toUpperCase());
                          setVerifyError('');
                        }}
                        placeholder="e.g. 7E46"
                        className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-green/40 focus:bg-white outline-none transition-all uppercase"
                      />
                      {verifyError && (
                        <div className="flex items-start gap-2 mt-3 text-red-600">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <p className="text-xs font-medium">{verifyError}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={verifying || code.trim().length !== 4}
                      className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {verifying ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Verifying…
                        </span>
                      ) : 'Confirm Handover'}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                    <div>
                      <p className="font-black text-green-700 text-sm">Handover confirmed!</p>
                      <p className="text-xs text-green-600 mt-0.5">The partner's pickup has been recorded successfully.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════
                STATE 3: picked_up — frozen, verified
            ══════════════════════════════════════ */}
            {status === 'picked_up' && (
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Food collected</p>
                    <p className="text-xs text-gray-400">Pickup verified successfully</p>
                  </div>
                </div>

                {/* Frozen code input — visually locked */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lock size={11} /> Pickup Code (Verified)
                  </label>
                  <div className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-gray-100 rounded-2xl text-gray-300 select-none cursor-not-allowed border-2 border-transparent">
                    ••••
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <Lock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600 font-medium leading-relaxed">
                    The pickup code was already verified. The partner is now distributing the food to beneficiaries.
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                STATE 4: distributed — complete
            ══════════════════════════════════════ */}
            {status === 'distributed' && (
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Fully distributed</p>
                    <p className="text-xs text-gray-400">This donation is complete</p>
                  </div>
                </div>

                {/* Frozen code input */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lock size={11} /> Pickup Code (Verified)
                  </label>
                  <div className="w-full text-center text-3xl font-black tracking-[0.4em] py-4 bg-gray-100 rounded-2xl text-gray-300 select-none cursor-not-allowed border-2 border-transparent">
                    ••••
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 font-medium leading-relaxed">
                    This donation has completed its full journey. Thank you for reducing food waste!
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                STATE 5: expired
            ══════════════════════════════════════ */}
            {status === 'expired' && (
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Listing expired</p>
                    <p className="text-xs text-gray-400">Pickup window has passed</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4">
                  No partner claimed this listing before the deadline. Consider posting it again with a new pickup window.
                </p>
                <button
                  onClick={() => navigate('/dashboard/create-listing')}
                  className="w-full mt-4 bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-opacity-90 transition-all text-sm"
                >
                  Post Again
                </button>
              </div>
            )}

            {/* Donation Journey — visible for claimed and beyond */}
            {['claimed', 'picked_up', 'distributed'].includes(status) && (
              <DonationJourney
                status={journeyStatus}
                pickup_code_verified={pickupVerified || verifySuccess}
                donorName={listing.contact_person_name}
                partnerName={listing.claim?.partner_name || null}
              />
            )}
          </div>

        </div>
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

export default ListingDetail;
