import { useSelector } from "react-redux";

export const useVerificationStatus = () => {
  const { user } = useSelector(s => s.auth);

  // ← was is_verified, backend field is is_business_verified
  const isVerified = user?.is_business_verified === true;

  const isRejected =
    user?.donor_detail?.rejection_reason != null ||
    user?.partner_detail?.rejection_reason != null;

  const isPending = !isVerified && !isRejected;

  return { isVerified, isPending, isRejected, user };
};