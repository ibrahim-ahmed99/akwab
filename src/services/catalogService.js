import { get, cleanParams } from './http.js';

/**
 * Read-only catalogue. Public — a token is optional and only makes the API
 * stamp `in_wishlist` on each product.
 */

export const getCategories = () => get('/categories').then((r) => r.data);

export const getProducts = (params = {}) =>
  get('/products', { params: cleanParams(params) }).then((r) => ({
    items: r.data,
    meta: r.meta,
  }));

export const getFeatured = (limit) =>
  get('/products/featured', { params: cleanParams({ limit }) }).then((r) => r.data);

/** Returns {product, related}; `idOrSlug` accepts either. */
export const getProduct = (idOrSlug) =>
  get(`/products/${encodeURIComponent(idOrSlug)}`).then((r) => r.data);
