import { useState, useEffect, useRef } from "react";
import { getSession, logout, getRawUsers, saveRawUsers, updateStoredUser, getRawCurrentUser } from "../utils/auth";
import Sidebar from "../components/Sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// auth.js storage helpers (mirrored here so Settings can write back directly)
// ─────────────────────────────────────────────────────────────────────────────
const USERS_KEY = "habittrack_users";



// ── Inline SVG icon helper ────────────────────────────────────────────────
const Icon = ({ d, size = 18, className = "", strokeWidth = 2, fill = "none" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} />)
      : <path d={d} />}
  </svg>
);

const icons = {
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"],
  bell:     ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"],
  palette:  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-2-8a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logout:   ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeOff:   ["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24","M1 1l22 22"],
  check:    "M20 6L9 17l-5-5",
  trash:    ["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  edit:     ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7","M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  info:     ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 8v4","M12 16h.01"],
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  close:    "M18 6L6 18M6 6l12 12",
  danger:   ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  camera:   ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z","M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
};

// ── Toast notification ────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const variants = {
    success: "border-l-green-500 border-green-500/30",
    error:   "border-l-red-500   border-red-500/30",
    info:    "border-l-purple-500 border-purple-500/30",
  };
  const iconMap = { success: icons.check, error: icons.danger, info: icons.info };
  const iconColor = { success: "text-green-400", error: "text-red-400", info: "text-purple-400" };

  return (
    <div className={`fixed bottom-7 right-7 z-50 flex items-center gap-3 bg-gray-900 border border-l-4 ${variants[type] || variants.info} rounded-xl px-5 py-3.5 text-slate-200 text-sm font-medium shadow-2xl animate-slide-in`}>
      <Icon d={iconMap[type] || iconMap.info} size={16} className={iconColor[type] || iconColor.info} />
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 text-slate-500 hover:text-slate-300 transition-colors">
        <Icon d={icons.close} size={14} />
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose, danger = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm animate-fade-in px-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full max-w-md bg-gray-900 rounded-2xl p-7 shadow-2xl border animate-pop-in ${danger ? "border-red-500/30" : "border-white/10"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-bold ${danger ? "text-red-400" : "text-slate-100"}`}>{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Icon d={icons.close} size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Password input with show/hide ─────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-11 bg-white/5 border rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors ${error ? "border-red-500/60" : "border-white/10"}`}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Icon d={show ? icons.eyeOff : icons.eye} size={16} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Password strength bar ─────────────────────────────────────────────────
function StrengthBar({ password }) {
  const calc = (p) => {
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  };
  const strength   = password ? calc(password) : 0;
  const labels     = ["", "Weak", "Fair", "Good", "Strong"];
  const barColors  = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const textColors = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400"];

  if (!password) return null;
  return (
    <div className="mb-4">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? barColors[strength] : "bg-white/10"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────
function Section({ iconPath, title, description, iconBg, iconColor, children }) {
  return (
    <div className="bg-[#171717] border border-white/5 rounded-3xl p-6 mb-4 transition-colors">
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon d={iconPath} size={18} className={iconColor} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-slate-200 font-medium">{label}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200 ${checked ? "bg-purple-600" : "bg-white/10"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

// ── Text input (generic) ──────────────────────────────────────────────────
function TextInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Settings page
// ─────────────────────────────────────────────────────────────────────────────
export default function Settings({ onLogout }) {
  // ── Seed state from auth.js session ──────────────────────────────────────
  const [user, setUser] = useState(() => getSession() ?? { name: "Guest", email: "", avatar: "" });

  const [notifs, setNotifs] = useState(() =>
    JSON.parse(localStorage.getItem("habittrack_notifs") || JSON.stringify({
      dailyReminder: true, streakAlert: true, weeklyReport: false, missedHabit: true,
    }))
  );

  const [prefs, setPrefs] = useState(() =>
    JSON.parse(localStorage.getItem("habittrack_prefs") || JSON.stringify({
      accentColor: "#a855f7", showStreak: true, compactView: false,
    }))
  );

  const [toast, setToast]       = useState(null);
  const [modal, setModal]       = useState(null);
  const [pwForm, setPwForm]     = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: user.name, email: user.email });
  const fileRef = useRef();

  const showToast = (message, type = "success") => setToast({ message, type });

  // Persist notification + preference changes
  useEffect(() => { localStorage.setItem("habittrack_notifs", JSON.stringify(notifs)); }, [notifs]);
  useEffect(() => { localStorage.setItem("habittrack_prefs",  JSON.stringify(prefs));  }, [prefs]);

  // ── Profile save ─────────────────────────────────────────────────────────
  // Writes name/email back into the habittrack_users array via updateStoredUser.
  const handleSaveProfile = () => {
    if (!profileDraft.name.trim())          return showToast("Name cannot be empty", "error");
    if (!profileDraft.email.includes("@"))  return showToast("Enter a valid email",  "error");

    const updated = updateStoredUser(user.id, {
      name:  profileDraft.name.trim(),
      email: profileDraft.email.trim().toLowerCase(),
    });

    if (!updated) return showToast("Could not save — session lost", "error");

    setUser(updated);
    setProfileEdit(false);
    showToast("Profile updated successfully");
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────
  // Stores the base64 image inside the user record in habittrack_users.
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = updateStoredUser(user.id, { avatar: ev.target.result });
      if (updated) { setUser(updated); showToast("Avatar updated"); }
    };
    reader.readAsDataURL(file);
  };

  // ── Password change ───────────────────────────────────────────────────────
  // Reads the raw (password-included) record to verify current password,
  // then writes the new password back via updateStoredUser.
  const handlePasswordChange = () => {
    const errors = {};
    const raw = getRawCurrentUser(user.id);

    if (!raw) return showToast("Session expired — please log in again", "error");

    if (raw.password && pwForm.current !== raw.password)
      errors.current = "Current password is incorrect";
    if (pwForm.next.length < 8)
      errors.next = "Password must be at least 8 characters";
    if (pwForm.next !== pwForm.confirm)
      errors.confirm = "Passwords do not match";

    if (Object.keys(errors).length) { setPwErrors(errors); return; }

    updateStoredUser(user.id, { password: pwForm.next });
    setPwForm({ current: "", next: "", confirm: "" });
    setPwErrors({});
    setModal(null);
    showToast("Password changed successfully");
  };

  // ── Export data ───────────────────────────────────────────────────────────
  // Reads habits from the "habits" key managed by useHabits.js.
  const handleExportData = () => {
    const data = {
      profile:     user,                          // sanitised — no password
      habits:      JSON.parse(localStorage.getItem("habits") || "[]"),
      notifs,
      prefs,
      exportedAt:  new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "habittrack-data.json"; a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully");
  };

  // ── Delete account ────────────────────────────────────────────────────────
  // Removes the user from habittrack_users, clears the session (via auth.js
  // logout), and cleans up all app data keys.
  const handleDeleteAccount = () => {
    const users = getRawUsers().filter(u => u.id !== user.id);
    saveRawUsers(users);
    logout();                                      // clears habittrack_session
    localStorage.removeItem("habits");             // useHabits.js key
    localStorage.removeItem("habittrack_notifs");
    localStorage.removeItem("habittrack_prefs");
    setModal(null);
    showToast("Account deleted", "error");
    setTimeout(() => onLogout?.(), 1200);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();                                      // clears habittrack_session
    setModal(null);
    showToast("Logged out", "info");
    setTimeout(() => onLogout?.(), 800);
  };

  const accentColors = ["#a855f7","#22c55e","#3b82f6","#f97316","#ec4899","#14b8a6"];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex bg-black text-white w-full gap-6 md:gap-3 min-h-screen">
      <Sidebar />

      <style>{`
        @keyframes slide-in  { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fade-in   { from { opacity:0 } to { opacity:1 } }
        @keyframes pop-in    { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
        .animate-slide-in { animation: slide-in .25s ease }
        .animate-fade-in  { animation: fade-in  .15s ease }
        .animate-pop-in   { animation: pop-in   .2s  ease }
        input::placeholder { color:#475569 }
      `}</style>

      <div className="w-full px-4 pb-25 pt-6 md:pb-6 md:pr-6">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Manage your account, preferences and notifications</p>
        </div>

        {/* ── PROFILE ── */}
        <Section
          iconPath={icons.user} title="Profile" description="Your personal information"
          iconBg="bg-purple-500/20" iconColor="text-purple-400"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <div className="w-16 h-16 rounded-full border-2 border-purple-500/40 overflow-hidden flex items-center justify-center bg-linear-to-br from-purple-500 to-indigo-600 text-white text-xl font-bold">
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : user.name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon d={icons.camera} size={16} className="text-white" />
              </div>
              <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <button
                className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                Change photo
              </button>
            </div>
          </div>

          {profileEdit ? (
            <div>
              <TextInput
                label="Display Name"
                value={profileDraft.name}
                onChange={v => setProfileDraft(p => ({ ...p, name: v }))}
              />
              <TextInput
                label="Email Address"
                type="email"
                value={profileDraft.email}
                onChange={v => setProfileDraft(p => ({ ...p, email: v }))}
              />
              <div className="flex gap-3 mt-1">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setProfileEdit(false); setProfileDraft({ name: user.name, email: user.email }); }}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setProfileEdit(true); setProfileDraft({ name: user.name, email: user.email }); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-400 text-sm font-semibold rounded-xl transition-colors"
            >
              <Icon d={icons.edit} size={15} /> Edit Profile
            </button>
          )}
        </Section>

        {/* ── SECURITY ── */}
        <Section
          iconPath={icons.lock} title="Security" description="Password and account security"
          iconBg="bg-indigo-500/20" iconColor="text-indigo-400"
        >
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => { setModal("password"); setPwErrors({}); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-sm font-semibold rounded-xl transition-colors"
            >
              <Icon d={icons.lock} size={15} /> Change Password
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/8 border border-green-500/20 rounded-xl">
              <Icon d={icons.shield} size={15} className="text-green-400" />
              <span className="text-xs text-green-400 font-semibold">Account Protected</span>
            </div>
          </div>
        </Section>

        {/* ── NOTIFICATIONS ── */}
        <Section
          iconPath={icons.bell} title="Notifications" description="Control how you receive alerts"
          iconBg="bg-orange-500/20" iconColor="text-orange-400"
        >
          <Toggle label="Daily Reminder"     sublabel="Remind me to log habits each day"   checked={notifs.dailyReminder} onChange={v => setNotifs(p => ({ ...p, dailyReminder: v }))} />
          <Toggle label="Streak Alerts"      sublabel="Warn me before losing a streak"      checked={notifs.streakAlert}   onChange={v => setNotifs(p => ({ ...p, streakAlert:    v }))} />
          <Toggle label="Weekly Report"      sublabel="Get a summary every Monday"          checked={notifs.weeklyReport}  onChange={v => setNotifs(p => ({ ...p, weeklyReport:   v }))} />
          <Toggle label="Missed Habit Alert" sublabel="Notify me about uncompleted habits"  checked={notifs.missedHabit}   onChange={v => setNotifs(p => ({ ...p, missedHabit:    v }))} />
        </Section>

        {/* ── APPEARANCE ── */}
        <Section
          iconPath={icons.palette} title="Appearance" description="Personalize your experience"
          iconBg="bg-pink-500/20" iconColor="text-pink-400"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Accent Color</p>
            <div className="flex gap-2.5">
              {accentColors.map(c => (
                <button
                  key={c}
                  onClick={() => setPrefs(p => ({ ...p, accentColor: c }))}
                  className="w-7 h-7 rounded-full transition-transform duration-150 hover:scale-110"
                  style={{
                    background: c,
                    border: prefs.accentColor === c ? "3px solid #fff" : "3px solid transparent",
                    transform: prefs.accentColor === c ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
          <Toggle label="Show Streak Count" sublabel="Display streak number on habit cards" checked={prefs.showStreak}  onChange={v => setPrefs(p => ({ ...p, showStreak:  v }))} />
          <Toggle label="Compact View"      sublabel="Reduce spacing for a denser layout"   checked={prefs.compactView} onChange={v => setPrefs(p => ({ ...p, compactView: v }))} />
        </Section>

        {/* ── DATA & PRIVACY ── */}
        <Section
          iconPath={icons.download} title="Data & Privacy" description="Export or manage your data"
          iconBg="bg-teal-500/20" iconColor="text-teal-400"
        >
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 text-teal-300 text-sm font-semibold rounded-xl transition-colors"
          >
            <Icon d={icons.download} size={15} /> Export My Data
          </button>
        </Section>

        {/* ── DANGER ZONE ── */}
        <div className="bg-red-500/8 border border-red-500/15 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Icon d={icons.danger} size={18} className="text-red-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
              <p className="text-xs text-slate-500">Actions here are irreversible</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setModal("logout")}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-sm font-semibold rounded-xl transition-colors"
            >
              <Icon d={icons.logout} size={15} /> Log Out
            </button>
            <button
              onClick={() => setModal("delete")}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-sm font-semibold rounded-xl transition-colors"
            >
              <Icon d={icons.trash} size={15} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* ── MODAL: Change Password ── */}
      {modal === "password" && (
        <Modal
          title="Change Password"
          onClose={() => { setModal(null); setPwForm({ current:"",next:"",confirm:"" }); setPwErrors({}); }}
        >
          <PasswordField
            label="Current Password"
            value={pwForm.current}
            onChange={v => setPwForm(p => ({ ...p, current: v }))}
            placeholder="Enter your current password"
            error={pwErrors.current}
          />
          <PasswordField
            label="New Password"
            value={pwForm.next}
            onChange={v => setPwForm(p => ({ ...p, next: v }))}
            placeholder="At least 8 characters"
            error={pwErrors.next}
          />
          <StrengthBar password={pwForm.next} />
          <PasswordField
            label="Confirm New Password"
            value={pwForm.confirm}
            onChange={v => setPwForm(p => ({ ...p, confirm: v }))}
            placeholder="Repeat new password"
            error={pwErrors.confirm}
          />
          <button
            onClick={handlePasswordChange}
            className="w-full mt-1 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Update Password
          </button>
        </Modal>
      )}

      {/* ── MODAL: Logout ── */}
      {modal === "logout" && (
        <Modal title="Log Out" onClose={() => setModal(null)} danger>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            You'll be signed out of your account. Your data will remain safe and you can log back in anytime.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Yes, Log Out
            </button>
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Delete Account ── */}
      {modal === "delete" && (
        <Modal title="Delete Account" onClose={() => setModal(null)} danger>
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-6">
            <Icon d={icons.danger} size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm leading-relaxed">
              This will permanently delete your account, all habits, and streaks.{" "}
              <strong className="text-red-200">This cannot be undone.</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Delete Forever
            </button>
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
