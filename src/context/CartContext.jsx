import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as cartApi from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

const EMPTY = {
  items: [], discounts: [], address: null,
  subtotal: 0, discount: 0, shipping: 0, total: 0, count: 0,
};

/**
 * The cart lives on the server — the same carts/cart_items the dashboard reads,
 * priced by the same discount and shipping engine. Every mutation returns the
 * recalculated cart, so nothing is totalled client-side.
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCart(await cartApi.getCart());
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload once auth settles, and again whenever the account changes — signing
  // in merges the guest cart server-side, so the totals move.
  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, user?.id, refresh]);

  const run = useCallback(async (action) => {
    const next = await action();
    setCart(next);
    return next;
  }, []);

  const value = useMemo(() => ({
    ...cart,
    loading,
    error,
    refresh,
    add: (productId, qty = 1) => run(() => cartApi.addItem(productId, qty)),
    setQty: (productId, qty) => run(() => cartApi.setQty(productId, qty)),
    remove: (productId) => run(() => cartApi.removeItem(productId)),
    clear: () => run(() => cartApi.clearCart()),
    applyCoupon: (code) => run(() => cartApi.applyCoupon(code)),
  }), [cart, loading, error, refresh, run]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
