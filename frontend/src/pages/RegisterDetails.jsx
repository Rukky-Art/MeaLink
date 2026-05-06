import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import FormInput from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../utils/validation';
import { registerUser } from '../store/slices/authSlice';

const RegisterDetails = () => {
const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: "onBlur"
  });
  const isDonor = role === 'donor';

const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);

    const payload = {
      email: data.email,
      name: data.businessName, 
      phone_number: data.phone, 
      role: role, 
      organisation_type: isDonor ? "restaurant" : "ngo",
      address: data.location, 
      city: data.city || "Lagos",
      country: data.country || "Nigeria",
      password: data.password,
    };

   try {
    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      navigate('/verification-pending');
      return;
    }

    if (registerUser.rejected.match(result)) {
      const apiErrors = result.payload;
      
      if (apiErrors && typeof apiErrors === 'object') {
        // Handle Field Errors (Specific to an input)
        if (apiErrors.email) {
          setError("email", { type: "manual", message: apiErrors.email[0] });
        }
        // Handle Global API Errors (e.g., "The server is under maintenance")
        if (apiErrors.non_field_errors || apiErrors.detail) {
          setGlobalError(apiErrors.non_field_errors?.[0] || apiErrors.detail);
        }
      } else {
        // Handle Infrastructure Errors
        if (result.error.message === "Network Error") {
          setGlobalError("Network connection lost. Please check your internet.");
        } else {
          setGlobalError("The server is currently unreachable. Please try again later.");
        }
      }
    }
  } catch (err) {
    setGlobalError("An unexpected error occurred. Please try again.", err);
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Global Error Message */}
{globalError && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
    <div className="bg-red-100 p-1 rounded-full">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <p className="text-sm font-medium">{globalError}</p>
  </div>
)}
      {/* Back Button */}
      <button 
        onClick={() => navigate('/register/select-role')}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isDonor ? 'Register as a Donor' : 'Register as a Partner'}
        </h2>
        <p className="text-gray-500">
          {isDonor 
            ? 'Share your surplus food with those who need it' 
            : 'Help distribute food to your local community'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Business Name"
          name="businessName"
          placeholder="e.g. Golden Bakery"
          register={register}
          error={errors.businessName}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@business.com"
          register={register}
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          name="phone"
          placeholder="+234 800 000 0000"
          register={register}
          error={errors.phone}
        />

        <FormInput
          label="Location"
          name="location"
          placeholder="City or address"
          register={register}
          error={errors.location}
        />
        <FormInput
          label="City"
          name="city"
          placeholder="City"
          register={register}
          error={errors.city}
        />
        <FormInput
          label="Country"
          name="country"
          placeholder="Country"
          register={register}
          error={errors.country}
        />

        <div className="relative">
          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            register={register}
            error={errors.password}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px] text-gray-400 hover:text-brand-green"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            register={register}
            error={errors.showConfirmPassword}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-[38px] text-gray-400 hover:text-brand-green"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-green font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterDetails;