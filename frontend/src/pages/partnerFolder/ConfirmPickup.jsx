import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft,  AlertCircle, CheckCircle } from 'lucide-react';
import { verifyPickup } from '../../store/slices/partnerSlice';
import DonationJourney from '../../components/DonationJourney';


const ConfirmPickup = () => {
  const { claimId } = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();

  const { myClaims }   = useSelector((state) => state.partner);
  const { user }       = useSelector((state) => state.auth);

  // Find the claim from local state — no extra API call needed
  const claim = myClaims.find(c => c.id === Number(claimId));

  const [confirmed,  setConfirmed]  = useState(false); // checkbox
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);

  // food details might be nested or flat depending on your backend
  // const food = claim?.food_details || claim?.food_data || null;
  // const foodName = food?.food_type || `Claim #${claimId}`;
  // const quantity  = food?.quantity_estimated || claim?.quantity_estimated || '—';
  // const unit      = food?.quantity_unit  || '';
  // const donor = claim?.donor?.name || '—';
  // const location  = food?.pickup_address  || 'location not specified';
const food = claim?.food || null;

const foodName = food?.food_type || `Claim #${claimId}`;
const quantity = food?.quantity_estimated || '—';
const unit = food?.quantity_unit || '';
const donor = claim?.donor?.name || '—';
const location = food?.pickup_address || 'Location not specified';


  const handleConfirmPickup = async () => {
    if (!confirmed) return;
    setError('');
    setSubmitting(true);

    const result = await dispatch(verifyPickup({
      claimId: Number(claimId),
      code:    claim?.pickup_code,
    }));

    setSubmitting(false);

    if (verifyPickup.fulfilled.match(result)) {
      setSuccess(true);
      // Short delay so user sees the success state, then go to distribution step
      setTimeout(() => navigate(`/dashboard/claims/${claimId}/confirm-distribution`), 1500);
    } else {
      const p = result.payload;
      setError(p?.detail || p?.error || 'Verification failed. Please try again.');
    }
  };

  if (!claim) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">Claim not found.</p>
          <button onClick={() => navigate('/dashboard/my-claims')} className="text-brand-green font-bold underline">
            Back to My Claims
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
      <div className="max-w-5xl mx-auto">

        {/* Back + title */}
        <button
          onClick={() => navigate('/dashboard/my-claims')}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">{foodName} — {donor}</span>
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Confirm pickup', 'Confirm distribution', 'Impact recorded'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold
                ${i === 0 ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black
                  ${i === 0 ? 'bg-white text-brand-green' : 'bg-gray-300 text-white'}`}>
                  {i + 1}
                </span>
                {label}
              </div>
              {i < 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Confirm food pickup</h2>
              <p className="text-sm text-gray-500 mb-8">
                Confirm that you have physically collected the food from the donor. They will be notified automatically.
              </p>

              {/* Donation summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-3">
                <SummaryRow label="Donation" value={`${foodName} — ${quantity} ${unit}`} />
                <SummaryRow label="Donor"    value={donor} />
                <SummaryRow label="Location" value={location} />
                <SummaryRow
                  label="Status"
                  value={claim.status}
                  valueClass="text-amber-500 font-black capitalize"
                />
              </div>

              {/* ── PICKUP CODE ── */}
              {/* This is the code the partner shows to the donor for verification */}
              <div className="bg-brand-green/5 border-2 border-brand-green/20 rounded-2xl p-6 mb-8 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Your Pickup Code
                </p>
                <p className="text-5xl font-black tracking-[0.3em] text-brand-green mb-3">
                  {claim.pickup_code}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Show this code to the donor. Once they confirm it matches on their end, 
                  you can proceed to confirm the pickup below.
                </p>
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                  ${claim.pickup_code_verified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${claim.pickup_code_verified ? 'bg-green-500' : 'bg-amber-500'}`} />
                  {claim.pickup_code_verified ? 'Code verified by donor' : 'Awaiting donor verification'}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
                  <CheckCircle size={18} />
                  <p className="text-sm font-bold">Pickup confirmed! Moving to distribution…</p>
                </div>
              )}

              {/* Confirmation checkbox */}
              <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                    ${confirmed ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green/50'}`}>
                    {confirmed && <CheckCircle size={12} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">
                  I confirm the food has been physically collected from the donor location.
                </span>
              </label>

              {/* Confirm button — disabled until checkbox is ticked */}
              <button
                onClick={handleConfirmPickup}
                disabled={!confirmed || submitting || success}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Confirming…
                  </span>
                ) : 'Confirm pickup'}
              </button>

              <button
                onClick={() => navigate('/dashboard/my-claims')}
                className="w-full text-gray-500 font-medium py-3 mt-2 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* ── Donation Journey sidebar ── */}
          <div>
            <DonationJourney
              status={claim.status}
              pickup_code_verified={claim.pickup_code_verified}
              donorName={donor}
              partnerName={user?.name}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, valueClass = 'text-gray-900 font-semibold' }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-sm ${valueClass}`}>{value}</span>
  </div>
);

export default ConfirmPickup;
