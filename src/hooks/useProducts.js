import { useEffect, useState } from 'react';
import * as productsService from '../services/productsService.js';

/** Fetches products for a category (or 'all') with loading/error state. */
export function useProducts(category = 'all') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productsService
      .getProducts(category)
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { data, loading, error };
}

export function useCategories() {
  const [data, setData] = useState([]);
  useEffect(() => {
    productsService.getCategories().then(setData).catch(() => setData([]));
  }, []);
  return data;
}
