/**
 * UMGORIA — Frontend API Client
 * File ini WAJIB ada. Berisi semua komunikasi ke backend PHP.
 */

// Path ke backend — relatif dari html/index.html
const API_BASE = '../backend/api.php';

// ── Token & user storage ──────────────────────────────────────
const TokenStore = {
  get() {
    const token = localStorage.getItem('umgoria_token') || localStorage.getItem('nexa_token');
    if (token) localStorage.setItem('umgoria_token', token);
    return token;
  },
  set(t) {
    localStorage.setItem('umgoria_token', t);
    localStorage.removeItem('nexa_token');
  },
  clear() {
    localStorage.removeItem('umgoria_token');
    localStorage.removeItem('nexa_token');
  },
  getUser() {
    try {
      const user = localStorage.getItem('umgoria_user') || localStorage.getItem('nexa_user');
      if (user) localStorage.setItem('umgoria_user', user);
      return JSON.parse(user || 'null');
    } catch {
      return null;
    }
  },
  setUser(u) {
    localStorage.setItem('umgoria_user', JSON.stringify(u));
    localStorage.removeItem('nexa_user');
  },
  clearUser() {
    localStorage.removeItem('umgoria_user');
    localStorage.removeItem('nexa_user');
  },
};

// ── Base HTTP wrapper ─────────────────────────────────────────
async function apiCall(action, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = TokenStore.get();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const opts = { method, headers };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);

  const res  = await fetch(API_BASE + '?action=' + action, opts);
  const data = await res.json();
  return { ok: res.ok && data.success, status: res.status, ...data };
}

// ── AUTH API ──────────────────────────────────────────────────
const AuthAPI = {
  async register(payload) {
    const r = await apiCall('register', 'POST', payload);
    if (r.ok && r.data && r.data.token) {
      TokenStore.set(r.data.token);
      TokenStore.setUser(r.data);
    }
    return r;
  },

  async login(payload) {
    const r = await apiCall('login', 'POST', payload);
    if (r.ok && r.data && r.data.token) {
      TokenStore.set(r.data.token);
      TokenStore.setUser(r.data);
    }
    return r;
  },

  logout() {
    TokenStore.clear();
    TokenStore.clearUser();
  },

  getUser()    { return TokenStore.getUser(); },
  isLoggedIn() { return !!TokenStore.get(); }
};

// ── FORM API ──────────────────────────────────────────────────
const FormAPI = {
  async submit(answers) {
    return apiCall('submit', 'POST', answers);
  }
};

// ── DASHBOARD API ─────────────────────────────────────────────
const DashboardAPI = {
  async getStats()   { return apiCall('dashboard'); },
  async getUmkmList(opts) {
    opts = opts || {};
    const limit  = opts.limit  || 15;
    const offset = opts.offset || 0;
    const q      = opts.q      || '';
    return apiCall('umkm_list&limit=' + limit + '&offset=' + offset + '&q=' + encodeURIComponent(q));
  },
  async getFactorAverages() { return apiCall('factor_averages'); },
  async getMe()  { return apiCall('me'); }
};
