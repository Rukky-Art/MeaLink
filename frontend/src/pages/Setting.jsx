import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, Lock, Bell, Trash2,
  Check, AlertCircle, Loader2, Eye, EyeOff, X,
} from 'lucide-react';
import api from '../auth/api';
import { fetchUserProfile, logout } from '../store/slices/authSlice';

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ icon: Icon, iconBg, iconColor, title, subtitle, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex items-center gap-3">
      <div className={`w-10 h-10 ${iconBg} rounded-2xl flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Floating label input ──────────────────────────────────────────────────────
const Field = ({ label, error, type = 'text', rightEl, ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = String(props.value ?? '').length > 0;
  return (
    <div className="relative">
      <div className={`relative flex items-center bg-slate-50 rounded-2xl border-2 transition-all
        ${error ? 'border-red-300 bg-red-50/30' : focused ? 'border-brand-green/40 bg-white shadow-sm' : 'border-transparent hover:border-slate-200'}`}
      >
        <div className="relative flex-1">
          <label className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${focused || hasValue ? 'top-2 text-[10px] font-bold tracking-wider uppercase' : 'top-1/2 -translate-y-1/2 text-sm'}
            ${error ? 'text-red-400' : focused ? 'text-brand-green' : 'text-slate-400'}`}
          >
            {label}
          </label>
          <input
            type={type}
            {...props}
            onFocus={e => { setFocused(true); props.onFocus?.(e); }}
            onBlur={e => { setFocused(false); props.onBlur?.(e); }}
            className={`w-full bg-transparent outline-none px-4 text-slate-900 font-medium
              ${focused || hasValue ? 'pt-6 pb-2' : 'py-4'}`}
          />
        </div>
        {rightEl && <div className="pr-4">{rightEl}</div>}
      </div>
      {error && (
        <p className="text-red-500 text-xs font-medium mt-1.5 ml-4 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </p>
      )}
    </div>
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300
    ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
  >
    {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
    {msg}
    <button onClick={onClose} className="ml-2"><X size={14} /></button>
  </div>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-200
      ${checked ? 'bg-brand-green' : 'bg-slate-200'}`}
  >
    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
      ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

// ── Main Settings page ────────────────────────────────────────────────────────
const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // ── Profile state ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name:         user?.name         || '',
    phone_number: user?.phone_number || '',
    address:      user?.address      || '',
    city:         user?.city         || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors,  setProfileErrors]  = useState({});

  // ── Password state ─────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    old_password:     '',
    new_password:     '',
    confirm_password: '',
  });
  const [showPw,       setShowPw]       = useState({ old: false, new: false, confirm: false });
  const [pwLoading,    setPwLoading]    = useState(false);
  const [pwErrors,     setPwErrors]     = useState({});

  // ── Notification prefs (local until backend ready) ─────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    claims:    true,
    status:    true,
    available: false,
  });

  // ── Delete account ─────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm,   setDeleteConfirm]   = useState('');
  const [deleteLoading,   setDeleteLoading]   = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Profile submit ─────────────────────────────────────────────────────────
  const handleProfileSave = async () => {
    const errors = {};
    if (!profile.name.trim())   errors.name = 'Name is required';
    if (!profile.city.trim())   errors.city = 'City is required';
    if (Object.keys(errors).length) { setProfileErrors(errors); return; }

    setProfileLoading(true);
    try {
      await api.patch('users/me/', profile);
      dispatch(fetchUserProfile());
      showToast('Profile updated successfully');
      setProfileErrors({});
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Password submit ────────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    const errors = {};
    if (!passwords.old_password)     errors.old_password     = 'Enter your current password';
    if (passwords.new_password.length < 8) errors.new_password = 'Minimum 8 characters';
    if (passwords.new_password !== passwords.confirm_password)
      errors.confirm_password = 'Passwords do not match';
    if (Object.keys(errors).length) { setPwErrors(errors); return; }

    setPwLoading(true);
    try {
      await api.post('users/change-password/', {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      showToast('Password changed successfully');
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      setPwErrors({});
    } catch (err) {
      const data = err?.response?.data;
      if (data?.old_password) {
        setPwErrors({ old_password: 'Current password is incorrect' });
      } else {
        showToast(data?.detail || 'Failed to change password', 'error');
      }
    } finally {
      setPwLoading(false);
    }
  };

  // ── Delete account ─────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleteLoading(true);
    try {
      await api.delete('users/me/');
      dispatch(logout());
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to delete account', 'error');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-be-vietnam">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page title */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* ── Profile ───────────────────────────────────────────────────────── */}
        <Section
          icon={User}
          iconBg="bg-brand-green/10"
          iconColor="text-brand-green"
          title="Profile Information"
          subtitle="Update your name, phone, and address"
        >
          <div className="space-y-4">
            <Field
              label="Full Name"
              value={profile.name}
              error={profileErrors.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
            <Field
              label="Phone Number"
              value={profile.phone_number}
              type="tel"
              onChange={e => setProfile(p => ({ ...p, phone_number: e.target.value }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="City"
                value={profile.city}
                error={profileErrors.city}
                onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
              />
              <Field
                label="Address"
                value={profile.address}
                onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
              />
            </div>

            {/* Read-only email */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-slate-600 mt-0.5">{user?.email}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-lg">
                Cannot change
              </span>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={profileLoading}
              className="w-full h-12 bg-brand-green text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-green/20 transition-all disabled:opacity-50"
            >
              {profileLoading ? <><Loader2 size={18} className="animate-spin" />Saving…</> : 'Save Changes'}
            </button>
          </div>
        </Section>

        {/* ── Password ──────────────────────────────────────────────────────── */}
        <Section
          icon={Lock}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          title="Change Password"
          subtitle="Use a strong password you don't use elsewhere"
        >
          <div className="space-y-4">
            {[
              { key: 'old_password',     label: 'Current Password',  showKey: 'old'     },
              { key: 'new_password',     label: 'New Password',       showKey: 'new'     },
              { key: 'confirm_password', label: 'Confirm Password',   showKey: 'confirm' },
            ].map(({ key, label, showKey }) => (
              <Field
                key={key}
                label={label}
                type={showPw[showKey] ? 'text' : 'password'}
                value={passwords[key]}
                error={pwErrors[key]}
                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPw(p => ({ ...p, [showKey]: !p[showKey] }))}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            ))}
            <button
              onClick={handlePasswordChange}
              disabled={pwLoading}
              className="w-full h-12 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {pwLoading ? <><Loader2 size={18} className="animate-spin" />Updating…</> : 'Update Password'}
            </button>
          </div>
        </Section>

        {/* ── Notification Prefs ────────────────────────────────────────────── */}
        <Section
          icon={Bell}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          title="Notification Preferences"
          subtitle="Choose what you want to be notified about"
        >
          <div className="space-y-4">
            {[
              { key: 'claims',    label: 'Food claimed',         sub: 'When someone claims your listing'    },
              { key: 'status',    label: 'Claim status updates', sub: 'Pickup and distribution confirmations' },
              { key: 'available', label: 'New food near me',     sub: 'When new listings appear in your city' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between gap-4 py-1">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
                <Toggle
                  checked={notifPrefs[key]}
                  onChange={val => setNotifPrefs(p => ({ ...p, [key]: val }))}
                />
              </div>
            ))}
            <p className="text-[11px] text-slate-300 font-medium pt-2">
              Preferences will sync to the server once the notifications backend is live.
            </p>
          </div>
        </Section>

        {/* ── Danger Zone ───────────────────────────────────────────────────── */}
        <Section
          icon={Trash2}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          title="Danger Zone"
          subtitle="Permanent actions that cannot be undone"
        >
          <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-100 rounded-2xl p-4">
            <div>
              <p className="text-sm font-bold text-red-700">Delete Account</p>
              <p className="text-xs text-red-400 mt-0.5">
                Permanently remove your account and all data.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all shrink-0"
            >
              Delete
            </button>
          </div>
        </Section>

      </div>

      {/* ── Delete confirmation modal ──────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center">Delete your account?</h3>
            <p className="text-sm text-slate-500 text-center mt-2 mb-6 leading-relaxed">
              This will permanently delete all your listings, claims, and data. Type{' '}
              <span className="font-bold text-red-500">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-red-300 outline-none text-sm font-medium mb-4 transition-all"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                className="flex-1 h-12 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                className="flex-1 h-12 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {deleteLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Settings;