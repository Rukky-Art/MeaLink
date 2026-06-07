import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff, ChevronDown } from 'lucide-react';
import FormInput from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../utils/validation';
import { registerUser } from '../store/slices/authSlice';

// ── Sub-components ────────────────────────────────────────────────────────────

const RequirementItem = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs transition-colors duration-200">
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-500' : 'bg-gray-300'}`} />
    <span className={met ? 'text-emerald-600 font-medium' : 'text-gray-400'}>{text}</span>
  </div>
);

// FormSelect respects the disabled state passed down during submission
const FormSelect = ({ label, name, options, register, error, placeholder, disabled }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        {...register(name)}
        defaultValue=""
        disabled={disabled}
        className={`w-full appearance-none bg-white border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 
          focus:outline-none focus:ring-2 transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          ${error
            ? 'border-red-300 focus:ring-red-200'
            : 'border-gray-200 focus:ring-brand-green/20 focus:border-brand-green'
          }`}
      >
        <option value="" disabled>{placeholder || `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 font-medium">{error.message}</p>}
  </div>
);

// ── Static data ───────────────────────────────────────────────────────────────

const DONOR_TYPES = [
  { value: 'restaurant',   label: 'Restaurant'   },
  { value: 'bakery',       label: 'Bakery'       },
  { value: 'hotel',        label: 'Hotel'        },
  { value: 'catering',     label: 'Catering'     },
  { value: 'supermarket',  label: 'Supermarket'  },
  { value: 'event_center', label: 'Event Center' },
  { value: 'cafeteria',    label: 'Cafeteria'    },
  { value: 'other',        label: 'Other'        },
];

const PARTNER_TYPES = [
  { value: 'Food Bank',              label: 'Food Bank'              },
  { value: 'ngo',                    label: 'NGO'                    },
  { value: 'Religious Organization', label: 'Religious Organization' },
  { value: 'shelter',                label: 'Shelter'                },
  { value: 'Community Coordinator',  label: 'Community Coordinator'  },
  { value: 'local Volunteer Group',  label: 'Local Volunteer Group'  },
  { value: 'other',                  label: 'Other'                  },
];

const COUNTRIES = [
  { value: 'Nigeria',  label: 'Nigeria'  },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Liberia',    label: 'Liberia'    },
  { value: 'Kenya',    label: 'Kenya'    },
  { value: 'Sudan',    label: 'Sudan'    },
];

const getRegPlaceholder = (country) => {
  switch (country?.toLowerCase().trim()) {
    case 'nigeria':  return 'e.g. RC123456 or IT78910';
    case 'cameroon': return 'e.g. RC/XXX/YYYY';
    case 'kenya':    return 'e.g. PVT-L7U9X2';
    case 'liberia':    return 'e.g. COM-123456';
    case 'sudan':    return 'e.g. REG-123456';
    default:         return 'e.g. RC / IT / BN Number';
  }
};

// ── Main Component ────────────────────────────────────────────────────────────

const RegisterDetails = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep]                               = useState(1);
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading]                     = useState(false);
  const [globalError, setGlobalError]                 = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    control,
    formState: { errors},
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const isDonor = role === 'donor';

  const passwordValue        = useWatch({ control, name: 'password',        defaultValue: '' });
  const confirmPasswordValue = useWatch({ control, name: 'confirmPassword', defaultValue: '' });
  const countryValue         = useWatch({ control, name: 'country',         defaultValue: '' });

  // ── confirmPassword: real-time cross-field mismatch check ────────────────
  // We bypass Zod's .refine() entirely here because trigger() per-field never
  // runs the full object refinement. Instead we manage this error manually.
  // Only start showing the error once the user has typed something in the field.
  useEffect(() => {
    if (confirmPasswordValue.length === 0) return;

    if (confirmPasswordValue !== passwordValue) {
      setError('confirmPassword', {
        type: 'manual',
        message: "Passwords don't match",
      });
    } else {
      clearErrors('confirmPassword');
    }
  }, [passwordValue, confirmPasswordValue, setError, clearErrors]);

  const passwordRequirements = {
    hasMinLength:   passwordValue.length >= 8,
    hasUppercase:   /[A-Z]/.test(passwordValue),
    hasLowercase:   /[a-z]/.test(passwordValue),
    hasNumber:      /[0-9]/.test(passwordValue),
    hasSpecialChar: /[^A-Za-z0-9]/.test(passwordValue),
  };

  // ── Step 1 gate ───────────────────────────────────────────────────────────
  const handleNextStep = async () => {
    const isZodValid = await trigger(['fullName', 'email', 'password', 'confirmPassword']);

    // Hard guard: Zod refine() won't catch mismatch at trigger() level
    if (passwordValue !== confirmPasswordValue) {
      setError('confirmPassword', {
        type: 'manual',
        message: "Passwords don't match",
      });
      return;
    }

    if (isZodValid) {
      setGlobalError(null);
      setStep(2);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);

    const payload = {
      email:                        data.email.trim().toLowerCase(),
      name:                         data.businessName.trim(),
      phone_number:                 data.phone.replace(/\s+/g, ''),
      role:                         role,
      organisation_type:            data.businessType.trim().toLowerCase(),
      business_registration_number: data.registrationNumber.trim().toUpperCase(),
      address:                      data.city.trim(),
      city:                         data.city.trim(),
      country:                      data.country.trim(),
      password:                     data.password,
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
          let hasFieldError = false;

          const fieldMap = {
            email:                        'email',
            name:                         'businessName',
            phone_number:                 'phone',
            organisation_type:            'businessType',
            business_registration_number: 'registrationNumber',
            address:                      'city',
            city:                         'city',
            country:                      'country',
            password:                     'password',
          };

          Object.entries(fieldMap).forEach(([apiKey, formKey]) => {
            if (apiErrors[apiKey]) {
              const msg = Array.isArray(apiErrors[apiKey])
                ? apiErrors[apiKey][0]
                : apiErrors[apiKey];
              setError(formKey, { type: 'manual', message: msg });
              hasFieldError = true;
              if (['email', 'password'].includes(formKey)) setStep(1);
            }
          });

          if (apiErrors.non_field_errors || apiErrors.detail) {
            setGlobalError(
              Array.isArray(apiErrors.non_field_errors)
                ? apiErrors.non_field_errors[0]
                : apiErrors.detail
            );
          } else if (!hasFieldError) {
            setGlobalError('Registration failed. Please review your details and try again.');
          }
        } else {
          setGlobalError(
            result.error?.message === 'Network Error'
              ? 'Network connection lost. Please check your internet.'
              : 'The server is currently unreachable. Please try again later.'
          );
        }
      }
    } catch {
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared disabled state — every input and button locks during submission ──
  // Pass this to FormInput via register options AND use it on buttons/selects.
  const fieldDisabled = isLoading;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">

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

      <button
        type="button"
        disabled={fieldDisabled}
        onClick={() => step === 2 ? setStep(1) : navigate('/register/select-role')}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back {step === 2 && 'to Step 1'}</span>
      </button>

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

      {/* fieldset is the semantic HTML element for grouping + bulk-disabling form fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={fieldDisabled} className="border-none p-0 m-0 min-w-0">

          {/* ═══════════════════ STEP 1 ═══════════════════ */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">

              {/* FormInput receives disabled via RHF's register — we wrap each
                  with a div that visually dims when loading. Using fieldset above
                  handles the actual disabled attribute on every native input inside. */}
              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label="Contact Person Name"
                  name="fullName"
                  placeholder="Full Name"
                  register={register}
                  error={errors.fullName}
                />
              </div>

              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@business.com"
                  register={register}
                  error={errors.email}
                />
              </div>

              <div className={`relative ${fieldDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  register={register}
                  error={errors.password}
                />
                <button
                  type="button"
                  tabIndex={fieldDisabled ? -1 : 0}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-brand-green"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Complexity Rules:</p>
                <RequirementItem met={passwordRequirements.hasMinLength}   text="Minimum 8 characters length" />
                <RequirementItem met={passwordRequirements.hasUppercase}   text="At least one uppercase character (A-Z)" />
                <RequirementItem met={passwordRequirements.hasLowercase}   text="At least one lowercase character (a-z)" />
                <RequirementItem met={passwordRequirements.hasNumber}      text="At least one baseline integer (0-9)" />
                <RequirementItem met={passwordRequirements.hasSpecialChar} text="At least one special symbol (@, #, $, etc.)" />
              </div>

              <div className={`relative ${fieldDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  register={register}
                  error={errors.confirmPassword}
                />
                <button
                  type="button"
                  tabIndex={fieldDisabled ? -1 : 0}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-brand-green"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={fieldDisabled}
                className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Step 2
              </button>
            </div>
          )}

          {/* ═══════════════════ STEP 2 ═══════════════════ */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">

              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label={isDonor ? 'Business Name' : 'Organisation Name'}
                  name="businessName"
                  placeholder={isDonor ? 'Golden Bakery' : 'Red Cross Nigeria'}
                  register={register}
                  error={errors.businessName}
                />
              </div>

              <FormSelect
                label={isDonor ? 'Business Type' : 'Organisation Type'}
                name="businessType"
                options={isDonor ? DONOR_TYPES : PARTNER_TYPES}
                placeholder={isDonor ? 'Select business type' : 'Select organisation type'}
                register={register}
                error={errors.businessType}
                disabled={fieldDisabled}
              />

              <FormSelect
                label="Country"
                name="country"
                options={COUNTRIES}
                placeholder="Select your country"
                register={register}
                error={errors.country}
                disabled={fieldDisabled}
              />

              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label="City / Area"
                  name="city"
                  placeholder="Lagos"
                  register={register}
                  error={errors.city}
                />
              </div>

              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  register={register}
                  error={errors.phone}
                />
              </div>

              <div className={fieldDisabled ? 'opacity-50 pointer-events-none' : ''}>
                <FormInput
                  label="Government Issued Registration Number"
                  name="registrationNumber"
                  placeholder={getRegPlaceholder(countryValue)}
                  register={register}
                  error={errors.registrationNumber}
                />
              </div>

              {!isDonor && (
                <div className={`p-4 bg-brand-mint/10 border border-brand-mint/30 rounded-xl ${fieldDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label className="block text-xs font-bold text-brand-green uppercase tracking-wider mb-1.5">
                    Upload NGO Certificate (PDF / Image)
                  </label>
                  <input
                    type="file"
                    {...register('certificate')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-green file:text-white hover:file:bg-opacity-80 transition-all cursor-pointer"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mt-4 relative overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* Inline spinner — no extra library needed */}
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          )}

        </fieldset>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-green font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterDetails;
