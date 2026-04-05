const TOKEN_KEY = "healbuddy_token";
const USER_KEY = "healbuddy_user";

/** Base URL: Vite dev proxy uses /api → Flask root */
const base = "https://healbuddy-backend-1yoa.onrender.com";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { Accept: "application/json" };
  const auth = token ?? getToken();
  if (auth) headers.Authorization = `Bearer ${auth}`;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Invalid response" };
    }
  }

  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  register: (payload) => request("/register", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),
  dashboard: () => request("/dashboard"),
  addEntry: (payload) => request("/add-entry", { method: "POST", body: payload }),
  history: (limit = 90) => request(`/history?limit=${limit}`),
};
