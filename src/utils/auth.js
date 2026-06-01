// ─── auth.js ─────────────────────────────────────────────────────
// Handles user registration, login, session, and localStorage persistence.
// Drop this alongside Login.jsx / Signup.jsx in your src/ folder.

const USERS_KEY = "habittrack_users";
const SESSION_KEY = "habittrack_session";

// ── helpers ──────────────────────────────────────────────────────
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── public API ───────────────────────────────────────────────────

/**
 * Register a new user.
 * Returns { ok: true, user } or { ok: false, error: string }
 */
export function register({ name, email, password }) {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password, // plain-text — fine for a local demo
    createdAt: new Date().toISOString(),
    habits: [],
  };
  saveUsers([...users, user]);
  _startSession(user);
  return { ok: true, user: _sanitize(user) };
}

/**
 * Log in with email + password.
 * Returns { ok: true, user } or { ok: false, error: string }
 */
export function login({ email, password }) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user) return { ok: false, error: "No account found with that email." };
  if (user.password !== password)
    return { ok: false, error: "Incorrect password." };
  _startSession(user);
  return { ok: true, user: _sanitize(user) };
}

/**
 * Sign out the current user.
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Returns the currently logged-in user (sanitized), or null.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    return user ? _sanitize(user) : null;
  } catch {
    return null;
  }
}

/**
 * Returns true if a session is active.
 */
export function isLoggedIn() {
  return !!getSession();
}

// ── internal ─────────────────────────────────────────────────────
function _startSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
}
function _sanitize({ password: _pw, ...rest }) {
  // never expose password
  return rest;
}

export function getRawUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
export function saveRawUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
/**
 * Patch a user record in the users array by id.
 * Returns the updated sanitised user (no password) or null.
 */
export function updateStoredUser(id, patch) {
  const users = getRawUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  saveRawUsers(users);
  const { password: _pw, ...safe } = users[idx];
  return safe;
}
/**
 * Return the raw (including password) record for the logged-in user.
 * Needed for current-password verification.
 */
export function getRawCurrentUser(id) {
  return getRawUsers().find((u) => u.id === id) ?? null;
}
