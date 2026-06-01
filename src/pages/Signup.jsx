// ─── Signup.jsx ──────────────────────────────────────────────────
// Usage: <Signup onSuccess={(user) => navigate("/dashboard")} onLogin={() => navigate("/login")} />

import { useState, useCallback } from "react";
import { register } from "../utils/auth";   // adjust path if needed

// Password strength calculator
function pwStrength(pw) {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))     score++;
  if (pw.length >= 12)              score++;
  return score; // 0–5
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6"];

export default function Signup({ onSuccess, onLogin }) {
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [touched,   setTouched]   = useState({});

  const strength  = pwStrength(password);
  const strengthW = `${(strength / 5) * 100}%`;
  const pwMatch   = confirm && password === confirm;
  const pwNoMatch = confirm && password !== confirm;

  const touch = key => setTouched(p => ({ ...p, [key]: true }));

  const validate = useCallback(() => {
    if (!name.trim())          return "Please enter your name.";
    if (name.trim().length < 2)return "Name must be at least 2 characters.";
    if (!email.trim())         return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!password)             return "Password is required.";
    if (strength < 2)          return "Password is too weak. Add numbers or symbols.";
    if (password !== confirm)  return "Passwords don't match.";
    return null;
  }, [name, email, password, confirm, strength]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    await new Promise(r => setTimeout(r, 420));
    const result = register({ name, email, password });
    setLoading(false);

    if (result.ok) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

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

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.sub}>Start building powerful habits today</p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Name */}
          <Field label="Full Name" icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#9d5bf7" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }>
            <input style={styles.input} type="text" placeholder="Alex Rivera"
              value={name} onChange={e => setName(e.target.value)}
              onBlur={() => touch("name")} autoComplete="name"
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur2={e => Object.assign(e.target.style, styles.inputBlur)}
            />
          </Field>

          {/* Email */}
          <Field label="Email" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#9d5bf7" strokeWidth="1.8"/><path d="M2 8l10 6 10-6" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onBlur={() => touch("email")} autoComplete="email"
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9d5bf7" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9d5bf7" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }>
            <input style={{ ...styles.input, paddingRight: 44 }}
              type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              onBlur={() => touch("password")} autoComplete="new-password"
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
            />
            <EyeBtn show={showPw} toggle={() => setShowPw(p => !p)} />
          </Field>

          {/* Strength bar */}
          {password.length > 0 && (
            <div style={styles.strengthWrap}>
              <div style={styles.strengthTrack}>
                <div style={{ ...styles.strengthFill, width: strengthW, background: STRENGTH_COLORS[strength], transition: "width .3s, background .3s" }} />
              </div>
              <span style={{ ...styles.strengthLabel, color: STRENGTH_COLORS[strength] }}>
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}

          {/* Confirm password */}
          <Field label="Confirm Password" icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              {pwMatch
                ? <><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="1.8"/></>
                : <><rect x="3" y="11" width="18" height="11" rx="2" stroke={pwNoMatch?"#ef4444":"#9d5bf7"} strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke={pwNoMatch?"#ef4444":"#9d5bf7"} strokeWidth="1.8" strokeLinecap="round"/></>
              }
            </svg>
          }>
            <input style={{ ...styles.input, paddingRight: 44, borderColor: pwNoMatch ? "rgba(239,68,68,0.5)" : pwMatch ? "rgba(34,197,94,0.45)" : "rgba(124,58,237,0.22)" }}
              type={showCf ? "text" : "password"} placeholder="Re-enter password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              onBlur={() => touch("confirm")} autoComplete="new-password"
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
            />
            <EyeBtn show={showCf} toggle={() => setShowCf(p => !p)} />
          </Field>

          {/* Error */}
          {error && (
            <div style={styles.error}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
            onMouseEnter={e => !loading && Object.assign(e.target.style, styles.btnHover)}
            onMouseLeave={e => !loading && Object.assign(e.target.style, styles.btnBase)}>
            {loading ? <span style={styles.spinner} /> : "Create Account →"}
          </button>
        </form>

        {/* Benefits strip */}
        <div style={styles.benefits}>
          {["Free forever", "No credit card", "Cancel anytime"].map(b => (
            <span key={b} style={styles.benefit}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#9d5bf7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {b}
            </span>
          ))}
        </div>

        <p style={styles.switchRow}>
          Already have an account?{" "}
          <button onClick={onLogin} style={styles.link}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function Field({ label, icon, children }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <span style={styles.inputIcon}>{icon}</span>
        {children}
      </div>
    </div>
  );
}

function EyeBtn({ show, toggle }) {
  return (
    <button type="button" onClick={toggle} style={styles.eyeBtn} tabIndex={-1}>
      {show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#888" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="1.8"/></svg>
      }
    </button>
  );
}

/* ─── STYLES ──────────────────────────────────────────────────── */
const styles = {
  root: {
    minHeight: "100vh", background: "#0f0f1a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    position: "relative", overflow: "hidden", padding: "24px 0",
  },
  orb1: { position:"absolute", width:480, height:480, borderRadius:"50%", top:-160, left:-180, background:"radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)", pointerEvents:"none" },
  orb2: { position:"absolute", width:350, height:350, borderRadius:"50%", bottom:-120, right:-100, background:"radial-gradient(circle, rgba(157,91,247,0.12) 0%, transparent 70%)", pointerEvents:"none" },
  orb3: { position:"absolute", width:300, height:300, borderRadius:"50%", bottom:"30%", left:-60, background:"radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", pointerEvents:"none" },
  card: {
    background: "rgba(26,26,46,0.94)", border: "1px solid rgba(124,58,237,0.22)",
    borderRadius: 22, padding: "36px 38px 28px", width:"100%", maxWidth: 430,
    boxSizing: "border-box", position: "relative", backdropFilter: "blur(14px)",
    boxShadow: "0 28px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,58,237,0.1) inset",
    animation: "slideUp .45s cubic-bezier(.16,1,.3,1) both",
  },
  logoRow:   { display:"flex", alignItems:"center", gap:10, marginBottom:24 },
  logoIcon:  { width:34, height:34, borderRadius:8, background:"linear-gradient(135deg,#7c3aed,#9d5bf7)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(124,58,237,0.45)" },
  logoText:  { fontSize:19, fontWeight:800, color:"#f0f0ff", letterSpacing:-0.5 },
  logoAccent:{ color:"#9d5bf7" },
  heading:   { margin:"0 0 5px", fontSize:24, fontWeight:800, color:"#f0f0ff", letterSpacing:-0.5 },
  sub:       { margin:"0 0 24px", fontSize:13, color:"#8888aa" },
  form:      { display:"flex", flexDirection:"column", gap:14 },
  fieldGroup:{ display:"flex", flexDirection:"column", gap:6 },
  label:     { fontSize:11, fontWeight:700, color:"#aaaacc", letterSpacing:0.4, textTransform:"uppercase" },
  inputWrap: { position:"relative", display:"flex", alignItems:"center" },
  inputIcon: { position:"absolute", left:13, display:"flex", alignItems:"center", pointerEvents:"none", zIndex:1 },
  input: {
    width:"100%", boxSizing:"border-box", background:"#13132b",
    border:"1.5px solid rgba(124,58,237,0.22)", borderRadius:11,
    padding:"11px 14px 11px 40px", color:"#f0f0ff", fontSize:13.5, outline:"none",
    fontFamily:"inherit", transition:"border-color .18s, box-shadow .18s",
  },
  inputFocus:{ borderColor:"#7c3aed", boxShadow:"0 0 0 3px rgba(124,58,237,0.18)" },
  inputBlur: { borderColor:"rgba(124,58,237,0.22)", boxShadow:"none" },
  eyeBtn:    { position:"absolute", right:12, background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center" },
  strengthWrap: { display:"flex", alignItems:"center", gap:10, marginTop:-6 },
  strengthTrack:{ flex:1, height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" },
  strengthFill: { height:"100%", borderRadius:2 },
  strengthLabel:{ fontSize:11, fontWeight:700, minWidth:72 },
  error: {
    display:"flex", alignItems:"center", gap:8,
    background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)",
    borderRadius:9, padding:"9px 12px", fontSize:12.5, color:"#ef4444",
    animation:"shake .35s ease",
  },
  btn: {
    background:"linear-gradient(135deg,#7c3aed 0%,#9d5bf7 100%)",
    border:"none", borderRadius:11, padding:"13px 0",
    color:"#fff", fontSize:14.5, fontWeight:700, cursor:"pointer",
    marginTop:4, width:"100%", boxShadow:"0 4px 20px rgba(124,58,237,0.4)",
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"transform .15s, box-shadow .15s", fontFamily:"inherit",
  },
  btnBase:    { transform:"translateY(0)",   boxShadow:"0 4px 20px rgba(124,58,237,0.4)" },
  btnHover:   { transform:"translateY(-2px)", boxShadow:"0 8px 28px rgba(124,58,237,0.55)" },
  btnDisabled:{ opacity:0.7, cursor:"not-allowed" },
  spinner:    { width:18, height:18, border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" },
  benefits:   { display:"flex", justifyContent:"center", gap:16, margin:"18px 0 16px", flexWrap:"wrap" },
  benefit:    { display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#8888aa" },
  switchRow:  { margin:0, fontSize:13.5, color:"#8888aa", textAlign:"center" },
  link:       { background:"none", border:"none", color:"#9d5bf7", fontWeight:700, cursor:"pointer", fontSize:13.5, fontFamily:"inherit", textDecoration:"underline", textDecorationStyle:"dotted" },
};

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
