import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import FormInput from '../components/FormInput'
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchUserProfile } from '../store/slices/authSlice';
import { useNavigate } from 'react-router';


const Login = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const { isLoading, error } = authState; 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched" // Validate on touch for better UX
  });

const onSubmit = async (data) => {
  const result = await dispatch(loginUser(data));
  if (loginUser.fulfilled.match(result)) {
    // Immediately fetch the profile now that we have a token
    await dispatch(fetchUserProfile());
    navigate('/dashboard');
  }
};

  return (
    <div className="animate-in fade-in duration-500">
      {error && <p className="text-red-500 text-sm mb-4">{error.detail || "Login failed"}</p>}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500">Sign in to your MeaLink account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          register={register}
          error={errors.password}
        />

        <button
          type="submit"
          className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register/select-role" className="text-brand-green font-bold hover:underline">
            Sign up
          </Link>
        </p>
        
        <Link to="/forgot-password" size="sm" className="block text-gray-500 text-sm hover:text-brand-green transition-colors">
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;