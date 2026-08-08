import { post, get } from './http'

export const login  = (email, password) => post('/login', { email, password })
export const logout = ()                => post('/logout')

/** skipAuthRedirect: a stale token on boot should log out quietly, not bounce. */
export const me = () => get('/me', { skipAuthRedirect: true })
