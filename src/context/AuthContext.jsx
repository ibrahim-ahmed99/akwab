import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authApi from '../services/authService.js';
import { setToken, clearToken, getToken, ensureIdentity } from '../services/http.js';
import { USER_KEY } from '../services/config.js';

const AuthContext = createContext(null);

const readCached = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const cache = (user) => {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
};

export function AuthProvider({ children }) {
  // `account` is a real signed-up user; a guest identity is deliberately not
  // one, so `user` stays null and the UI keeps offering "log in".
  const [account, setAccount] = useState(readCached);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Give every visitor an identity so the cart and wishlist work before
        // signup; this is a no-op when a token already exists.
        await ensureIdentity();
        const user = await authApi.me();

        if (cancelled) return;

        if (user.is_guest) {
          setAccount(null);
          try { localStorage.removeItem(USER_KEY); } catch {}
        } else {
          setAccount(user);
          cache(user);
        }
      } catch {
        if (!cancelled) setAccount(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const adopt = useCallback((payload) => {
    setToken(payload.token);
    setAccount(payload.user);
    cache(payload.user);
    return payload.user;
  }, []);

  const login = useCallback(async (credential, password) =>
    adopt(await authApi.login(credential, password)), [adopt]);

  const register = useCallback(async (payload) =>
    adopt(await authApi.register(payload)), [adopt]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch {}
    clearToken();
    setAccount(null);
    // Straight back to a fresh guest identity so browsing keeps working.
    await ensureIdentity().catch(() => {});
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const user = await authApi.updateProfile(payload);
    setAccount(user);
    cache(user);
    return user;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: account,
        loading,
        hasIdentity: Boolean(getToken()),
        login,
        register,
        logout,
        updateProfile,
        updatePassword: authApi.updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
