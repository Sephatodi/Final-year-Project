import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

// Prefer a same-origin relative API base so the PWA works with its own backend,
// then fall back to the deployed API host. Configurable via VITE_API_URL.
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://final-year-project-s9va.onrender.com/api';

// Local (offline) credential store. The document requires the system to work
// offline and to require authentication. When the backend is unreachable we
// authenticate against a device-local credential store so farmers can keep
// working and sync their account when connectivity returns.
const LOCAL_USERS_KEY = 'farmaid_local_users';
const PENDING_SYNC_KEY = 'farmaid_pending_account_sync';

// Small, dependency-free hash (djb2) for at-rest obfuscation of the offline PIN
// password. This is NOT a substitute for server-side bcrypt; it only protects
// the local offline cache. Real security is enforced by the backend over HTTPS.
function hashPassword(text) {
  let hash = 5381;
  const str = `farmaid::${text}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function queueAccountSync(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(PENDING_SYNC_KEY)) || [];
    queue.push({ ...payload, queuedAt: new Date().toISOString() });
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
  } catch {
    /* ignore */
  }
}

// Seed the demo accounts advertised on the Login screen so the documented
// credentials work out of the box (matches TEST_USERS_CREDENTIALS). These are
// created locally only when the device has no accounts yet. They can be synced
// to the server later; the server remains the source of truth when reachable.
const DEMO_ACCOUNTS = [
  { name: 'Demo Farmer', email: 'farmer@example.com', password: 'Test123!', role: 'farmer', phone: '+26771000001', farmName: 'Demo Farm' },
  { name: 'Dr. Demo Vet', email: 'expert@example.com', password: 'Test123!', role: 'veterinarian', phone: '+26771000002', farmName: '' },
  { name: 'Demo Admin', email: 'admin@example.com', password: 'Test123!', role: 'admin', phone: '+26771000003', farmName: '' },
];

function seedDemoAccounts() {
  try {
    if (localStorage.getItem('farmaid_demo_seeded')) return;
    const users = readLocalUsers();
    let added = false;
    DEMO_ACCOUNTS.forEach((acct) => {
      if (!users[acct.email]) {
        users[acct.email] = {
          userId: `demo-${acct.role}`,
          name: acct.name,
          role: acct.role,
          phone: acct.phone,
          farmName: acct.farmName,
          passwordHash: hashPassword(acct.password),
          createdAt: new Date().toISOString(),
          synced: false,
          demo: true,
        };
        added = true;
      }
    });
    if (added) writeLocalUsers(users);
    localStorage.setItem('farmaid_demo_seeded', '1');
  } catch {
    /* ignore seeding failures */
  }
}

async function postJson(path, body, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timer);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDemoAccounts();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser({ ...storedUser, token });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (token, userData) => {
    const normalized = {
      userId: userData.userId || userData.id,
      id: userData.id || userData.userId,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'farmer',
      phone: userData.phone,
      farmName: userData.farmName,
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser({ token, ...normalized });
    return normalized;
  };

  const login = async (email, password) => {
    // 1) Try the real backend first.
    try {
      const { ok, data } = await postJson('/auth/login', { email, password });
      if (ok && data.token) {
        const normalized = persistSession(data.token, data.user || { email, role: data.role });
        console.log('User logged in (server):', normalized);
        return { success: true };
      }
      // Backend reachable but rejected credentials -> do not silently fall back.
      if (data && (data.error || data.message)) {
        return { success: false, error: data.error || data.message || 'Login failed' };
      }
    } catch (err) {
      console.warn('Backend login unavailable, trying offline auth:', err?.message);
    }

    // 2) Offline fallback: authenticate against the device-local store.
    const users = readLocalUsers();
    const record = users[email];
    if (record && record.passwordHash === hashPassword(password)) {
      const sessionToken = `offline.${btoa(email)}.${Date.now()}`;
      persistSession(sessionToken, {
        userId: record.userId,
        email,
        name: record.name,
        role: record.role,
        phone: record.phone,
        farmName: record.farmName,
      });
      return { success: true };
    }

    return {
      success: false,
      error: record
        ? 'Incorrect password. Please try again.'
        : 'No account found on this device and the server is unreachable. Please connect once to register.',
    };
  };

  const register = async (formData) => {
    // 1) Try the real backend first.
    try {
      const { ok, data } = await postJson('/auth/register', formData);
      if (ok && (data.token || data.user)) {
        const token = data.token || `server.${btoa(formData.email)}.${Date.now()}`;
        persistSession(token, data.user || { ...formData, userId: data.userId });
        console.log('User registered (server)');
        return { success: true };
      }
      if (data && (data.error || data.message)) {
        // A duplicate-email style error should surface to the user.
        return { success: false, error: data.error || data.message || 'Registration failed' };
      }
    } catch (err) {
      console.warn('Backend registration unavailable, creating offline account:', err?.message);
    }

    // 2) Offline fallback: create a device-local account.
    const users = readLocalUsers();
    if (users[formData.email]) {
      return { success: false, error: 'An account with this email already exists on this device.' };
    }
    const userId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    users[formData.email] = {
      userId,
      name: formData.name,
      role: formData.role || 'farmer',
      phone: formData.phone,
      farmName: formData.farmName,
      passwordHash: hashPassword(formData.password),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    writeLocalUsers(users);

    // Queue for later synchronization with the server.
    queueAccountSync({
      userId,
      name: formData.name,
      email: formData.email,
      role: formData.role || 'farmer',
      phone: formData.phone,
      farmName: formData.farmName,
    });

    const sessionToken = `offline.${btoa(formData.email)}.${Date.now()}`;
    persistSession(sessionToken, users[formData.email]);
    console.log('User registered (offline, queued for sync)');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);