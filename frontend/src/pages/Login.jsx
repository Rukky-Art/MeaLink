// import { useForm } from 'react-hook-form';
// import { Link } from 'react-router';
// import FormInput from '../components/FormInput'
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '../utils/validation';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, fetchUserProfile } from '../store/slices/authSlice';
// import { useNavigate } from 'react-router';


// const Login = () => {


//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const authState = useSelector((state) => state.auth);
//   const { isLoading, error } = authState; 
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema),
//     mode: "onTouched" 
//   });

// const onSubmit = async (data) => {
//   const sanitizedData = {
//     email: data.email.trim().toLowerCase(),
//     password: data.password // Don't trim passwords! Spaces can be intentional there.
//   };
//   const result = await dispatch(loginUser(sanitizedData));
//   if (loginUser.fulfilled.match(result)) {
//     await dispatch(fetchUserProfile());
//     navigate('/dashboard');
//   }
// };

//   return (
//     <div className="animate-in fade-in duration-500">
//       {error && <p className="text-red-500 text-sm mb-4">{error.detail || "Login failed"}</p>}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
//         <p className="text-gray-500">Sign in to your MeaLink account</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <FormInput
//           label="Email"
//           name="email"
//           type="email"
//           placeholder="you@example.com"
//           register={register}
//           error={errors.email}
//         />

//         <FormInput
//           label="Password"
//           name="password"
//           type="password"
//           placeholder="••••••••"
//           register={register}
//           error={errors.password}
//         />

//         <button
//           type="submit"
//           className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20"
//           disabled={isLoading}
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       <div className="mt-8 text-center space-y-4">
//         <p className="text-gray-600 text-sm">
//           Don't have an account?{' '}
//           <Link to="/register/select-role" className="text-brand-green font-bold hover:underline">
//             Sign up
//           </Link>
//         </p>
        
//         <Link to="/forgot-password" size="sm" className="block text-gray-500 text-sm hover:text-brand-green transition-colors">
//           Forgot password?
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange', // clears errors immediately as user fixes them
  });

  const onSubmit = async (data) => {
    const sanitizedData = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    const result = await dispatch(loginUser(sanitizedData));

    if (loginUser.fulfilled.match(result)) {
      // ─────────────────────────────────────────────────────────────────────
      // Navigate IMMEDIATELY based on role from the login response payload,
      // then fetch the full profile in the background. The user lands on their
      // dashboard right away — no waiting for the profile round-trip.
      //
      // result.payload is whatever your loginUser thunk resolves with (the API
      // response). Adjust the role field name to match your actual API shape.
      // ─────────────────────────────────────────────────────────────────────
      const role = result.payload?.role || result.payload?.user?.role;

      // Navigate instantly — don't await profile fetch
      if (role === 'donor') {
        navigate('/dashboard/donor');
      } else if (role === 'partner') {
        navigate('/dashboard/partner');
      } else {
        navigate('/dashboard'); // fallback if role is unknown
      }

      // Fire profile fetch in background — store gets updated silently
      dispatch(fetchUserProfile());
    }
  };

  return (
    <div className="animate-in fade-in duration-500">

      {/* Backend error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-100 p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium">
            {error.detail || error.non_field_errors?.[0] || 'Login failed. Please try again.'}
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500">Sign in to your MeaLink account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/*
          fieldset disabled= is the semantic, one-shot way to lock every
          input, select, and button inside the form during submission.
          No prop-drilling needed — the browser handles it natively.
        */}
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

          <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.password}
            />
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
