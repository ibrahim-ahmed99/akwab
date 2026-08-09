/**
 * Runtime configuration. Values live in .env — copy .env.example to start.
 *
 * The API origin is chosen at runtime from the current hostname, so a single
 * build serves both environments:
 *   - running on localhost / *.local  → VITE_API_LOCAL_URL  (local backend)
 *   - running anywhere else (online)  → VITE_API_BASE_URL   (production backend)
 */
const LOCAL_URL = import.meta.env.VITE_API_LOCAL_URL || 'http://akwab.local';
const ONLINE_URL = import.meta.env.VITE_API_BASE_URL || 'https://akwab.store';

function isLocalHost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    host.endsWith('.local')
  );
}

export const CONFIG = {
  API_BASE_URL: isLocalHost() ? LOCAL_URL : ONLINE_URL,
};

export const STOREFRONT_API = `${CONFIG.API_BASE_URL}/api`;

export const TOKEN_KEY = 'akwab.token.v1';
export const USER_KEY = 'akwab.user.v1';
