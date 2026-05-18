import { api } from '../api.js';

/**
 * REST adapter — used when VITE_DATA_MODE=api.
 *
 * Expected server contract:
 *   GET /api/products?category=pottery   → Product[]
 *   GET /api/products/:id                → Product
 *   GET /api/categories                  → Category[]
 *   GET /api/products/featured           → Product[]
 */

export async function getProducts(category) {
  const params = category && category !== 'all' ? { category } : {};
  return api.get('/api/products', { params });
}

export async function getProductById(id) {
  return api.get(`/api/products/${encodeURIComponent(id)}`);
}

export async function getCategories() {
  return api.get('/api/categories');
}

export async function getFeatured() {
  return api.get('/api/products/featured');
}
