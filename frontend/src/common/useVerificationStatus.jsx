import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/slices/authSlice';

export const useVerificationStatus = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const isVerified = user?.is_business_verified === true;
  const isRejected =
    user?.donor_detail?.rejection_reason != null ||
    user?.partner_detail?.rejection_reason != null;
  const isPending = !isVerified && !isRejected;

  // ← Auto-refresh profile every 30 seconds while pending
  // so when admin approves, the UI updates without sign out/in
  useEffect(() => {
    if (isVerified) return; // already verified — no need to poll
    
    // Fetch once immediately on mount in case it changed since last login
    dispatch(fetchUserProfile());

    // Then poll every 30 seconds while pending
    const interval = setInterval(() => {
      dispatch(fetchUserProfile());
    }, 30_000);

    return () => clearInterval(interval);
  }, [isVerified, dispatch]);

  return { isVerified, isPending, isRejected, user };
};