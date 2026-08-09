import { get, post, del, ensureIdentity } from './http.js';

const withIdentity = (fn) => async (...args) => {
  await ensureIdentity();
  return fn(...args);
};

export const getWishlist = withIdentity(() => get('/wishlist').then((r) => r.data));

/** Returns {in_wishlist, items} — the new state plus the refreshed list. */
export const toggleWishlist = withIdentity((productId) =>
  post('/wishlist/toggle', { product_id: productId }).then((r) => r.data));

export const removeWishlist = withIdentity((productId) =>
  del(`/wishlist/${productId}`).then((r) => r.data));

export const clearWishlist = withIdentity(() => del('/wishlist').then((r) => r.data));
