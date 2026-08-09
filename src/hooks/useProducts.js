import { useEffect, useState } from 'react';
import * as catalog from '../services/catalogService.js';

/** Products for a category slug (or 'all'), with loading/error state. */
export function useProducts(category = 'all', extraParams = {}) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialised so an inline object literal doesn't re-trigger every render.
  const paramsKey = JSON.stringify(extraParams);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    catalog
      .getProducts({ category, ...JSON.parse(paramsKey) })
      .then(({ items, meta: m }) => {
        if (cancelled) return;
        setData(items);
        setMeta(m);
      })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [category, paramsKey]);

  return { data, meta, loading, error };
}

export function useCategories() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    catalog.getCategories()
      .then((rows) => { if (!cancelled) setData(rows); })
      .catch(() => { if (!cancelled) setData([]); });
    return () => { cancelled = true; };
  }, []);

  return data;
}

export function useFeatured(limit) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    catalog.getFeatured(limit)
      .then((rows) => { if (!cancelled) setData(rows); })
      .catch(() => { if (!cancelled) setData([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [limit]);

  return { data, loading };
}
