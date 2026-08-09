import { get, post, put, del, ensureIdentity } from './http.js';

/**
 * Server-side cart. Every call returns the whole recalculated cart — including
 * shipping and any applied discounts — so the UI never computes totals itself.
 *
 * ensureIdentity() first: a brand-new visitor needs a guest token before the
 * server has anywhere to put their cart.
 */

const withIdentity = (fn) => async (...args) => {
  await ensureIdentity();
  return fn(...args);
};

export const getCart = withIdentity(() => get('/cart').then((r) => r.data));

export const addItem = withIdentity((productId, quantity = 1) =>
  post('/cart/items', { product_id: productId, quantity }).then((r) => r.data));

export const setQty = withIdentity((productId, quantity) =>
  put(`/cart/items/${productId}`, { quantity }).then((r) => r.data));

export const removeItem = withIdentity((productId) =>
  del(`/cart/items/${productId}`).then((r) => r.data));

export const clearCart = withIdentity(() => del('/cart').then((r) => r.data));

export const applyCoupon = withIdentity((code) =>
  post('/cart/coupon', { code }).then((r) => r.data));
