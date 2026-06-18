/**
 * Safely fetches the current device coordinates.
 * Returns an object with latitude and longitude, or null values if blocked/failed.
 */
export const getDeviceLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve({ latitude: null, longitude: null });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation fallback triggered:", error.message);
        // Fail gracefully so the app still fetches listings without crashing
        resolve({ latitude: null, longitude: null });
      },
      {
        timeout: 10000,           // Give up after 10 seconds
        maximumAge: 300000,       // Use location cached up to 5 minutes ago
        enableHighAccuracy: false // Battery-saving mode, fast lookup
      }
    );
  });
};

/**
 * Formats distance values into clean, user-friendly strings.
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) return null;
  
  if (distanceKm < 1) {
    return `${(distanceKm * 1000).toFixed(0)}m away`;
  }
  return `${Number(distanceKm).toFixed(1)}km away`;
};

export const formatTimeUntilExpiry = (expiryTimeStr) => {
  if (!expiryTimeStr) return 'No expiry date';

  const expiryDate = new Date(expiryTimeStr);
  const now = new Date();
  const timeDifference = expiryDate - now;

  // If the food has already expired
  if (timeDifference <= 0) {
    return 'Expired';
  }

  // Time calculations for days, hours, and minutes
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  // Build the string dynamically based on how much time is left
  const parts = [];
  
  if (days > 0) parts.push(`${days}day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours}hr${hours > 1 ? 's' : ''}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}minute${minutes > 1 ? 's' : ''}`);

  // Join them nicely: "2days 5hrs 20minutes" or "1hr 6minutes"
  return `Expires in ${parts.join(' ')}`;
};