import { useState, useEffect } from "react";
import api from '../../auth/api';
import { useSelector } from "react-redux";

const TABS = [
  { key: "organization", label: "My organization" },
  { key: "password", label: "Password" },
  { key: "verification", label: "Verification" },
  { key: "delete", label: "Delete account" },
];

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, profile }) {
  const initials = profile?.organization_name
    ? profile.organization_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NF";

  return (
    <aside className="w-64 shrink-0">
      {/* Avatar card */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-white text-xl font-bold mb-2">
          {initials}
        </div>
        <p className="font-semibold text-gray-800 text-sm">
          {profile?.organization_name || "Organisation Name"}
        </p>
        <p className="text-xs text-gray-500">{profile?.email || "email@org.org"}</p>
        {profile?.verification_status === "pending" && (
          <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            Pending review
          </span>
        )}
        {profile?.verification_status === "verified" && (
          <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            Verified
          </span>
        )}
      </div>

      {/* Nav */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
        Settings
      </p>
      <nav className="flex flex-col gap-0.5">
        {TABS.map((tab) => {
          const isDelete = tab.key === "delete";
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2 rounded-md text-sm transition-colors
                ${isDelete
                  ? "text-red-500 hover:bg-red-50"
                  : isActive
                  ? "bg-yellow-50 text-yellow-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Impact stats */}
      <div className="mt-8 border-t pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Your impact
        </p>
        {[
          { label: "Total claims", value: profile?.total_claims ?? 31 },
          { label: "Meals distributed", value: profile?.meals_distributed ?? "1,240" },
          { label: "Households served", value: profile?.households_served ?? 380 },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm py-1">
            <span className="text-gray-500">{label}</span>
            <span className="text-orange-500 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Tab: My Organization ────────────────────────────────────────────────────
function OrganizationTab({ profile }) {
const [form, setForm] = useState({
  organization_name: "",
  email: "",
  organization_type: "",
  registration_number: "",
  contact_person: "",
  phone_number: "",
  operating_zone: "",
  country: "",
});
useEffect(() => {
  if (profile) {
    setForm({
      organization_name: profile.organization_name || "",
      email: profile.email || "",
      organization_type: profile.organization_type || "",
      registration_number: profile.registration_number || "",
      contact_person: profile.contact_person || "",
      phone_number: profile.phone_number || "",
      operating_zone: profile.operating_zone || "",
      country: profile.country || "",
    });
  }
}, [profile]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.patch("/partner/profile/", form);
      setMessage({ type: "success", text: "Changes saved successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, placeholder }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder || label}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">ORGANIZATION INFORMATION</h2>
      <p className="text-sm text-gray-500 mb-6">
        This is the profile donors and admins see. Keeping it accurate helps build trust across the
        network.
      </p>

      <div className="grid grid-cols-2 gap-5 mb-8">
        <Field label="Organisation name" name="organization_name" />
        <Field label="Email address" name="email" />
        <Field label="Organisation type" name="organization_type" />
        <Field label="Registration number" name="registration_number" />
        <Field label="Contact person" name="contact_person" />
        <Field label="Phone number" name="phone_number" />
        <Field label="Operating zone / area" name="operating_zone" />
        <Field label="Country" name="country" />
      </div>

      <div className="border-t pt-6 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-4">ACCOUNT INFO</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-gray-500 mb-1">Account type</p>
            <span className="inline-block px-3 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium capitalize">
              {profile?.account_type || "Distribution partner"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Member since</p>
            <p className="text-sm text-gray-700">{profile?.member_since || "March 2026"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Verification status</p>
            <span className="inline-block px-3 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
              {profile?.verification_status === "verified" ? "Verified" : "Pending review"}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm mb-4 ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={() => setMessage(null)}
          className="px-5 py-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Password ───────────────────────────────────────────────────────────
function PasswordTab({ profile }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (form.new_password !== form.confirm_password) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await api.post("/auth/change-password/", {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setMessage({ type: "success", text: "Password updated successfully." });
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch {
      setMessage({ type: "error", text: "Failed to update password. Check your current password." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">PASSWORD &amp; SECURITY</h2>
      <p className="text-sm text-gray-500 mb-6">
        Use a strong password of at least 8 characters to keep your partner account secure.
      </p>

      <div className="flex flex-col gap-4 max-w-md mb-8">
        {[
          { label: "Current password", name: "current_password", placeholder: "Enter your current password" },
          { label: "New password", name: "new_password", placeholder: "Create a new password" },
          { label: "Confirm new password", name: "confirm_password", placeholder: "Repeat your new password" },
        ].map(({ label, name, placeholder }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input
              type="password"
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        ))}
      </div>

      <div className="border-t pt-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">SECURITY INFO</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <p className="text-sm text-gray-500">Last password change</p>
          <p className="text-sm text-gray-700">{profile?.last_password_change || "Never changed"}</p>
          <p className="text-sm text-gray-500">Last login</p>
          <p className="text-sm text-gray-700">{profile?.last_login || "Today  12:30 PM"}</p>
        </div>
      </div>

      {message && (
        <p className={`text-sm mb-4 ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {message.text}
        </p>
      )}

      <button
        onClick={handleUpdate}
        disabled={saving}
        className="px-5 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60"
      >
        {saving ? "Updating..." : "Update password"}
      </button>
    </div>
  );
}

// ─── Tab: Verification ───────────────────────────────────────────────────────
function VerificationTab({ profile }) {
  const isPending = profile?.verification_status !== "verified";

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">VERIFICATION STATUS</h2>

      {isPending ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3 mb-6">
          <p className="text-sm font-medium text-yellow-800">Your account is pending review</p>
          <p className="text-sm text-yellow-700 mt-0.5">
            The MeaLink admin team is reviewing your registration details. This typically takes up to
            24 hours. You will receive an email once approved.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-6">
          <p className="text-sm font-medium text-green-800">Your account is verified</p>
          <p className="text-sm text-green-700 mt-0.5">
            You can claim food listings across the MeaLink network.
          </p>
        </div>
      )}

      <h3 className="text-base font-bold text-gray-800 mb-4">SUBMITTED DETAILS</h3>
      <div className="grid grid-cols-2 gap-y-5 max-w-lg">
        {[
          { label: "Organisation name", value: profile?.organization_name || "Nairobi food bank" },
          { label: "Registration Number", value: profile?.registration_number || "NGO-12345" },
          { label: "Submitted on", value: profile?.submitted_on || "June 12, 2026" },
          {
            label: "Current status",
            value: isPending ? "Pending" : "Verified",
            colored: true,
            isPending,
          },
        ].map(({ label, value, colored, isPending: ip }) => (
          <div key={label}>
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            {colored ? (
              <span className={`text-sm font-medium ${ip ? "text-yellow-600" : "text-green-600"}`}>
                {value}
              </span>
            ) : (
              <p className="text-sm text-gray-800">{value}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-8 max-w-lg">
        Once verified, you will be able to claim food listings across the MeaLink network. If you
        need to update any submitted details, edit them in the organization info section.
      </p>
    </div>
  );
}

// ─── Tab: Delete Account ─────────────────────────────────────────────────────
function DeleteTab() {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.delete("/partner/account/");
      // Redirect or logout after deletion
      window.location.href = "/";
    } catch {
      setError("Failed to delete account. Please try again or contact support.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-red-600 mb-4">DELETE ACCOUNT</h2>

      <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6">
        <p className="text-sm font-medium text-red-700">This action cannot be undone</p>
        <p className="text-sm text-red-600 mt-0.5">
          Deleting your account will permanently remove your organisation profile, all claims
          history, and impact data. Any active claims will be cancelled immediately.
        </p>
      </div>

      <h3 className="text-base font-bold text-gray-800 mb-4">CONFIRM DELETION</h3>

      <div className="flex flex-col gap-4 max-w-lg">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Type <span className="font-semibold">"DELETE to confirm"</span>
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Tell us why <span className="text-gray-400">(OPTIONAL)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why?"
            rows={3}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4 mt-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete my account"}
          </button>
          <button
            onClick={() => {
              setConfirmText("");
              setReason("");
              setError(null);
            }}
            className="px-5 py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PartnerProfile() {
  const [activeTab, setActiveTab] = useState("organization");
  const { user } = useSelector((state) => state.auth);

  // Build a profile object from Redux user + any extra fields the API returns
  const profile = user;

  const renderTab = () => {
    switch (activeTab) {
      case "organization":
        return <OrganizationTab profile={profile} />;
      case "password":
        return <PasswordTab profile={profile} />;
      case "verification":
        return <VerificationTab profile={profile} />;
      case "delete":
        return <DeleteTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-sm text-gray-400 font-medium">Partner profile</h1>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-8 py-8 flex gap-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />

        {/* Main content panel */}
        <main className="flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-8">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
