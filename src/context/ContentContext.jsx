import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getContent } from '../services/contentService.js';
import { useLang } from './LanguageContext.jsx';

const ContentContext = createContext(null);

/**
 * Page content — hero, stats, sale, wholesale, testimonials, about, contact,
 * faq, footer — served by GET /api/content for the active locale.
 *
 * The i18n files keep only UI microcopy (button labels, form fields, validation
 * messages), which is bound to component behaviour rather than editorial copy.
 */
export function ContentProvider({ children }) {
  const { lang } = useLang();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getContent(lang)
      .then((data) => { if (!cancelled) setContent(data ?? {}); })
      .catch((err) => { if (!cancelled) { setError(err); setContent({}); } })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [lang]);

  /**
   * Dotted lookup with a fallback: `c('hero.line1', '')`. Returns the fallback
   * while the request is still in flight, so sections render empty rather than
   * crashing on a missing key.
   */
  const c = useCallback((path, fallback = '') => {
    const value = String(path).split('.').reduce((acc, key) => acc?.[key], content);
    return value === undefined || value === null ? fallback : value;
  }, [content]);

  const value = useMemo(
    () => ({ content, c, loading, error }),
    [content, c, loading, error],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}
