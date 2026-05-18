import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'akwab.wishlist.v1';
const WishlistContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.payload || { items: [] };
    case 'toggle': {
      const exists = state.items.some(i => i.id === action.product.id);
      return {
        items: exists
          ? state.items.filter(i => i.id !== action.product.id)
          : [...state.items, action.product],
      };
    }
    case 'remove':
      return { items: state.items.filter(i => i.id !== action.id) };
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo(() => ({
    items: state.items,
    count: state.items.length,
    has: (id) => state.items.some(i => i.id === id),
    toggle: (product) => dispatch({ type: 'toggle', product }),
    remove: (id) => dispatch({ type: 'remove', id }),
    clear: () => dispatch({ type: 'clear' }),
  }), [state]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
