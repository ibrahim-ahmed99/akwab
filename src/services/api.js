import axios from 'axios';
import { CONFIG } from './config.js';

/**
 * Thin axios wrapper — only constructed when DATA_MODE === 'api'.
 * Backend is expected to expose:
 *   GET /api/products            ?category=pottery
 *   GET /api/products/:id
 *   GET /api/categories
 *   GET /api/products/featured
 */
export const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Simple response unwrapper — backends often wrap in { data: [...] }
api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    console.error('[api] request failed:', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
