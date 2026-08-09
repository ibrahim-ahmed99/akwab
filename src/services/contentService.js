import { get, post } from './http.js';

/**
 * Every page-content section for one locale in a single request — the site
 * needs all of it on first paint anyway.
 */
export const getContent = (locale) =>
  get('/content', { params: { locale } }).then((r) => r.data);

/** The storefront contact form; lands in the dashboard's Messages screen. */
export const sendMessage = (payload) => post('/contact', payload);
