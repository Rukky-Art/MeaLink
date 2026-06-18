/**
 * VerificationGate.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable gate component that blocks access to a page or feature
 * if the user's account is not yet verified by admin.
 *
 * Usage — wrap any protected page:
 *   <VerificationGate>
 *     <PostFood />
 *   </VerificationGate>
 *
 * Or use the hook directly for conditional UI:
 *   const { isVerified, isPending, isRejected } = useVerificationStatus();
 */


import { useNavigate } from 'react-router';
import { Clock, XCircle, ChevronRight, Mail } from 'lucide-react';
import useVerificationStatus from './useVerificationStatus'

// ── Hook — use anywhere you need verification status ──────────────────────────


// ── Gate screens ──────────────────────────────────────────────────────────────

const PendingScreen = ({ role }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-be-vietnam">
    <div className="max-w-md w-full text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
        <Clock size={36} className="text-amber-500" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-3">
        Verification Pending
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        Your {role === 'donor' ? 'donor' : 'partner'} account is currently under review.
        Our admin team is verifying your business registration documents.
        This usually takes <span className="font-bold text-slate-700">1–2 business days</span>.
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 text-left space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          What happens next
        </p>
        {[
          { step: '1', text: 'Admin reviews your registration certificate' },
          { step: '2', text: 'You receive an email notification with the decision' },
          { step: '3', text: role === 'donor'
              ? 'Once approved, you can start posting food listings'
              : 'Once approved, you can claim food and record distributions'
          },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
              {step}
            </span>
            <p className="text-sm text-slate-600 font-medium">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <Mail size={13} />
        Questions? Contact us at{' '}
        <a href="mailto:support@mealink.africa" className="text-brand-green font-bold hover:underline">
          support@mealink.africa
        </a>
      </div>
    </div>
  </div>
);

const RejectedScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-be-vietnam">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
          <XCircle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-3">
          Verification Unsuccessful
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Unfortunately, your account verification was not approved.
          This is usually due to an issue with your submitted documents.
          Please update your details and resubmit for review.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 text-left">
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
            Common reasons for rejection
          </p>
          <ul className="space-y-1.5">
            {[
              'Registration number could not be verified',
              'Certificate image was unclear or expired',
              'Organisation details did not match certificate',
              'Required documents were incomplete',
            ].map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-700 font-medium">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="w-full h-12 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
          >
            Update my documents <ChevronRight size={16} />
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <Mail size={13} />
            Need help?{' '}
            <a href="mailto:support@mealink.africa" className="text-brand-green font-bold hover:underline">
              support@mealink.africa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Gate component ────────────────────────────────────────────────────────────

const VerificationGate = ({ children }) => {
  const { isVerified, isPending, isRejected, user } = useVerificationStatus();

  if (isVerified) return children;
  if (isRejected) return <RejectedScreen role={user?.role} />;
  if (isPending)  return <PendingScreen  role={user?.role} />;

  // Fallback — no user state yet (loading), show nothing
  return null;
};

export default VerificationGate;