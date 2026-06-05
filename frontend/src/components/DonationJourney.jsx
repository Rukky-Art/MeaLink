import { Check, Circle } from 'lucide-react';

const STEPS = [
  { key: 'posted',     label: 'Posted by donor'       },
  { key: 'claimed',    label: 'Claimed by partner'     },
  { key: 'pickup',     label: 'Pickup confirmation'    },
  { key: 'distributed',label: 'Distribution confirmed' },
  { key: 'impact',     label: 'Impact recorded'        },
];

const getCompletedSteps = (status, pickup_code_verified) => {
  const completed = new Set(['posted', 'claimed']);
  if (pickup_code_verified || status === 'picked_up' || status === 'distributed') {
    completed.add('pickup');
  }
  if (status === 'distributed') {
    completed.add('distributed');
    completed.add('impact');
  }
  return completed;
};

const getActiveStep = (status, pickup_code_verified) => {
  if (status === 'distributed')                          return 'impact';
  if (status === 'picked_up')                            return 'distributed';
  if (status === 'pending' && pickup_code_verified)      return 'pickup';
  return 'pickup';
};

const DonationJourney = ({ status, pickup_code_verified, donorName, partnerName }) => {
  const completed  = getCompletedSteps(status, pickup_code_verified);
  const activeStep = getActiveStep(status, pickup_code_verified);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 text-sm mb-5 uppercase tracking-wider">
        Donation Journey
      </h3>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const isDone   = completed.has(step.key);
          const isActive = activeStep === step.key && !isDone;

          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* Line connector */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                  ${isDone   ? 'bg-brand-green text-white'         : ''}
                  ${isActive ? 'bg-amber-400 text-white'           : ''}
                  ${!isDone && !isActive ? 'bg-gray-100 text-gray-400' : ''}
                `}>
                  {isDone ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <Circle size={8} fill="currentColor" stroke="none" />
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-px h-6 mt-1 ${isDone ? 'bg-brand-green/30' : 'bg-gray-100'}`} />
                )}
              </div>

              {/* Label */}
              <div className="pb-1">
                <p className={`text-sm font-medium leading-none mt-0.5
                  ${isDone   ? 'text-gray-900 font-bold' : ''}
                  ${isActive ? 'text-amber-600 font-bold' : ''}
                  ${!isDone && !isActive ? 'text-gray-400' : ''}
                `}>
                  {step.label}
                </p>
                {/* Contextual sub-labels */}
                {step.key === 'posted' && donorName && isDone && (
                  <p className="text-[11px] text-gray-400 mt-0.5">by {donorName}</p>
                )}
                {step.key === 'claimed' && partnerName && isDone && (
                  <p className="text-[11px] text-gray-400 mt-0.5">by {partnerName}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonationJourney;
