// ─── Login.jsx ───────────────────────────────────────────────────
// Drop in src/pages/ (or src/components/auth/) and import wherever you handle routing.
// Usage: <Login onSuccess={(user) => navigate("/dashboard")} onSignup={() => navigate("/signup")} />
// Requires Tailwind CSS v3+ with the following additions to tailwind.config.js:
//   theme: { extend: { animation: { slideUp: "slideUp .45s cubic-bezier(.16,1,.3,1) both", shake: "shake .35s ease", spin: "spin .7s linear infinite" }, keyframes: { slideUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } }, shake: { "0%,100%": { transform: "translateX(0)" }, "25%": { transform: "translateX(-6px)" }, "75%": { transform: "translateX(6px)" } } } } }

import { useState } from "react";
import { login } from "../utils/auth"; // adjust path if needed

export default function Login({ onSuccess, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 380));
    const result = login({ email, password });
    setLoading(false);

    if (result.ok) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0f0f1a] flex items-center justify-center px-[5%] overflow-hidden font-['Sora','Segoe_UI',sans-serif]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-44 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(157,91,247,0.14)_0%,transparent_70%)]" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] rounded-[20px] border border-[rgba(124,58,237,0.25)] bg-[rgba(26,26,46,0.92)] px-10 pt-10 pb-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(124,58,237,0.12)] animate-slideUp">

        {/* Logo row */}
        <div className="flex items-center gap-2.5 mb-7">
          <img className="h-6 aspect-square" src="/favicon.svg" alt="logo" />
          <h1 className="text-2xl font-bold ml-1.5 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]">
            HabitTrack
          </h1>
        </div>

        <h2 className="m-0 mb-1.5 text-[26px] font-extrabold text-[#f0f0ff] tracking-tight">
          Welcome back
        </h2>
        <p className="m-0 mb-7 text-sm text-[#8888aa]">
          Sign in to continue your streak 🔥
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]" noValidate>

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#aaaacc]">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 z-10 flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#9d5bf7" strokeWidth="1.8" />
                  <path d="M2 8l10 6 10-6" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full box-border rounded-[11px] border-[1.5px] border-[rgba(124,58,237,0.22)] bg-[#13132b] py-3 pl-10 pr-3.5 text-sm text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)] autofill:shadow-[inset_0_0_0_1000px_#13132b] [-webkit-text-fill-color:#f0f0ff]"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#aaaacc]">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 z-10 flex items-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9d5bf7" strokeWidth="1.8" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full box-border rounded-[11px] border-[1.5px] border-[rgba(124,58,237,0.22)] bg-[#13132b] py-3 pl-10 pr-11 text-sm text-[#f0f0ff] font-[inherit] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#555577] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                tabIndex={-1}
                className="absolute right-3 flex items-center bg-transparent border-none cursor-pointer p-1 text-[#888]"
              >
                {showPw ? (
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
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-[9px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] px-3 py-2.5 text-[13px] text-red-500 animate-shake">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8" />
                <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center rounded-[11px] border-none bg-gradient-to-br from-[#7c3aed] to-[#9d5bf7] py-[13px] text-[15px] font-bold text-white font-[inherit] shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-[transform,box-shadow] duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.55)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="inline-block h-[18px] w-[18px] rounded-full border-[2.5px] border-[rgba(255,255,255,0.3)] border-t-white animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-[22px] text-center before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-[rgba(124,58,237,0.15)] before:content-['']">
          <span className="relative z-10 bg-[rgba(26,26,46,0.92)] px-3 text-xs text-[#555577]">
            or
          </span>
        </div>

        {/* Switch to signup */}
        <p className="m-0 text-sm text-[#8888aa] text-center">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSignup}
            className="bg-transparent border-none text-[#9d5bf7] font-bold cursor-pointer text-sm font-[inherit] underline decoration-dotted"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}