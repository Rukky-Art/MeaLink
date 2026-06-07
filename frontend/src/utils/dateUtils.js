// ── Shared date formatters ────────────────────────────────────────────────────
// Import these wherever you display dates so the format is consistent app-wide.

/**
 * Formats a date string as: "Monday, 2nd June 2026"
 * Used for deadlines, pickup times, claim dates across all pages.
 */
export const formatDeadline = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    const day       = d.getDate();
    const weekday   = d.toLocaleDateString('en-NG', { weekday: 'long' });
    const month     = d.toLocaleDateString('en-NG', { month: 'long' });
    const year      = d.getFullYear();
    const suffix    = getOrdinalSuffix(day);

    return `${weekday}, ${day}${suffix} ${month} ${year}`;
  } catch {
    return '—';
  }
};

/**
 * Formats a date string as: "Monday, 2nd June 2026 at 3:00 PM"
 * Used when both date and time are needed (pickup windows, claim times).
 */
export const formatDeadlineWithTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    const day     = d.getDate();
    const weekday = d.toLocaleDateString('en-NG', { weekday: 'long' });
    const month   = d.toLocaleDateString('en-NG', { month: 'long' });
    const year    = d.getFullYear();
    const suffix  = getOrdinalSuffix(day);
    const time    = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `${weekday}, ${day}${suffix} ${month} ${year} at ${time}`;
  } catch {
    return '—';
  }
};

/**
 * Formats just the time: "3:00 PM"
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '—';
  }
};

/**
 * Relative label — "Today 3:00 PM", "Yesterday", "3 days ago", or falls back to formatDeadline
 * Used in MyClaims pickup-by column.
 */
export const formatRelative = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d   = new Date(dateStr);
    const now = new Date();
    if (isNaN(d.getTime())) return '—';

    const diffDays = Math.floor((d - now) / (1000 * 60 * 60 * 24));

    if (diffDays === 0)  return `Today at ${formatTime(dateStr)}`;
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1)   return `${Math.abs(diffDays)} days ago`;

    return formatDeadline(dateStr);
  } catch {
    return '—';
  }
};

// ── Internal helper ───────────────────────────────────────────────────────────
const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:  return 'st';
    case 2:  return 'nd';
    case 3:  return 'rd';
    default: return 'th';
  }
};
