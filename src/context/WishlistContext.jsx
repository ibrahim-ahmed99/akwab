import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as wishlistApi from '../services/wishlistService.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);

/**
 * Server-side wishlist, keyed to the visitor's identity (guest or account).
 * Signing in merges a guest's saved items into the account.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await wishlistApi.getWishlist());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, user?.id, refresh]);

  const ids = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    loading,
    refresh,
    has: (productId) => ids.has(productId),
    toggle: async (productId) => {
      const res = await wishlistApi.toggleWishlist(productId);
      setItems(res.items);
      return res.in_wishlist;
    },
    remove: async (productId) => setItems(await wishlistApi.removeWishlist(productId)),
    clear: async () => { await wishlistApi.clearWishlist(); setItems([]); },
  }), [items, loading, ids, refresh]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
