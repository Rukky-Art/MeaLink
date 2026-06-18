import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchUserProfile } from '../store/slices/authSlice';
import { useNavigate } from 'react-router';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword]   = useState(false);
  const [dismissedError, setDismissedError] = useState(null);

  const showBanner = Boolean(error) && error !== dismissedError;

  // Schedule auto-dismiss after 5 s whenever a new, un-dismissed error appears.
  // The effect body only calls setTimeout — a browser side-effect. setDismissedError
  // fires inside the timer callback (async), not synchronously in the effect body,
  // so there is no cascading-render lint violation.
  useEffect(() => {
    if (!showBanner) return;
    const timer = setTimeout(() => setDismissedError(error), 5000);
    return () => clearTimeout(timer);
  }, [showBanner, error]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data) => {
    // Dismiss any banner from the previous attempt before dispatching
    setDismissedError(error);

    const result = await dispatch(loginUser({
      email:    data.email.trim().toLowerCase(),
      password: data.password,
    }));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload?.role ?? result.payload?.user?.role;

      if (role === 'donor') {
        navigate('/dashboard/donor');
      } else if (role === 'partner') {
        navigate('/dashboard/partner');
      } else {
        navigate('/dashboard');
      }

      // Fire profile fetch in the background — store updates silently
      dispatch(fetchUserProfile());
    }
  };

  return (
    <div className="animate-in fade-in duration-500">

      {/* Auto-dismissing backend error banner */}
      {showBanner && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-100 p-1 rounded-full flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium flex-1">
            {error.detail ?? error.non_field_errors?.[0] ?? 'Login failed. Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => setDismissedError(error)}
            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500">Sign in to your MeaLink account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={isLoading} className="border-none p-0 m-0 min-w-0 space-y-4">

          <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              register={register}
              error={errors.email}
            />
          </div>

          <div className={`relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              register={register}
              error={errors.password}
            />
            <button
              type="button"
              tabIndex={isLoading ? -1 : 0}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-brand-green transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in...
              </span>
            ) : 'Login'}
          </button>

        </fieldset>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register/select-role" className="text-brand-green font-bold hover:underline">
            Sign up
          </Link>
        </p>
        <Link
          to="/forgot-password"
          className="block text-gray-500 text-sm hover:text-brand-green transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
