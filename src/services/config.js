/**
 * Runtime configuration — drives which adapter the service layer hits.
 *
 *   VITE_DATA_MODE=static  → reads from local JSON (default; offline-ready)
 *   VITE_DATA_MODE=api     → reads from a REST backend at VITE_API_BASE_URL
 *
 * All values live in .env / .env.local — copy .env.example to get started.
 */
export const CONFIG = {
  DATA_MODE: (import.meta.env.VITE_DATA_MODE || 'static').toLowerCase(),
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
};

export const isStatic = () => CONFIG.DATA_MODE === 'static';
export const isApi = () => CONFIG.DATA_MODE === 'api';
