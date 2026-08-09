import { get, post, cleanParams, ensureIdentity } from './http.js';

const withIdentity = (fn) => async (...args) => {
  await ensureIdentity();
  return fn(...args);
};

export const getOrders = withIdentity((params = {}) =>
  get('/orders', { params: cleanParams(params) }).then((r) => ({ items: r.data, meta: r.meta })));

export const getOrder = withIdentity((id) => get(`/orders/${id}`).then((r) => r.data));

/**
 * Turns the current cart into an order. Pass either `address_id` for a saved
 * address or the full name/phone/address/city_id for a new one.
 */
export const placeOrder = withIdentity((payload) =>
  post('/orders', payload).then((r) => r.data));

export const getAddresses = withIdentity(() => get('/addresses').then((r) => r.data));

export const getCities = () => get('/cities').then((r) => r.data);

/** Uploads a transfer receipt (InstaPay / wallet) and returns its filename. */
export const uploadReceipt = withIdentity((file) => {
  const body = new FormData();
  body.append('file', file);
  return post('/orders/receipt', body).then((r) => r.data.path);
});
