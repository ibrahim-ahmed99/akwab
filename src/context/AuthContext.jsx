import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../services/auth'
import { setToken, clearToken, getToken } from '../services/http'
import { ADMIN_KEY } from '../services/config'

const AuthContext = createContext(null)

const readCachedAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const cacheAdmin = (admin) => {
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)) } catch {}
}

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(readCachedAdmin)
  // Boot in a loading state only when there is a token worth verifying.
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return

    let cancelled = false

    // The cached admin renders immediately; this confirms the token is still
    // valid server-side and refreshes the profile.
    authApi.me()
      .then(res => {
        if (cancelled) return
        setAdmin(res.data)
        cacheAdmin(res.data)
      })
      .catch(() => {
        if (cancelled) return
        clearToken()
        setAdmin(null)
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    setToken(res.data.token)
    setAdmin(res.data.admin)
    cacheAdmin(res.data.admin)
    return res.data.admin
  }

  const logout = async () => {
    // Clear locally even if the revoke call fails — the session is over either way.
    try { await authApi.logout() } catch {}
    clearToken()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
