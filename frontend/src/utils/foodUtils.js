/**
 * foodUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared food-related utilities used across slices, selectors, and components.
 * Import from here — never duplicate these in components or slices.
 *
 * Usage:
 *   import { isExpired, getDeadline, formatWindow, timeAgo, displayDistance } from '../../utils/foodUtils';
 */

// ── Expiry ────────────────────────────────────────────────────────────────────

/**
 * Returns the earliest deadline timestamp (ms) from a food listing.
 * Uses whichever of expiry_time or pickup_end_time comes first.
 * A listing is "closed" when either has passed.
 *
 * @param {object} food
 * @returns {number|null} Unix timestamp in ms, or null if neither field exists
 */
export const getDeadline = (food) => {
  const candidates = [food?.expiry_time, food?.pickup_end_time]
    .filter(Boolean)
    .map(t => new Date(t).getTime())
    .filter(t => !isNaN(t));
  return candidates.length ? Math.min(...candidates) : null;
};

/**
 * Returns true if a food listing has passed its earliest deadline.
 * Checks both expiry_time AND pickup_end_time — whichever comes first.
 *
 * @param {object} food
 * @returns {boolean}
 */
export const isExpired = (food) => {
  const deadline = getDeadline(food);
  return deadline !== null ? deadline < Date.now() : false;
};

/**
 * Returns true if food is expiring within the next N milliseconds.
 * Default: 6 hours (21_600_000 ms)
 *
 * @param {object} food
 * @param {number} withinMs
 * @returns {boolean}
 */
export const isExpiringSoon = (food, withinMs = 21_600_000) => {
  const deadline = getDeadline(food);
  if (!deadline) return false;
  const remaining = deadline - Date.now();
  return remaining > 0 && remaining < withinMs;
};

/**
 * Returns remaining milliseconds until the listing's deadline.
 * Returns 0 if already expired, null if no deadline exists.
 *
 * @param {object} food
 * @returns {number|null}
 */
export const getRemainingMs = (food) => {
  const deadline = getDeadline(food);
  if (deadline === null) return null;
  return Math.max(0, deadline - Date.now());
};

/**
 * Parses remaining time into { days, hours, mins, secs, totalSeconds, isExpired }.
 * Used by the Countdown component.
 *
 * @param {object} food
 * @returns {object|null}
 */
export const parseCountdown = (food) => {
  const deadline = getDeadline(food);
  if (deadline === null) return null;
  const diff = deadline - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0, totalSeconds: 0, isExpired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days:         Math.floor(totalSeconds / 86400),
    hours:        Math.floor((totalSeconds % 86400) / 3600),
    mins:         Math.floor((totalSeconds % 3600) / 60),
    secs:         totalSeconds % 60,
    totalSeconds,
    isExpired:    false,
  };
};

// ── Status ────────────────────────────────────────────────────────────────────

/**
 * Returns a normalised status string for a food listing.
 * Combines is_claimed, expiry state, and optional claim ownership.
 *
 * @param {object} food
 * @param {boolean} isClaimedByMe
 * @returns {'available'|'expiring_soon'|'expired'|'claimed_by_me'|'claimed'}
 */
export const getFoodStatus = (food, isClaimedByMe = false) => {
  if (isClaimedByMe)     return 'claimed_by_me';
  if (isExpired(food))   return 'expired';
  if (food?.is_claimed)  return 'claimed';
  if (isExpiringSoon(food)) return 'expiring_soon';
  return 'available';
};

// ── Time formatting ───────────────────────────────────────────────────────────

/**
 * Formats a pickup window as a human-readable string.
 * e.g. "Thu 12 Jun, 1:43 PM → Fri 13 Jun, 5:43 PM"
 *
 * @param {string} start ISO string
 * @param {string} end   ISO string
 * @returns {string}
 */
export const formatWindow = (start, end) => {
  if (!start || !end) return '—';
  const opts = {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: 'numeric', minute: '2-digit', hour12: true,
  };
  return (
    `${new Date(start).toLocaleString('en-NG', opts)}` +
    ` → ` +
    `${new Date(end).toLocaleString('en-NG', opts)}`
  );
};

/**
 * Formats a single datetime with full context.
 * e.g. "Thu 12 Jun 2026, 1:43 PM"
 *
 * @param {string} isoString
 * @returns {string}
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-NG', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

/**
 * Returns a relative "time ago" string.
 * e.g. "Just now", "3 mins ago", "2 hrs ago", "5 days ago"
 *
 * @param {string} isoString
 * @returns {string}
 */
export const timeAgo = (isoString) => {
  if (!isoString) return '';
  const diff  = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins} min${mins > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// ── Distance ──────────────────────────────────────────────────────────────────

/**
 * Formats a distance_km value into a human-readable string.
 * Handles 0 as "nearby", sub-km as metres, and km with 1 decimal.
 * Returns null if distance is unknown (backend didn't send GPS).
 *
 * @param {number|null} km
 * @returns {string|null}
 */
export const displayDistance = (km) => {
  if (km === null || km === undefined) return null;
  if (km === 0 || km < 0.1)           return 'Less than 100m away';
  if (km < 1)                          return `${(km * 1000).toFixed(0)}m away`;
  return `${Number(km).toFixed(1)}km away`;
};

// ── Capacity estimate ─────────────────────────────────────────────────────────

/**
 * Estimates how many people a listing can feed.
 * Multiplier: 1.2 (conservative estimate per portion/kg/item).
 * Adjust multiplier per unit if you have that data later.
 *
 * @param {object} food
 * @returns {number}
 */
export const estimatePeopleServed = (food) => {
  if (!food?.quantity_estimated) return 0;
  return Math.ceil(Number(food.quantity_estimated) * 1.2);
};
