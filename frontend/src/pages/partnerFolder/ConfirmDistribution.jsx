import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { recordDistribution } from '../../store/slices/partnerSlice';
import DonationJourney from '../../components/DonationJourney';

// ── ConfirmDistribution — Step 2 of the post-claim flow ──────────────────────
// Route: /dashboard/claims/:claimId/confirm-distribution

const ConfirmDistribution = () => {
  const { claimId } = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();

  const { myClaims } = useSelector((state) => state.partner);
  const { user }     = useSelector((state) => state.auth);

  const claim = myClaims.find(c => c.id === Number(claimId));

  const food     = claim?.food_details || claim?.food_data || null;
  const foodName = food?.food_type  || claim?.food_type  || `Claim #${claimId}`;
  const donor    = food?.donor_name || claim?.donor_name || '—';

  const [beneficiaries, setBeneficiaries] = useState('');
  const [notes,         setNotes]         = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState(false);

  const handleSubmit = async () => {
    if (!beneficiaries || Number(beneficiaries) <= 0) {
      setError('Please enter the number of people who received this food.');
      return;
    }
    setError('');
    setSubmitting(true);

   const result = await dispatch(recordDistribution({
  claim: Number(claimId),
  recipients_count: Number(beneficiaries),
  notes: notes || null,
}));

    setSubmitting(false);

    if (recordDistribution.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/claims/${claimId}/impact`), 1500);
    } else {
      const p = result.payload;
      setError(p?.detail || p?.error || 'Failed to record distribution. Please try again.');
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

        <button onClick={() => navigate('/dashboard/my-claims')} className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all">
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">{foodName} — {donor}</span>
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Confirm pickup', 'Confirm distribution', 'Impact recorded'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold
                ${i === 0 ? 'bg-green-100 text-green-700' : i === 1 ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black
                  ${i === 0 ? 'bg-green-500 text-white' : i === 1 ? 'bg-white text-brand-green' : 'bg-gray-300 text-white'}`}>
                  {i === 0 ? <CheckCircle size={10} /> : i + 1}
                </span>
                {label}
              </div>
              {i < 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Confirm distribution</h2>
              <p className="text-sm text-gray-500 mb-8">
                Record how the food was distributed to beneficiaries in your community.
              </p>

              {/* Beneficiaries count */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Number of people who received this food *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={beneficiaries}
                    onChange={e => setBeneficiaries(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-green/40 focus:bg-white outline-none font-bold text-gray-900 transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Distribution notes <span className="font-normal normal-case text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Distributed at community centre, some packaging was damaged…"
                  rows={3}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-green/40 focus:bg-white outline-none text-gray-700 font-medium transition-all resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
                  <CheckCircle size={18} />
                  <p className="text-sm font-bold">Distribution recorded! Loading impact summary…</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || success}
                className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Recording…
                  </span>
                ) : 'Confirm distribution'}
              </button>

              <button onClick={() => navigate('/dashboard/my-claims')} className="w-full text-gray-500 font-medium py-3 mt-2 hover:text-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>

          <div>
            <DonationJourney
              status="picked_up"
              pickup_code_verified={true}
              donorName={donor}
              partnerName={user?.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDistribution;
