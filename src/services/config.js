/**
 * Runtime configuration — the origin of the Laravel backend.
 * Copy .env.example to .env to override.
 */
export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
}

export const ADMIN_API = `${CONFIG.API_BASE_URL}/api/admin`

export const TOKEN_KEY = 'akwab.admin.token'
export const ADMIN_KEY = 'akwab.admin.user'
