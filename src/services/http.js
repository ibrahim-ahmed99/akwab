import axios from 'axios';
import { STOREFRONT_API, TOKEN_KEY, USER_KEY } from './config.js';

/**
 * The one axios instance every storefront request goes through.
 *
 * Identity is a Sanctum bearer token. A visitor who has never signed up still
 * gets one — POST /auth/guest mints an anonymous user so the cart and wishlist
 * can live on the server before signup, and signing in later merges them.
 */
export const http = axios.create({
  baseURL: STOREFRONT_API,
  timeout: 20_000,
});

/* ─── token storage ─── */
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const setToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};

/* ─── request: attach the bearer token ─── */
http.interceptors.request.use((config) => {
  config.headers.Accept = 'application/json';

  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) delete config.headers['Content-Type'];

  return config;
});

/* ─── response: unwrap the envelope, normalise errors ─── */
http.interceptors.response.use(
  // The whole {status, message, data, meta?} envelope — callers need meta too.
  (res) => res.data,
  (err) => {
    const status = err.response?.status;
    const body = err.response?.data ?? {};

    // A dead or revoked token should not strand the visitor: drop it so the
    // next call can mint a fresh guest identity.
    if (status === 401 && !err.config?.skipAuthReset) clearToken();

    const error = new Error(body.message || messageFor(status));
    error.status = status;
    error.errors = body.errors ?? null;
    return Promise.reject(error);
  },
);

function messageFor(status) {
  switch (status) {
    case 401: return 'انتهت الجلسة، حاول مرة أخرى';
    case 403: return 'ليس لديك صلاحية لهذا الإجراء';
    case 404: return 'العنصر غير موجود';
    case 422: return 'بيانات غير صالحة';
    case 429: return 'محاولات كثيرة، حاول بعد قليل';
    case undefined: return 'تعذّر الاتصال بالخادم';
    default: return 'حدث خطأ غير متوقع';
  }
}

/**
 * Guarantees the caller has an identity before a cart/wishlist/order call.
 *
 * Concurrent callers share one in-flight request — otherwise a page that hits
 * the cart and the wishlist at once would mint two guests and split the state
 * between them.
 */
let guestRequest = null;

export async function ensureIdentity() {
  const existing = getToken();
  if (existing) return existing;

  if (!guestRequest) {
    guestRequest = http
      .post('/auth/guest', {}, { skipAuthReset: true })
      .then((res) => {
        setToken(res.data.token);
        return res.data.token;
      })
      .finally(() => { guestRequest = null; });
  }

  return guestRequest;
}

/* ─── verbs ─── */
export const get = (url, config) => http.get(url, config);
export const post = (url, body, config) => http.post(url, body, config);
export const put = (url, body, config) => http.put(url, body, config);
export const del = (url, config) => http.delete(url, config);

/** Drops empty values so we never send `?category=&search=`. */
export const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined),
  );
