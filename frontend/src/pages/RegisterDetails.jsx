import { useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff} from 'lucide-react';
import FormInput from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../utils/validation';
import { registerUser } from '../store/slices/authSlice';

// Tiny sub-component for password requirement list
const RequirementItem = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs transition-colors duration-200">
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-500' : 'bg-gray-300'}`} />
    <span className={met ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
      {text}
    </span>
  </div>
);

const RegisterDetails = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Multi-step & UI States
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const { 
    register, 
    handleSubmit, 
    setError,
    trigger,
    control, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: "onBlur"
  });

  const isDonor = role === 'donor';

  // Real-time values watching
const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const countryValue = useWatch({ control, name: "country", defaultValue: "" });

  // Password Requirement Calculation
  const passwordRequirements = {
    hasMinLength: passwordValue.length >= 8,
    hasUppercase: /[A-Z]/.test(passwordValue),
    hasLowercase: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    hasSpecialChar: /[^A-Za-z0-9]/.test(passwordValue),
  };

  // Country dynamic placeholder dictionary
  const getRegPlaceholder = (country) => {
    switch (country?.toLowerCase().trim()) {
      case 'nigeria': return "e.g. RC123456 or IT78910";
      case 'south africa': return "e.g. 2021/123456/07";
      case 'kenya': return "e.g. PVT-L7U9X2";
      case 'ghana': return "e.g. TIN-123456789";
      default: return "e.g. RC / IT / BN Number";
    }
  };

  // Wizard Stage Validation Check
  const handleNextStep = async () => {
    // Only validate fields on step 1 before proceeding
    const isStep1Valid = await trigger(["fullName", "email", "password", "confirmPassword"]);
    if (isStep1Valid) {
      setGlobalError(null);
      setStep(2);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);

   const payload = {
    email: data.email.trim().toLowerCase(), 
    name: data.businessName.trim(), 
    phone_number: data.phone.trim(), 
    role: role, 
    organisation_type: data.businessType.trim().toLowerCase(), 
    business_registration_number: data.registrationNumber.trim().toUpperCase(), 
    address: data.city.trim(), 
    city: data.city.trim(),
    country: data.country.trim(),
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
          if (apiErrors.email) {
            setError("email", { type: "manual", message: apiErrors.email[0] });
            setStep(1); // Drop back down to error card context
          }
          if (apiErrors.non_field_errors || apiErrors.detail) {
            setGlobalError(apiErrors.non_field_errors?.[0] || apiErrors.detail);
          }
        } else {
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

      {/* Back Routing / Step Degrader */}
      <button 
        onClick={() => step === 2 ? setStep(1) : navigate('/register/select-role')}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back {step === 2 && 'to Step 1'}</span>
      </button>

      {/* Top Wizard Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${step === 1 ? 'bg-brand-mint text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
            Step 1: Credentials
          </span>
          <div className="h-px bg-gray-200 w-8" />
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${step === 2 ? 'bg-brand-mint text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
            Step 2: Verification
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isDonor ? 'Register as a Donor' : 'Register as a Partner'}
        </h2>
        <p className="text-gray-500 text-sm">
          {step === 1 
            ? 'Set up your system entry profile identity details.' 
            : 'Provide verification elements for safety compliance checks.'}
        </p>
      </div>

      {/* Main Multi-Stage Wrapper Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* ================= STEP 1 SCREEN ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <FormInput
              label="Contact Person Name"
              name="fullName"
              placeholder="Full Name"
              register={register}
              error={errors.fullName}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@business.com"
              register={register}
              error={errors.email}
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

            {/* LIVE CHECKLIST UI ELEMENT */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Complexity Rules:</p>
              <RequirementItem met={passwordRequirements.hasMinLength} text="Minimum 8 characters length" />
              <RequirementItem met={passwordRequirements.hasUppercase} text="At least one uppercase character (A-Z)" />
              <RequirementItem met={passwordRequirements.hasLowercase} text="At least one lowercase character (a-z)" />
              <RequirementItem met={passwordRequirements.hasNumber} text="At least one baseline integer (0-9)" />
              <RequirementItem met={passwordRequirements.hasSpecialChar} text="At least one standard symbol structural mark" />
            </div>

            <div className="relative">
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                register={register}
                error={errors.confirmPassword}
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
              type="button"
              onClick={handleNextStep}
              className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all mt-4"
            >
              Continue to Step 2
            </button>
          </div>
        )}

        {/* ================= STEP 2 SCREEN ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            
              <FormInput
                label={isDonor ? "Business Name" : "Organisation Name"}
                name="businessName"
                placeholder={isDonor ? "Golden Bakery" : "Red Cross Nigeria"}
                register={register}
                error={errors.businessName}
              />
              <FormInput
                label={isDonor ? "Business Type" : "Organisation Type"}
                name="businessType"
                placeholder={isDonor ? "e.g. Restaurant, Bakery" : "e.g. Food Bank, Shelter"}
                register={register}
                error={errors.businessType}
              />
            

            
              <FormInput
                label="Country"
                name="country"
                placeholder="e.g. Nigeria"
                register={register}
                error={errors.country}
              />
              <FormInput
                label="City/Area"
                name="city"
                placeholder="Lagos"
                register={register}
                error={errors.city}
              />
            

            
              <FormInput
                label="Phone Number"
                name="phone"
                placeholder="+234 800 000 0000"
                register={register}
                error={errors.phone}
              />
              <FormInput
                label="Government Issued Registration Number"
                name="registrationNumber"
                placeholder={getRegPlaceholder(countryValue)}
                register={register}
                error={errors.registrationNumber}
              />
            

            {/* Document Upload Option (NGO Check Only) */}
            {!isDonor && (
              <div className="p-4 bg-brand-mint/10 border border-brand-mint/30 rounded-xl">
                <label className="block text-xs font-bold text-brand-green uppercase tracking-wider mb-1.5">
                  Upload NGO Certificate (PDF/Image)
                </label>
                <input 
                  type="file" 
                  {...register("certificate")}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-green file:text-white hover:file:bg-opacity-80 transition-all cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-green font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterDetails;