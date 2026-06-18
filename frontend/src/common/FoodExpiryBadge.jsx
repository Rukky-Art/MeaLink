import { useState, useEffect } from 'react';
import { formatTimeUntilExpiry } from "../utils/geoUtils";

const FoodExpiryBadge = ({ expiryTime }) => {
  // Initialize with the current remaining time
  const [timeLeftStr, setTimeLeftStr] = useState(() => formatTimeUntilExpiry(expiryTime));

  useEffect(() => {
    // Update the text every single minute
    const timer = setInterval(() => {
      setTimeLeftStr(formatTimeUntilExpiry(expiryTime));
    }, 60000); // 60,000 milliseconds = 1 minute

    // Cleanup the timer when the component unmounts to prevent memory leaks
    return () => clearInterval(timer);
  }, [expiryTime]);

  // Determine styling based on urgency
  const isUrgent = timeLeftStr.includes('minute') && !timeLeftStr.includes('day') && !timeLeftStr.includes('hr');
  const isExpired = timeLeftStr === 'Expired';

  let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200"; // Safe default
  if (isUrgent) badgeColor = "bg-amber-50 text-amber-700 border-amber-300 animate-pulse";
  if (isExpired) badgeColor = "bg-rose-50 text-rose-600 border-rose-200 line-through";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
      ⏰ {timeLeftStr}
    </div>
  );
};

export default FoodExpiryBadge;