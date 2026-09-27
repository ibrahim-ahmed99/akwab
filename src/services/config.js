/**
 * Runtime configuration — the origin of the Laravel backend.
 *
 * The origin is chosen at runtime from the current hostname, so one build serves
 * both environments:
 *   - running on localhost / *.local  → VITE_API_LOCAL_URL  (local backend)
 *   - running anywhere else (online)  → VITE_API_BASE_URL   (production backend)
 */
const LOCAL_URL = import.meta.env.VITE_API_LOCAL_URL || 'http://akwab.local'
const ONLINE_URL = import.meta.env.VITE_API_BASE_URL || 'https://akwab.store'

function isLocalHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    host.endsWith('.local')
  )
}

export const CONFIG = {
  API_BASE_URL: isLocalHost() ? LOCAL_URL : ONLINE_URL,
}

export const ADMIN_API = `${CONFIG.API_BASE_URL}/api/admin`

export const TOKEN_KEY = 'akwab.admin.token'
export const ADMIN_KEY = 'akwab.admin.user'
