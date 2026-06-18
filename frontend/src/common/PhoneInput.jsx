/**
 * PhoneInput.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Professional African phone number input.
 *
 * How African numbers work:
 *   - Users dial locally WITH a leading 0:  08149376175  (Nigeria)
 *   - International format DROPS the 0:    +2348149376175
 *   - This component accepts the local format (with or without 0)
 *     and always sends the correct E.164 international format to the backend.
 *
 * Usage:
 *   <Controller
 *     name="phone"
 *     control={control}
 *     defaultValue=""
 *     render={({ field }) => (
 *       <PhoneInput
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         error={errors.phone}
 *         defaultDial={currentDial}
 *       />
 *     )}
 *   />
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ── Country config ─────────────────────────────────────────────────────────────
// localDigits: digits AFTER stripping the leading 0 (what gets sent to backend)
// localLength: total local digits INCLUDING leading 0 (what user types)
// placeholder: shown in the input field — local format with 0
const DIAL_CODES = [
  {
    country:      'Nigeria',
    code:         'NG',
    dial:         '234',
    flag:         '🇳🇬',
    localLength:  11,   // 08149376175 — 11 digits with 0
    localDigits:  10,   // 8149376175  — 10 digits without 0 (what goes to backend)
    placeholder:  '0813 767 0975',
    example:      '08137670975',
  },
  {
    country:      'Cameroon',
    code:         'CM',
    dial:         '237',
    flag:         '🇨🇲',
    localLength:  9,    // 677123456 — no leading 0 in Cameroon
    localDigits:  9,
    placeholder:  '677 123 456',
    example:      '677123456',
  },
  {
    country:      'Kenya',
    code:         'KE',
    dial:         '254',
    flag:         '🇰🇪',
    localLength:  10,   // 0712345678 — 10 digits with 0
    localDigits:  9,    // 712345678  — 9 digits without 0
    placeholder:  '0712 345 678',
    example:      '0712345678',
  },
  {
    country:      'Liberia',
    code:         'LR',
    dial:         '231',
    flag:         '🇱🇷',
    localLength:  9,    // 881234567 — no leading 0
    localDigits:  9,
    placeholder:  '881 234 567',
    example:      '881234567',
  },
  {
    country:      'Sudan',
    code:         'SD',
    dial:         '249',
    flag:         '🇸🇩',
    localLength:  10,   // 0912345678 — 10 digits with 0
    localDigits:  9,    // 912345678  — 9 digits without 0
    placeholder:  '0912 345 678',
    example:      '0912345678',
  },
];



// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Converts an E.164 value (+2348149376175) back to local display format (08149376175).
 * Used to populate the input when a value already exists.
 */
const toLocalDisplay = (e164Value, dial) => {
  if (!e164Value) return '';
  const prefix = `+${dial.dial}`;
  if (e164Value.startsWith(prefix)) {
    const subscriber = e164Value.slice(prefix.length); // e.g. "8149376175"
    // Re-add leading 0 if this country uses one locally
    const needsLeadingZero = dial.localLength > dial.localDigits;
    return needsLeadingZero ? `0${subscriber}` : subscriber;
  }
  // Already in local format or unknown — return as-is stripped of non-digits
  return e164Value.replace(/\D/g, '');
};

/**
 * Converts local input (08149376175) to E.164 (+2348149376175).
 * Strips leading 0 for countries that use one.
 */
const toE164 = (localInput, dial) => {
  const digits = localInput.replace(/\D/g, '');
  const needsLeadingZero = dial.localLength > dial.localDigits;
  // Strip leading 0 if present and country uses one
  const subscriber = needsLeadingZero && digits.startsWith('0')
    ? digits.slice(1)
    : digits;
  if (!subscriber) return '';
  return `+${dial.dial}${subscriber}`;
};

// ── Component ──────────────────────────────────────────────────────────────────

const PhoneInput = ({ value, onChange, onBlur, error, disabled, defaultDial }) => {
  const [dialOverride, setDialOverride] = useState(null);
  const activeDial = dialOverride ?? defaultDial ?? DIAL_CODES[0];

  // Display value — convert stored E.164 back to local format for the input
  const displayValue = toLocalDisplay(value, activeDial);

  const handleDialChange = (e) => {
    const entry = DIAL_CODES.find((d) => d.dial === e.target.value) ?? DIAL_CODES[0];
    setDialOverride(entry);
    // Reset the number when country changes — avoids invalid cross-country numbers
    onChange('');
  };

  const handleLocalChange = (e) => {
    const raw = e.target.value;
    // Only allow digits and a single leading 0
    const digitsOnly = raw.replace(/\D/g, '');
    // Cap at the local length for this country
    const capped = digitsOnly.slice(0, activeDial.localLength);
    // Convert to E.164 and pass up
    onChange(toE164(capped, activeDial));
  };

  // Progress indicator
  const filledDigits = displayValue.replace(/\D/g, '').length;
  const isComplete   = filledDigits === activeDial.localLength;
  const isStarted    = filledDigits > 0;

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex justify-between items-center pl-1">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Phone Number
        </label>
        <span className={`text-[10px] font-mono font-semibold transition-colors
          ${isComplete ? 'text-mealink-green' : isStarted ? 'text-amber-500' : 'text-gray-400'}`}>
          {filledDigits}/{activeDial.localLength}
        </span>
      </div>

      {/* Input row */}
      <div className={`flex items-stretch border rounded-xl overflow-hidden transition-all duration-200
        ${error
          ? 'border-red-300 focus-within:ring-4 focus-within:ring-red-500/10'
          : isComplete
          ? 'border-mealink-green focus-within:ring-4 focus-within:ring-mealink-green/10'
          : 'border-gray-200 focus-within:ring-4 focus-within:ring-mealink-orange/10 focus-within:border-mealink-orange'}
        ${disabled ? 'opacity-50 bg-gray-100' : 'bg-gray-50/50 focus-within:bg-white'}`}
      >
        {/* Country code selector */}
        <div className="relative flex-shrink-0 border-r border-gray-200 bg-transparent">
          <select
            value={activeDial.dial}
            onChange={handleDialChange}
            disabled={disabled}
            aria-label="Country dial code"
            className="h-full appearance-none bg-transparent pl-3 pr-7 py-3 text-sm text-gray-700 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
          >
            {DIAL_CODES.map((d) => (
              <option key={d.code} value={d.dial}>
                {d.flag} +{d.dial}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Number input */}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleLocalChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={activeDial.placeholder}
          className="flex-1 px-4 py-3 text-sm text-gray-800 bg-transparent focus:outline-none disabled:cursor-not-allowed placeholder:text-gray-400 font-mono tracking-wide"
        />
      </div>

      {/* Live preview — shows exactly what gets sent to backend */}
      {isStarted && (
        <p className="text-[11px] pl-1 transition-colors">
          {isComplete ? (
            <span className="text-mealink-green font-semibold">
              ✓ Will be sent as: <span className="font-mono">{value}</span>
            </span>
          ) : (
            <span className="text-gray-400">
              Will be sent as:{' '}
              <span className="font-mono text-gray-600">{toE164(displayValue, activeDial)}</span>
              {' '}— keep typing ({activeDial.localLength - filledDigits} digits left)
            </span>
          )}
        </p>
      )}

      {/* Format hint */}
      {!isStarted && (
        <p className="text-[11px] text-gray-400 pl-1">
          Enter your local number including the leading 0 — e.g.{' '}
          <span className="font-mono">{activeDial.example}</span>
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium pl-1">{error.message}</p>
      )}
    </div>
  );
};

export default PhoneInput;
