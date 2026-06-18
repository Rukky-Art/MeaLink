import { useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { ArrowLeft, ChevronDown, UploadCloud, ShieldCheck, CheckCircle2, Info, Eye, EyeOff } from 'lucide-react';
import FormInput from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../utils/validation';
import { registerUser } from '../store/slices/authSlice';
import logo1 from '../assets/logo1.png';
import meal from '../assets/meal.png';
import PhoneInput from '../common/PhoneInput';
import { dialForCountry } from '../common/DialForCountry';

const FormSelect = ({ label, name, options, register, error, placeholder, disabled }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        {...register(name)}
        defaultValue=""
        disabled={disabled}
        className={`w-full appearance-none bg-gray-50/50 border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800
          focus:outline-none focus:ring-4 focus:bg-white transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-gray-300'}
          ${error ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-mealink-orange/10 focus:border-mealink-orange'}`}
      >
        <option value="" disabled>{placeholder || `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 font-medium pl-1">{error.message}</p>}
  </div>
);

const FileUploadDropzone = ({ label, description, registerName, register, error, disabled, control }) => {
  const watchedFile = useWatch({ control, name: registerName });
  const fileName = watchedFile && watchedFile[0] ? watchedFile[0].name : '';

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
        {label}
      </label>
      <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 text-center
        ${fileName ? 'border-mealink-green bg-mealink-lightorange/30' : 'border-gray-200 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-300'}
        ${disabled ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
      >
        <input
          type="file"
          accept=".pdf,image/*"
          {...register(registerName)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <UploadCloud size={24} className={fileName ? 'text-mealink-green' : 'text-gray-400'} />
          <p className="text-xs font-semibold text-gray-700">
            {fileName ? 'Document Uploaded' : 'Click to upload or drag'}
          </p>
          <p className="text-[11px] text-gray-400 max-w-[200px] truncate">
            {fileName ? fileName : description || 'PDF or images up to 5MB'}
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium pl-1">{error.message}</p>}
    </div>
  );
};




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
  { value: 'Food_Bank',              label: 'Food Bank'              },
  { value: 'ngo',                    label: 'NGO'                    },
  { value: 'Religious_Organization', label: 'Religious Organization' },
  { value: 'shelter',                label: 'Shelter'                },
  { value: 'Community_Coordinator',  label: 'Community Coordinator'  },
  { value: 'local_Volunteer_Group',  label: 'Local Volunteer Group'  },
  { value: 'other',                  label: 'Other'                  },
];

const COUNTRIES = [
  { value: 'Nigeria',  label: 'Nigeria'  },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Liberia',  label: 'Liberia'  },
  { value: 'Kenya',    label: 'Kenya'    },
  { value: 'Sudan',    label: 'Sudan'    },
];

const getRegionLabel = (country) => {
  switch (country?.toLowerCase().trim()) {
    case 'nigeria':
    case 'sudan':
      return 'State';
    case 'cameroon':
      return 'Region';
    case 'kenya':
    case 'liberia':
      return 'County';
    default:
      return 'State / Region';
  }
};

const RegisterDetails = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep]               = useState(1);
  const [isLoading, setIsLoading]     = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const isDonor = role === 'donor';

  const countryValue = useWatch({ control, name: 'country', defaultValue: '' });
  const currentDial  = dialForCountry(countryValue);

  const handleNextStep = async () => {
    const isStage1Valid = await trigger([
      'name',
      'businessName',
      'businessEmail',
      'password',
      'confirmPassword',
      'businessType',
      'registrationNumber',
      'cacCertificate',
      isDonor ? 'healthLicense' : 'certificate'
    ]);

    if (isStage1Valid) {
      setGlobalError(null);
      setStep(2);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);
    const certificateFile = isDonor
      ? data.healthLicense?.[0]
      : data.certificate?.[0];

    const certificateFieldName = isDonor
      ? 'food_safety_certificate'
      : 'ngo_certificate';
if (isDonor && !data.healthLicense?.length) {
  setError("healthLicense", {
    type: "manual",
    message: "Food Safety Permit is required",
  });
  return;
}

if (!isDonor && !data.certificate?.length) {
  setError("certificate", {
    type: "manual",
    message: "NGO Certificate is required",
  });
  return;
}
    const payload = {
      email:                          data.businessEmail?.trim().toLowerCase(),
      password:                       data.password,
      business_name:                  data.businessName?.trim(),
      phone_number:                   data.phone || '',
      role,
      organisation_type:              data.businessType?.trim().toLowerCase(),
      business_registration_number:   data.registrationNumber?.trim().toUpperCase(),
      address:                        data.pickupAddress?.trim() || '',
      city:                           data.city?.trim() || '',
      state_or_region:                data.stateOrRegion?.trim() || '',
      country:                        data.country?.trim() || '',
      name:                           data.name?.trim() || '',
      cac_certificate:                data.cacCertificate?.[0],
      [certificateFieldName]:         certificateFile,
    };


    try {
      // registerUser thunk converts this object to FormData and sends
      // multipart/form-data automatically — see authSlice.js
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
            email:                         'businessEmail',
            password:                      'password',
            business_name:                 'businessName',
            name:                          'name',
            phone_number:                  'phone',
            organisation_type:             'businessType',
            business_registration_number:  'registrationNumber',
            address:                       'pickupAddress',
            city:                          'city',
            state_or_region:               'stateOrRegion',
            country:                       'country',
            food_safety_certificate:       'healthLicense',
            ngo_certificate:                'certificate',
            cac_certificate:                'cacCertificate',
          };

          Object.entries(fieldMap).forEach(([apiKey, formKey]) => {
            if (apiErrors[apiKey]) {
              const msg = Array.isArray(apiErrors[apiKey]) ? apiErrors[apiKey][0] : apiErrors[apiKey];
              setError(formKey, { type: 'manual', message: msg });
              hasFieldError = true;
              

              if ([
                'businessName',
                'businessEmail',
                'password',
                'confirmPassword',
                'businessType',
                'registrationNumber',
                'name',
                'cacCertificate',
                'healthLicense',
                'certificate',
              ].includes(formKey)) {
                setStep(1);
              }
            }
          });

          if (apiErrors.non_field_errors || apiErrors.detail) {
            setGlobalError(Array.isArray(apiErrors.non_field_errors) ? apiErrors.non_field_errors[0] : apiErrors.detail);
          } else if (!hasFieldError) {
            setGlobalError('Registration failed. Please review your details and try again.');
          }
        } else {
          setGlobalError(result.error?.message === 'Network Error' ? 'Network connection lost.' : 'Server unreachable.');
        }
      }
    } catch {
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-stretch overflow-hidden font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-mealink-darkgreen to-[#175A34] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10">
          <div className=" flex items-center justify-center mb-16">
            <img src={logo1} alt="MeaLink Logo" className="w-24 h-24 rounded-xl bg-white shadow-lg " />
          </div>
          <div>
            <img src={meal} alt="Meal Image" className="w-full h-auto mt-12 rounded-xl shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md max-w-xs">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 1 ? 'bg-mealink-orange text-white ring-4 ring-mealink-orange/20' : 'bg-mealink-green text-white'}`}>
              {step > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Step 1</p>
              <p className="text-sm font-semibold text-white">Business Verification</p>
            </div>
          </div>
          <div className="w-px h-6 bg-white/20 ml-4" />
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 2 ? 'bg-mealink-orange text-white ring-4 ring-mealink-orange/20' : 'bg-white/10 text-white/40'}`}>
              2
            </div>
            <div>
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Step 2</p>
              <p className={`text-sm font-semibold ${step === 2 ? 'text-white' : 'text-white/40'}`}>Operational Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form Handling ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between bg-white px-6 py-10 sm:px-12 lg:px-16">
        <div className="max-w-xl w-full mx-auto my-auto">

          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => (step === 2 ? setStep(1) : navigate('/register/select-role'))}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-mealink-darkgreen transition-colors disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              <span>Back {step === 2 ? 'to Business Info' : 'to Roles'}</span>
            </button>
            <span className="text-xs font-semibold text-gray-400">
              {step === 1 ? 'Page 1 of 2' : 'Page 2 of 2'}
            </span>
          </div>

          {globalError && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-xl mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{globalError}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {isDonor ? 'Register as a Food Donor' : 'Register as a Partner'}
            </h2>
            <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
              {step === 1
                ? 'Provide legal credentials and establish security passwords to setup your workspace framework.'
                : 'Configure logistics configurations and localized area assignments.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <fieldset disabled={isLoading} className="border-none p-0 m-0 min-w-0 space-y-5">

              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <FormInput
                    label="Full Name"
                    name="name"
                    placeholder="e.g. John Doe"
                    register={register}
                    error={errors.name}
                  />
                  <FormInput
                    label={isDonor ? 'Business Name' : 'Organisation Name'}
                    name="businessName"
                    placeholder={isDonor ? 'Golden Crust Bakery' : 'Food Bank Network'}
                    register={register}
                    error={errors.businessName}
                  />

                  <FormInput
                    label={isDonor ? 'Business Email' : 'Organisation Email'}
                    name="businessEmail"
                    type="email"
                    placeholder="logistics@yourcompany.com"
                    register={register}
                    error={errors.businessEmail}
                  />

                  <FormSelect
                    label={isDonor ? 'Business Type' : 'Organisation Type'}
                    name="businessType"
                    options={isDonor ? DONOR_TYPES : PARTNER_TYPES}
                    placeholder="Select identification category"
                    register={register}
                    error={errors.businessType}
                  />

                  <FormInput
                    label="CAC / Registration Number"
                    name="registrationNumber"
                    placeholder="e.g. RC / IT Registration Code Number"
                    register={register}
                    error={errors.registrationNumber}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <FileUploadDropzone
                      label={isDonor ? "CAC Certificate" : "CAC/NGO/Charity Registration Certificate"}
                      description="Upload incorporation document PDF"
                      registerName="cacCertificate"
                      register={register}
                      error={errors.cacCertificate}
                      control={control}
                    />

                    {isDonor ? (
                      <FileUploadDropzone
                        label="Food Safety Permit / License"
                        description="Upload public health safety clearance"
                        registerName="healthLicense"
                        register={register}
                        error={errors.healthLicense}
                        control={control}
                      />
                    ) : (
                      <FileUploadDropzone
                        label="Office Address Proof"
                        description="Upload official non-profit declaration"
                        registerName="certificate"
                        register={register}
                        error={errors.certificate}
                        control={control}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register('password')}
                          className={`w-full bg-gray-50/50 border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-4 focus:bg-white transition-all duration-200
                            ${errors.password ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-mealink-orange/10 focus:border-mealink-orange'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register('confirmPassword')}
                          className={`w-full bg-gray-50/50 border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-4 focus:bg-white transition-all duration-200
                            ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-mealink-orange/10 focus:border-mealink-orange'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-mealink-orange text-white font-bold py-3.5 rounded-xl hover:bg-opacity-95 shadow-lg transition-all mt-4"
                  >
                    Continue to Location Configuration
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      label="Country"
                      name="country"
                      options={COUNTRIES}
                      placeholder="Select operating base"
                      register={register}
                      error={errors.country}
                    />

                    <FormInput
                      label={getRegionLabel(countryValue)}
                      name="stateOrRegion"
                      placeholder={`Enter corporate administrative ${getRegionLabel(countryValue).toLowerCase()}`}
                      register={register}
                      error={errors.stateOrRegion}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="City"
                      name="city"
                      placeholder="e.g. Ikeja"
                      register={register}
                      error={errors.city}
                    />

                    <Controller
                      name="phone"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={errors.phone}
                          defaultDial={currentDial}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-mealink-orange/5 border border-mealink-orange/20 rounded-xl p-3.5 flex gap-3 text-xs text-mealink-darkgreen leading-relaxed">
                      <Info size={18} className="text-mealink-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5 text-gray-900">Default Fulfillment Location Node</span>
                        This address serves as the automatic default pickup target for every surplus listing you release to operations. You can fine-tune individual delivery points on a per-listing baseline later.
                      </div>
                    </div>

                    <FormInput
                      label="PickUp Address"
                      name="pickupAddress"
                      placeholder="Street address, building name, floor level details"
                      register={register}
                      error={errors.pickupAddress}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        {...register('agreeToTerms')}
                        className="mt-1 rounded border-gray-300 text-mealink-darkgreen focus:ring-mealink-orange/40 h-4 w-4 accent-mealink-darkgreen"
                      />
                      <span className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
                        I explicitly agree to the structural{' '}
                        <Link to="/terms" className="text-mealink-darkgreen font-bold hover:underline">Terms of Operations</Link>
                        {' '}and data tracking authorization{' '}
                        <Link to="/privacy" className="text-mealink-darkgreen font-bold hover:underline">Privacy Policy profiles</Link>.
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium pl-1">{errors.agreeToTerms.message}</p>
                    )}
                  </div>

                 <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-mealink-darkgreen text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-6 flex items-center justify-center gap-2.5
                      hover:bg-opacity-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-opacity-100"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Verifying Profile Parameters...</span>
                      </>
                    ) : (
                      'Submit Verification Profiles'
                    )}
                  </button>
                </div>
              )}

            </fieldset>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already managing active food listings?{' '}
          <Link to="/login" className="text-mealink-darkgreen font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  );
};

export default RegisterDetails;
