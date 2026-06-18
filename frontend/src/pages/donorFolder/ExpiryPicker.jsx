import { useMemo } from "react";

export const ExpiryPicker = ({ days, hours, minutes, onChange, baseTime }) => {
  const totalMs =
    (Number(days) * 24 * 60 * 60 * 1000) +
    (Number(hours) * 60 * 60 * 1000) +
    (Number(minutes) * 60 * 1000);

  const hasExpiry = totalMs > 0;

  const expiryLabel = useMemo(() => {
    if (!hasExpiry || !baseTime) return null;
    return new Date(baseTime.getTime() + totalMs).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }, [totalMs, hasExpiry, baseTime]);

  const presets = [
    { label: '2 hrs',   d: 0, h: 2,  m: 0  },
    { label: '6 hrs',   d: 0, h: 6,  m: 0  },
    { label: '12 hrs',  d: 0, h: 12, m: 0  },
    { label: '1 day',   d: 1, h: 0,  m: 0  },
    { label: '2 days',  d: 2, h: 0,  m: 0  },
    { label: '3 days',  d: 3, h: 0,  m: 0  },
  ];

  const applyPreset = (preset) => {
    onChange('expiry_days',    preset.d);
    onChange('expiry_hours',   preset.h);
    onChange('expiry_minutes', preset.m);
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
            {/* hourglass emoji as icon — no extra import needed */}
            <span className="text-lg">⏳</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Food Expiry</h3>
            <p className="text-xs text-gray-400">
              How long before this food spoils?
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quick presets */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Quick select
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const isActive = Number(days) === p.d && Number(hours) === p.h && Number(minutes) === p.m;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all
                    ${isActive
                      ? 'border-brand-green bg-brand-green/5 text-brand-green'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual duration inputs */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Or set custom duration
          </p>
          <div className="grid grid-cols-3 gap-3">
            {/* Days */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block ml-1">Days</label>
              <input
                type="number"
                min="0"
                max="30"
                value={days}
                onChange={(e) => onChange('expiry_days', Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full p-3 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-brand-green/40 focus:bg-white font-bold text-gray-800 text-center text-lg transition-all"
              />
            </div>
            {/* Hours */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block ml-1">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => onChange('expiry_hours', Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full p-3 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-brand-green/40 focus:bg-white font-bold text-gray-800 text-center text-lg transition-all"
              />
            </div>
            {/* Minutes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block ml-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => onChange('expiry_minutes', Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full p-3 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-brand-green/40 focus:bg-white font-bold text-gray-800 text-center text-lg transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live preview */}
        {hasExpiry ? (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
            <span className="text-base">⚠️</span>
            <div>
              <p className="text-xs font-bold text-rose-700">
                Food expires in{' '}
                {Number(days) > 0 && `${days}d `}
                {Number(hours) > 0 && `${hours}h `}
                {Number(minutes) > 0 && `${minutes}m`}
              </p>
            
              <p className="text-[11px] text-rose-500 mt-0.5">
  Expires at {expiryLabel}
</p>
              
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <span className="text-base">ℹ️</span>
            <p className="text-xs text-gray-400 font-medium">
              No expiry set — food listing will stay active until pickup window closes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
