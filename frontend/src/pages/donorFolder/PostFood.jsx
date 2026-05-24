import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  ChevronLeft,
  Send,
  X,
  Camera,
  AlertCircle,
  Check,
  Clock,
  MapPin,
  Phone,
  User,
  Utensils,
  Package,
  Image,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';
import api from '../../auth/api';

const CATEGORIES = [
  { value: 'cooked', label: 'Cooked Meal', emoji: '🍲' },
  { value: 'raw', label: 'Raw Ingredients', emoji: '🥬' },
  { value: 'packaged', label: 'Packaged', emoji: '🥫' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

const UNITS = [
  { value: 'portions', label: 'Portions' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'packs', label: 'Packs' },
  { value: 'items', label: 'Items' },
  { value: 'liters', label: 'Liters' },
];

const STEPS = [
  { id: 1, label: 'Details', icon: Utensils },
  { id: 2, label: 'Logistics', icon: MapPin },
  { id: 3, label: 'Review', icon: Sparkles },
];

const FloatingInput = ({
  label,
  required,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`
        relative flex items-center bg-gray-50 rounded-2xl border-2 transition-all duration-300
        ${error ? 'border-red-300 bg-red-50/30' : focused ? 'border-brand-green/40 bg-white shadow-lg shadow-brand-green/5' : 'border-transparent hover:border-gray-200'}
      `}
      >
        {Icon && (
          <div className="pl-4">
            <Icon
              size={18}
              className={`transition-colors duration-300 ${
                error
                  ? 'text-red-400'
                  : focused
                    ? 'text-brand-green'
                    : 'text-gray-400'
              }`}
            />
          </div>
        )}
        <div className="relative flex-1">
          <label
            className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            ${
              focused || hasValue
                ? 'top-2 text-[10px] font-bold tracking-wider uppercase'
                : 'top-1/2 -translate-y-1/2 text-sm'
            }
            ${error ? 'text-red-400' : focused ? 'text-brand-green' : 'text-gray-400'}
          `}
          >
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          <input
            {...props}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full bg-transparent outline-none px-4 text-gray-900 font-medium
              ${focused || hasValue ? 'pt-6 pb-2' : 'py-4'}
              ${Icon ? '' : ''}
            `}
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs font-medium mt-1.5 ml-4 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

const PostFood = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [touched, setTouched] = useState({});

const [formData, setFormData] = useState(() => ({
  food_type: '',
  category: 'cooked',
  quantity_estimated: '',
  quantity_unit: 'portions',
  image_url: '',
  notes: '',
  pickup_address: '',
  pickup_city: '',
  pickup_start_time: '',
  pickup_end_time: '',
  contact_person_name: user?.name || '',
  contact_person_phone: '',
}));


  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };


  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateStep = (step) => {
    const errors = {};

    if (step >= 1) {
      if (!formData.food_type.trim())
        errors.food_type = 'Give your food a title';
      if (
        !formData.quantity_estimated ||
        parseInt(formData.quantity_estimated) <= 0
      )
        errors.quantity_estimated = 'Enter a valid quantity';
    }

    if (step >= 2) {
      if (!formData.pickup_city.trim())
        errors.pickup_city = 'City is required';
      if (!formData.pickup_address.trim())
        errors.pickup_address = 'Address is required';
      if (!formData.pickup_start_time)
        errors.pickup_start_time = 'Start time is required';
      if (!formData.pickup_end_time)
        errors.pickup_end_time = 'End time is required';
      if (
        formData.pickup_start_time &&
        formData.pickup_end_time &&
        new Date(formData.pickup_end_time) <=
          new Date(formData.pickup_start_time)
      ) {
        errors.pickup_end_time = 'End time must be after start time';
      }
      if (
        formData.pickup_start_time &&
        new Date(formData.pickup_start_time) < new Date()
      ) {
        errors.pickup_start_time = 'Start time cannot be in the past';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) processImage(file);
  };

  const processImage = async (file) => {
    if (!file.type.startsWith('image/')) {
      setGlobalError('Please select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setGlobalError('Image must be under 10MB.');
      return;
    }

    setGlobalError('');
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );
      if (!res.ok) throw new Error('Upload failed');
      const fileData = await res.json();
      updateField('image_url', fileData.secure_url);
    } catch {
      setGlobalError('Image upload failed. Please try again.');
      setImagePreview(null);
      updateField('image_url', '');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    updateField('image_url', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (uploadingImage) {
      setGlobalError('Please wait for the image to finish uploading.');
      return;
    }

    if (!validateStep(2)) {
      setGlobalError('Please fix the errors before publishing.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        quantity_estimated: parseInt(formData.quantity_estimated, 10),
        pickup_start_time: new Date(formData.pickup_start_time).toISOString(),
        pickup_end_time: new Date(formData.pickup_end_time).toISOString(),
      };

      if (!payload.image_url) delete payload.image_url;
      if (!payload.notes) delete payload.notes;
      if (!payload.contact_person_phone) delete payload.contact_person_phone;

      await api.post('food/my-listings/', payload);
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Failed to publish. Please check your inputs and try again.';
      setGlobalError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const completionPercentage = () => {
    const fields = [
      formData.food_type,
      formData.quantity_estimated,
      formData.pickup_city,
      formData.pickup_address,
      formData.pickup_start_time,
      formData.pickup_end_time,
    ];
    const filled = fields.filter((f) => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="font-bold text-sm hidden sm:inline">Back</span>
          </button>

          <h1 className="font-bold text-gray-900 text-lg">Share Food</h1>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span
                  className={`text-xs font-black ${completionPercentage() === 100 ? 'text-brand-green' : 'text-gray-500'}`}
                >
                  {completionPercentage()}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (step.id === currentStep + 1) nextStep();
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all w-full
                      ${isActive ? 'bg-brand-green/10 text-brand-green' : isCompleted ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    <div
                      className={`
                      w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all
                      ${isActive ? 'bg-brand-green text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                    >
                      {isCompleted ? (
                        <Check size={14} />
                      ) : (
                        <StepIcon size={14} />
                      )}
                    </div>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-8 mx-1 rounded-full shrink-0 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Error */}
      {globalError && (
        <div className="max-w-4xl mx-auto px-6 mt-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">{globalError}</p>
            </div>
            <button
              onClick={() => setGlobalError('')}
              className="ml-auto shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto px-6 py-8 space-y-8"
      >
        {/* STEP 1 — Food Details */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Image Upload */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Image size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Photo</h3>
                    <p className="text-xs text-gray-400">
                      A photo helps recipients know what to expect
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    relative rounded-2xl overflow-hidden transition-all duration-300
                    ${imagePreview ? 'h-64' : 'h-48'}
                    ${dragActive ? 'ring-4 ring-brand-green/20 bg-green-50' : 'bg-gray-50'}
                  `}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Food preview"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all"
                      >
                        <X size={16} />
                      </button>
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                          <Loader2
                            size={28}
                            className="text-brand-green animate-spin"
                          />
                          <span className="text-sm font-bold text-gray-700">
                            Uploading…
                          </span>
                        </div>
                      )}
                      {!uploadingImage && formData.image_url && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                          <Check size={14} />
                          Uploaded
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Camera
                          size={24}
                          className="text-brand-green"
                        />
                      </div>
                      <span className="font-bold text-gray-700 text-sm">
                        {dragActive
                          ? 'Drop your image here'
                          : 'Click or drag to add a photo'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </section>

            {/* Food Info */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Utensils size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Food Details</h3>
                    <p className="text-xs text-gray-400">
                      What are you sharing?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <FloatingInput
                  label="Food Title"
                  required
                  icon={Utensils}
                  value={formData.food_type}
                  error={touched.food_type ? fieldErrors.food_type : ''}
                  onChange={(e) => updateField('food_type', e.target.value)}
                  onBlur={() => markTouched('food_type')}
                  placeholder=""
                />

                {/* Category Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block ml-1">
                    Category
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateField('category', cat.value)}
                        className={`
                          flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center
                          ${
                            formData.category === cat.value
                              ? 'border-brand-green bg-brand-green/5 shadow-sm'
                              : 'border-transparent bg-gray-50 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-600 leading-tight">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Quantity"
                    required
                    icon={Package}
                    type="number"
                    min="1"
                    value={formData.quantity_estimated}
                    error={
                      touched.quantity_estimated
                        ? fieldErrors.quantity_estimated
                        : ''
                    }
                    onChange={(e) =>
                      updateField('quantity_estimated', e.target.value)
                    }
                    onBlur={() => markTouched('quantity_estimated')}
                    placeholder=""
                  />
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">
                      Unit
                    </label>
                    <select
                      value={formData.quantity_unit}
                      onChange={(e) =>
                        updateField('quantity_unit', e.target.value)
                      }
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-brand-green/40 focus:bg-white font-medium text-gray-700 transition-all cursor-pointer"
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="relative">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">
                    Notes{' '}
                    <span className="normal-case font-medium">(optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Any dietary info, allergens, special instructions…"
                    rows={3}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-brand-green/40 focus:bg-white text-gray-700 font-medium transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-brand-green text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:shadow-lg hover:shadow-brand-green/20 active:scale-[0.98] transition-all"
              >
                Continue
                <ChevronLeft size={18} className="rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Logistics */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Pickup Location</h3>
                    <p className="text-xs text-gray-400">
                      Where should recipients pick up?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatingInput
                    label="City"
                    required
                    icon={MapPin}
                    value={formData.pickup_city}
                    error={
                      touched.pickup_city ? fieldErrors.pickup_city : ''
                    }
                    onChange={(e) =>
                      updateField('pickup_city', e.target.value)
                    }
                    onBlur={() => markTouched('pickup_city')}
                    placeholder=""
                  />
                  <FloatingInput
                    label="Full Address"
                    required
                    icon={MapPin}
                    value={formData.pickup_address}
                    error={
                      touched.pickup_address
                        ? fieldErrors.pickup_address
                        : ''
                    }
                    onChange={(e) =>
                      updateField('pickup_address', e.target.value)
                    }
                    onBlur={() => markTouched('pickup_address')}
                    placeholder=""
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <Clock size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Pickup Window</h3>
                    <p className="text-xs text-gray-400">
                      When is the food available?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <Clock size={12} />
                      Available From *
                    </label>
                    <input
                      type="datetime-local"
                      min={getMinDateTime()}
                      value={formData.pickup_start_time}
                      onChange={(e) =>
                        updateField('pickup_start_time', e.target.value)
                      }
                      onBlur={() => markTouched('pickup_start_time')}
                      className={`
                        w-full p-4 rounded-2xl outline-none border-2 font-medium transition-all
                        ${fieldErrors.pickup_start_time && touched.pickup_start_time ? 'border-red-300 bg-red-50/30' : 'border-transparent bg-gray-50 focus:border-brand-green/40 focus:bg-white'}
                      `}
                    />
                    {fieldErrors.pickup_start_time &&
                      touched.pickup_start_time && (
                        <p className="text-red-500 text-xs font-medium ml-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {fieldErrors.pickup_start_time}
                        </p>
                      )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <Clock size={12} />
                      Available Until *
                    </label>
                    <input
                      type="datetime-local"
                      min={formData.pickup_start_time || getMinDateTime()}
                      value={formData.pickup_end_time}
                      onChange={(e) =>
                        updateField('pickup_end_time', e.target.value)
                      }
                      onBlur={() => markTouched('pickup_end_time')}
                      className={`
                        w-full p-4 rounded-2xl outline-none border-2 font-medium transition-all
                        ${fieldErrors.pickup_end_time && touched.pickup_end_time ? 'border-red-300 bg-red-50/30' : 'border-transparent bg-gray-50 focus:border-brand-green/40 focus:bg-white'}
                      `}
                    />
                    {fieldErrors.pickup_end_time &&
                      touched.pickup_end_time && (
                        <p className="text-red-500 text-xs font-medium ml-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {fieldErrors.pickup_end_time}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                    <User size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Contact{' '}
                      <span className="text-gray-400 font-medium text-sm">
                        (optional)
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Help recipients reach you
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatingInput
                    label="Contact Name"
                    icon={User}
                    value={formData.contact_person_name}
                    onChange={(e) =>
                      updateField('contact_person_name', e.target.value)
                    }
                    placeholder=""
                  />
                  <FloatingInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={formData.contact_person_phone}
                    onChange={(e) =>
                      updateField('contact_person_phone', e.target.value)
                    }
                    placeholder=""
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-500 font-bold px-6 py-4 rounded-2xl hover:bg-gray-100 flex items-center gap-2 transition-all"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-brand-green text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:shadow-lg hover:shadow-brand-green/20 active:scale-[0.98] transition-all"
              >
                Review
                <ChevronLeft size={18} className="rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-2xl flex items-center justify-center">
                    <Sparkles size={20} className="text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Review Your Listing</h3>
                    <p className="text-xs text-gray-400">
                      Make sure everything looks good
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Preview Card */}
                <div className="bg-gradient-to-br from-gray-50 to-green-50/20 rounded-2xl p-6 space-y-4">
                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden h-48">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {formData.food_type || 'Untitled'}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          {CATEGORIES.find((c) => c.value === formData.category)
                            ?.emoji}{' '}
                          {
                            CATEGORIES.find((c) => c.value === formData.category)
                              ?.label
                          }
                        </p>
                      </div>
                      <div className="bg-brand-green/10 text-brand-green font-bold text-sm px-3 py-1.5 rounded-lg">
                        {formData.quantity_estimated}{' '}
                        {formData.quantity_unit}
                      </div>
                    </div>

                    {formData.notes && (
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-xl flex items-start gap-2">
                        <Info size={14} className="shrink-0 mt-0.5 text-gray-400" />
                        {formData.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Detail Rows */}
                <div className="divide-y divide-gray-100">
                  <ReviewRow
                    icon={MapPin}
                    label="Pickup"
                    value={`${formData.pickup_address}, ${formData.pickup_city}`}
                  />
                  <ReviewRow
                    icon={Clock}
                    label="Available"
                    value={`${formatDateTime(formData.pickup_start_time)} → ${formatDateTime(formData.pickup_end_time)}`}
                  />
                  {formData.contact_person_name && (
                    <ReviewRow
                      icon={User}
                      label="Contact"
                      value={`${formData.contact_person_name}${formData.contact_person_phone ? ` · ${formData.contact_person_phone}` : ''}`}
                    />
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Once published, your listing will be visible to all nearby
                    recipients. You can manage or delete it from your dashboard.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-500 font-bold px-6 py-4 rounded-2xl hover:bg-gray-100 flex items-center gap-2 transition-all"
              >
                <ChevronLeft size={18} />
                Edit
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="bg-brand-green text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-3 hover:shadow-xl hover:shadow-brand-green/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    Publish Listing
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-sm mx-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Published!
            </h3>
            <p className="text-gray-500 text-sm">
              Your food listing is now live. Redirecting to dashboard…
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-4">
    <Icon size={16} className="text-gray-400 shrink-0 mt-0.5" />
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

export default PostFood;