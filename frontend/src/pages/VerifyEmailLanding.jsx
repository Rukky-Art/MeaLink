import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { verifyEmailToken } from '../store/slices/authSlice'; 

const VerifyEmailLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        return;
      }

      // Dispatch the Redux action instead of standard fetch
      const resultAction = await dispatch(verifyEmailToken(token));

      if (verifyEmailToken.fulfilled.match(resultAction)) {
        setStatus('success');
        
        // Wait a brief moment for the user to read the success text before redirection
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      } else {
        setStatus('error');
      }
    };

    verifyToken();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-mealink-orange animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">Authenticating Workspace Link</h2>
            <p className="text-sm text-gray-500">Validating credentials and initializing secure networks...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-mealink-green mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Email Verified Successfully!</h2>
            <p className="text-sm text-gray-500">Workspace authorized. Preparing your logistics control deck...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Verification Link Expired</h2>
            <p className="text-sm text-gray-500">The token provided is invalid or has timed out for safety criteria.</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-2 text-xs font-bold text-mealink-darkgreen hover:underline"
            >
              Request a new verification link via sign-in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailLanding;