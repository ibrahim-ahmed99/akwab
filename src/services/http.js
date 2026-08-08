import axios from 'axios'
import { ADMIN_API, TOKEN_KEY, ADMIN_KEY } from './config'

/**
 * Single axios instance for every /api/admin call.
 *
 * The bearer token is injected here rather than at each call site — this is the
 * client-side half of the API's `auth:admins_api` guard: no token, no request.
 */
export const http = axios.create({
  baseURL: ADMIN_API,
  timeout: 20_000,
})

/* ─── token storage ─── */
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export const setToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
  } catch {}
}

/* ─── request: attach the bearer token ─── */
http.interceptors.request.use(config => {
  config.headers.Accept = 'application/json'

  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  // FormData sets its own multipart boundary — never override it.
  if (config.data instanceof FormData) delete config.headers['Content-Type']

  return config
})

/* ─── response: unwrap the envelope, normalise errors ─── */
http.interceptors.response.use(
  // Returns the full {status, message, data, meta?, links?} envelope so callers
  // can read pagination meta, not just data.
  res => res.data,
  err => {
    const status = err.response?.status
    const body   = err.response?.data ?? {}

    if (status === 401 && !err.config?.skipAuthRedirect) {
      clearToken()
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    const error = new Error(body.message || messageFor(status))
    error.status = status
    error.errors = body.errors ?? null
    return Promise.reject(error)
  },
)

function messageFor(status) {
  switch (status) {
    case 401: return 'انتهت الجلسة، سجّل الدخول مرة أخرى'
    case 403: return 'ليس لديك صلاحية لهذا الإجراء'
    case 404: return 'العنصر غير موجود'
    case 422: return 'بيانات غير صالحة'
    case 429: return 'محاولات كثيرة، حاول بعد قليل'
    case undefined: return 'تعذّر الاتصال بالخادم'
    default: return 'حدث خطأ غير متوقع'
  }
}

/* ─── verbs ─── */
export const get   = (url, config)       => http.get(url, config)
export const post  = (url, body, config) => http.post(url, body, config)
export const put   = (url, body, config) => http.put(url, body, config)
export const patch = (url, body, config) => http.patch(url, body, config)
export const del   = (url, config)       => http.delete(url, config)

/** Drops empty strings/null so we never send `?search=&status=` to the API. */
export const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined),
  )
