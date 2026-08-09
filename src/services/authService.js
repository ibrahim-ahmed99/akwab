import { get, post, put } from './http.js';

export const guest = () => post('/auth/guest', {}).then((r) => r.data);

export const register = (payload) => post('/auth/register', payload).then((r) => r.data);

/** `credential` is either an email or a phone — the storefront has one field. */
export const login = (credential, password) =>
  post('/auth/login', { credential, password }).then((r) => r.data);

export const logout = () => post('/auth/logout', {});

export const me = () => get('/auth/me', { skipAuthReset: true }).then((r) => r.data);

export const updateProfile = (payload) => put('/auth/profile', payload).then((r) => r.data);

export const updatePassword = (currentPassword, password, passwordConfirmation) =>
  put('/auth/password', {
    current_password: currentPassword,
    password,
    password_confirmation: passwordConfirmation,
  });
