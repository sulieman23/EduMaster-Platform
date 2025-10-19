// ...existing code...
import axios from "axios";

const apiClient = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "https://edu-master-psi.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const LS_KEYS = ["token", "authToken", "accessToken", "jwt"];

function readTokenFromLocalStorage() {
  for (const k of LS_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return { token: v, source: `localStorage:${k}` };
  }
  return null;
}

function readTokenFromCookies() {
  const match = document.cookie.match(new RegExp('(?:^|; )token=([^;]*)'));
  if (match) return { token: decodeURIComponent(match[1]), source: "cookie:token" };
  return null;
}

function maskToken(t) {
  if (!t) return "";
  if (t.length < 12) return `${t.slice(0, 6)}...`;
  return `${t.slice(0, 6)}...${t.slice(-4)}`;
}

// ...existing code...
// Attach Bearer token automatically and log (masked) for debugging
apiClient.interceptors.request.use(
  (config) => {
    try {
      const fromLS = readTokenFromLocalStorage();
      const fromCookie = readTokenFromCookies();
      const tokenObj = fromLS || fromCookie || (window.__AUTH_TOKEN ? { token: window.__AUTH_TOKEN, source: "__AUTH_TOKEN" } : null);
      const token = tokenObj?.token || null;

      // If this request explicitly requires auth but there is no token, abort before sending
      if (config.requiresAuth && !token) {
        const err = new Error('Skipping protected request: no auth token present');
        err.code = 'UNAUTH_SKIP';
        // Provide context for callers
        console.warn('[apiClient] requiresAuth but no token, skipping request to', config?.url);
        throw err;
      }

      // Ensure headers object exists
      config.headers = config.headers || {};

      if (token) {
        // Primary header (recommended)
        if (!config.headers["Authorization"]) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Duplicate common alternatives some backends expect
        config.headers["x-access-token"] = token;
        config.headers["token"] = token;

        console.log(
          "[apiClient] Authorization header set:",
          "Bearer",
          maskToken(token),
          "| headers keys:",
          Object.keys(config.headers).join(", "),
          "| source:",
          tokenObj.source
        );
      } else {
        // Remove any stale auth headers
        delete config.headers.Authorization;
        delete config.headers["x-access-token"];
        delete config.headers["token"];
        console.log("[apiClient] No JWT token found — Authorization header not set");
      }

      // debug: short request info
      console.debug("[apiClient] Request:", (config.method || "GET").toUpperCase(), config.url);
    } catch (e) {
      console.error("[apiClient] request interceptor error", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response handling: log and handle 401
apiClient.interceptors.response.use(
  (resp) => resp,
  (err) => {
    try {
      const status = err?.response?.status;
      console.error("[apiClient] Response error:", status, err?.message, err?.response?.data);
      // Do NOT clear tokens automatically on 401; let UI/route guards decide what to do.
      // This prevents unintended logouts caused by a single unauthorized endpoint.
    } catch (e) {
      console.error("[apiClient] response interceptor error", e);
    }
    return Promise.reject(err);
  }
);

// Helper to set token programmatically (useful after login)
export function setAuthToken(token, key = "token") {
  if (token) localStorage.setItem(key, token);
  else LS_KEYS.forEach((k) => localStorage.removeItem(k));
}

export default apiClient;
// ...existing code...