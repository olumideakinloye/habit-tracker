// ─── Login.jsx ───────────────────────────────────────────────────
// Drop in src/pages/ (or src/components/auth/) and import wherever you handle routing.
// Usage: <Login onSuccess={(user) => navigate("/dashboard")} onSignup={() => navigate("/signup")} />

import { useState } from "react";
import { login } from "../utils/auth";   // adjust path if needed

export default function Login({ onSuccess, onSignup }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim())    return setError("Email is required.");
    if (!password)        return setError("Password is required.");

    setLoading(true);
    // Tiny artificial delay so it feels real
    await new Promise(r => setTimeout(r, 380));
    const result = login({ email, password });
    setLoading(false);

    if (result.ok) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
    }
  }

  return (
    <div style={styles.root}>
      {/* Ambient background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
          <span style={styles.logoText}>Habit<span style={styles.logoAccent}>Track</span></span>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.sub}>Sign in to continue your streak 🔥</p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#9d5bf7" strokeWidth="1.8"/>
                  <path d="M2 8l10 6 10-6" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                onFocus={e  => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e   => Object.assign(e.target.style, styles.inputBlur)}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9d5bf7" strokeWidth="1.8"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                style={{ ...styles.input, paddingRight: 44 }}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                onFocus={e  => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e   => Object.assign(e.target.style, styles.inputBlur)}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={styles.eyeBtn} tabIndex={-1}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#888" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="1.8"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.error}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" style={styles.btn} disabled={loading}
            onMouseEnter={e => !loading && Object.assign(e.target.style, styles.btnHover)}
            onMouseLeave={e => !loading && Object.assign(e.target.style, styles.btnBase)}>
            {loading
              ? <span style={styles.spinner}/>
              : "Sign In"
            }
          </button>
        </form>

        <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

        <p style={styles.switchRow}>
          Don't have an account?{" "}
          <button onClick={onSignup} style={styles.link}>Create one</button>
        </p>
      </div>
    </div>
  );
}

/* ─── STYLES ──────────────────────────────────────────────────── */
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0f0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "absolute", width: 500, height: 500,
    borderRadius: "50%", top: -180, left: -160,
    background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute", width: 400, height: 400,
    borderRadius: "50%", bottom: -140, right: -120,
    background: "radial-gradient(circle, rgba(157,91,247,0.14) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(26,26,46,0.92)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: 20,
    padding: "40px 40px 32px",
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box",
    position: "relative",
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.12) inset",
    animation: "slideUp .45s cubic-bezier(.16,1,.3,1) both",
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 28,
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 9,
    background: "linear-gradient(135deg, #7c3aed, #9d5bf7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
  },
  logoText: { fontSize: 20, fontWeight: 800, color: "#f0f0ff", letterSpacing: -0.5 },
  logoAccent: { color: "#9d5bf7" },
  heading: { margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#f0f0ff", letterSpacing: -0.5 },
  sub: { margin: "0 0 28px", fontSize: 14, color: "#8888aa" },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 7 },
  label: { fontSize: 12, fontWeight: 700, color: "#aaaacc", letterSpacing: 0.4, textTransform: "uppercase" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: 13, display: "flex", alignItems: "center",
    pointerEvents: "none", zIndex: 1,
  },
  input: {
    width: "100%", boxSizing: "border-box",
    background: "#13132b",
    border: "1.5px solid rgba(124,58,237,0.22)",
    borderRadius: 11, padding: "12px 14px 12px 40px",
    color: "#f0f0ff", fontSize: 14, outline: "none",
    fontFamily: "inherit", transition: "border-color .18s, box-shadow .18s",
  },
  inputFocus: { borderColor: "#7c3aed", boxShadow: "0 0 0 3px rgba(124,58,237,0.18)" },
  inputBlur:  { borderColor: "rgba(124,58,237,0.22)", boxShadow: "none" },
  eyeBtn: {
    position: "absolute", right: 12, background: "none", border: "none",
    cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#888",
  },
  error: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#ef4444",
    animation: "shake .35s ease",
  },
  btn: {
    ...{}, // spread placeholder
    background: "linear-gradient(135deg, #7c3aed 0%, #9d5bf7 100%)",
    border: "none", borderRadius: 11, padding: "13px 0",
    color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
    marginTop: 4, width: "100%",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "transform .15s, box-shadow .15s",
    fontFamily: "inherit",
  },
  btnBase:  { transform: "translateY(0)",  boxShadow: "0 4px 20px rgba(124,58,237,0.4)" },
  btnHover: { transform: "translateY(-2px)", boxShadow: "0 8px 28px rgba(124,58,237,0.55)" },
  spinner: {
    width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin .7s linear infinite", display: "inline-block",
  },
  divider: {
    position: "relative", textAlign: "center", margin: "22px 0 18px",
  },
  dividerText: {
    background: "rgba(26,26,46,0.92)", padding: "0 12px",
    fontSize: 12, color: "#555577", position: "relative", zIndex: 1,
  },
  switchRow: { margin: 0, fontSize: 14, color: "#8888aa", textAlign: "center" },
  link: {
    background: "none", border: "none", color: "#9d5bf7",
    fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit",
    textDecoration: "underline", textDecorationStyle: "dotted",
  },
};

// Inject keyframe animations once
if (typeof document !== "undefined" && !document.getElementById("habittrack-auth-css")) {
  const sheet = document.createElement("style");
  sheet.id = "habittrack-auth-css";
  sheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    @keyframes slideUp  { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    @keyframes spin     { to { transform:rotate(360deg) } }
    input:-webkit-autofill { -webkit-box-shadow:0 0 0 1000px #13132b inset !important; -webkit-text-fill-color:#f0f0ff !important; }
  `;
  document.head.appendChild(sheet);
}
