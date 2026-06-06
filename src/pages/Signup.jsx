// ─── Signup.jsx ──────────────────────────────────────────────────
// Usage: <Signup onSuccess={(user) => navigate("/dashboard")} onLogin={() => navigate("/login")} />
// Requires the same tailwind.config.js additions as Login.jsx:
//   animation: { slideUp, shake }, keyframes: { slideUp, shake }

import { useState, useCallback } from "react";
import { register } from "../utils/auth"; // adjust path if needed

// Password strength calculator
function pwStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return score; // 0–5
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6"];

export default function Signup({ onSuccess, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const strength = pwStrength(password);
  const strengthPct = `${(strength / 5) * 100}%`;
  const pwMatch = confirm && password === confirm;
  const pwNoMatch = confirm && password !== confirm;

  const touch = (key) => setTouched((p) => ({ ...p, [key]: true }));

  const validate = useCallback(() => {
    if (!name.trim()) return "Please enter your name.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (strength < 2) return "Password is too weak. Add numbers or symbols.";
    if (password !== confirm) return "Passwords don't match.";
    return null;
  }, [name, email, password, confirm, strength]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 420));
    const result = register({ name, email, password });
    setLoading(false);

    if (result.ok) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
    }
  }

  // Confirm password border color logic
  const confirmBorderClass = pwNoMatch
    ? "border-[rgba(239,68,68,0.5)]"
    : pwMatch
    ? "border-[rgba(34,197,94,0.45)]"
    : "border-[rgba(124,58,237,0.22)]";

  return (
    <div className="relative min-h-screen bg-[#0f0f1a] flex items-center justify-center px-[5%] py-6 overflow-hidden font-['Sora','Segoe_UI',sans-serif]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-40 -left-44 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.16)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(157,91,247,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[30%] -left-14 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.07)_0%,transparent_70%)]" />

      {/* Card */}
      <div className="relative w-full max-w-[430px] rounded-[22px] border border-[rgba(124,58,237,0.22)] bg-[rgba(26,26,46,0.94)] px-[38px] pt-9 pb-7 backdrop-blur-xl shadow-[0_28px_90px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(124,58,237,0.1)] animate-slideUp">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <img className="h-6 aspect-square" src="/favicon.svg" alt="logo" />
          <h1 className="text-2xl font-bold ml-1.5 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]">
            HabitTrack
          </h1>
        </div>

        <h2 className="m-0 mb-1 text-2xl font-extrabold text-[#f0f0ff] tracking-tight">
          Create your account
        </h2>
        <p className="m-0 mb-6 text-[13px] text-[#8888aa]">
          Start building powerful habits today
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>

          {/* Full Name */}
          <Field
            label="Full Name"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#9d5bf7" strokeWidth="1.8" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          >
            <input
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => touch("name")}
              autoComplete="name"
              className="w-full box-border rounded-[11px] border-[1.5px] border-[rgba(124,58,237,0.22)] bg-[#13132b] py-[11px] pl-10 pr-3.5 text-[13.5px] text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]"
            />
          </Field>

          {/* Email */}
          <Field
            label="Email"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="#9d5bf7" strokeWidth="1.8" />
                <path d="M2 8l10 6 10-6" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          >
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touch("email")}
              autoComplete="email"
              className="w-full box-border rounded-[11px] border-[1.5px] border-[rgba(124,58,237,0.22)] bg-[#13132b] py-[11px] pl-10 pr-3.5 text-[13.5px] text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]"
            />
          </Field>

          {/* Password */}
          <Field
            label="Password"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9d5bf7" strokeWidth="1.8" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          >
            <input
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => touch("password")}
              autoComplete="new-password"
              className="w-full box-border rounded-[11px] border-[1.5px] border-[rgba(124,58,237,0.22)] bg-[#13132b] py-[11px] pl-10 pr-11 text-[13.5px] text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]"
            />
            <EyeBtn show={showPw} toggle={() => setShowPw((p) => !p)} />
          </Field>

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="flex items-center gap-2.5 -mt-1.5">
              <div className="flex-1 h-1 bg-white/[0.07] rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-[width,background] duration-300"
                  style={{
                    width: strengthPct,
                    background: STRENGTH_COLORS[strength],
                  }}
                />
              </div>
              <span
                className="text-[11px] font-bold min-w-[72px]"
                style={{ color: STRENGTH_COLORS[strength] }}
              >
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}

          {/* Confirm Password */}
          <Field
            label="Confirm Password"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                {pwMatch ? (
                  <>
                    <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="1.8" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke={pwNoMatch ? "#ef4444" : "#9d5bf7"} strokeWidth="1.8" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke={pwNoMatch ? "#ef4444" : "#9d5bf7"} strokeWidth="1.8" strokeLinecap="round" />
                  </>
                )}
              </svg>
            }
          >
            <input
              type={showCf ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => touch("confirm")}
              autoComplete="new-password"
              className={`w-full box-border rounded-[11px] border-[1.5px] bg-[#13132b] py-[11px] pl-10 pr-11 text-[13.5px] text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)] ${confirmBorderClass}`}
            />
            <EyeBtn show={showCf} toggle={() => setShowCf((p) => !p)} />
          </Field>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-[9px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] px-3 py-[9px] text-[12.5px] text-red-500 animate-shake">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8" />
                <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center rounded-[11px] border-none bg-gradient-to-br from-[#7c3aed] to-[#9d5bf7] py-[13px] text-[14.5px] font-bold text-white font-[inherit] shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-[transform,box-shadow] duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.55)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="inline-block h-[18px] w-[18px] rounded-full border-[2.5px] border-[rgba(255,255,255,0.3)] border-t-white animate-spin" />
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        {/* Benefits strip */}
        <div className="flex justify-center gap-4 flex-wrap my-[18px]">
          {["Free forever", "No credit card", "Cancel anytime"].map((b) => (
            <span key={b} className="flex items-center gap-1 text-[11px] text-[#8888aa]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="#9d5bf7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </span>
          ))}
        </div>

        {/* Switch to login */}
        <p className="m-0 text-[13.5px] text-[#8888aa] text-center">
          Already have an account?{" "}
          <button
            onClick={onLogin}
            className="bg-transparent border-none text-[#9d5bf7] font-bold cursor-pointer text-[13.5px] font-[inherit] underline decoration-dotted"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#aaaacc]">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 z-10 flex items-center">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function EyeBtn({ show, toggle }) {
  return (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="absolute right-3 flex items-center bg-transparent border-none cursor-pointer p-1 text-[#888]"
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#888" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  );
}