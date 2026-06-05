import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { ArrowLeft, Sparkles, MapPin, Clock, Users, Package } from 'lucide-react';
import DonationJourney from '../../components/DonationJourney';

// ── ImpactRecorded — Step 3, final summary ────────────────────────────────────
// Route: /dashboard/claims/:claimId/impact

const ImpactRecorded = () => {
  const { claimId } = useParams();
  const navigate    = useNavigate();

  const { myClaims } = useSelector((state) => state.partner);
  const { user }     = useSelector((state) => state.auth);

const claim = myClaims.find(
  c => c.id === Number(claimId)
);

const food = claim?.food || null;

const foodName =
  food?.food_type || `Claim #${claimId}`;

const donor =
  claim?.donor?.name || '—';

const quantity =
  food?.quantity_estimated || '—';

const unit =
  food?.quantity_unit || '';

const address =
  food?.pickup_address || '—';

const claimTime =
  claim?.claim_time
    ? new Date(claim.claim_time).toLocaleDateString(
        'en-NG',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      )
    : '—';

const recipients =
  claim?.distribution?.recipients_count || '—';

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
      <div className="max-w-5xl mx-auto">

        <button onClick={() => navigate('/dashboard/my-claims')} className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all">
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Back to My Claims</span>
        </button>

        {/* Step indicator — all complete */}
        <div className="flex items-center gap-2 mb-8">
          {['Confirm pickup', 'Confirm distribution', 'Impact recorded'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                {label}
              </div>
              {i < 2 && <div className="w-6 h-px bg-green-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Hero success card */}
            <div className="bg-brand-green rounded-[32px] p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2">Impact Recorded!</h2>
              <p className="text-brand-mint/80 text-sm">
                This donation has completed its full journey from donor to community.
              </p>
            </div>

            {/* Full journey details */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h3 className="font-black text-gray-900 text-lg mb-6">Full Donation Summary</h3>

              <div className="space-y-4">
                <DetailRow icon={Package}  label="Donation"        value={`${foodName} — ${quantity} ${unit}`} />
                <DetailRow icon={MapPin}   label="Donor"           value={donor} />
                <DetailRow icon={MapPin}   label="Pickup Location" value={address} />
                <DetailRow icon={Clock}    label="Claimed on"      value={claimTime} />
                <DetailRow icon={Users}    label="People fed"      value={recipients !== '—' ? `${recipients} people` : '—'} highlight />
              </div>

              {claim?.distribution?.notes && (
                <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Distribution Notes</p>
                  <p className="text-sm text-gray-700">{claim.distribution.notes}</p>
                </div>
              )}
            </div>

          </div>

          <div className="space-y-4">
            <DonationJourney
              status="distributed"
              pickup_code_verified={true}
              donorName={donor}
              partnerName={user?.name}
            />

            <button
              onClick={() => navigate('/dashboard/browse')}
              className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20"
            >
              Browse More Food
            </button>
            <button
              onClick={() => navigate('/dashboard/my-claims')}
              className="w-full border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all"
            >
              Back to My Claims
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3 text-gray-500">
      <Icon size={16} className="text-brand-green" />
      <span className="text-sm">{label}</span>
    </div>
    <span className={`text-sm font-bold ${highlight ? 'text-brand-green text-base' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

export default ImpactRecorded;
