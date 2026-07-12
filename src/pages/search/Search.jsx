import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as productsService from '../../services/productsService.js';
import ProductCard from '../../components/ProductCard.jsx';
import { toArabicDigits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Search() {
  const { t, lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService.getProducts('all').then(p => {
      setAllProducts(p);
      setLoading(false);
    });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.sub && p.sub.toLowerCase().includes(q))
    );
  }, [query, allProducts]);

  const handleChange = (val) => {
    setQuery(val);
    if (val.trim()) setSearchParams({ q: val }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const fmt = (n) => lang === 'ar' ? toArabicDigits(n) : String(n);
  const quickTags = t('search.quickTags');

  return (
    <section className="py-12">
      <div className="akwab-container">

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 text-center font-cairo">
            {t('search.kicker')}
          </p>
          <h1 className="font-amiri text-4xl text-center mb-6">{t('search.title')}</h1>
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={e => handleChange(e.target.value)}
              placeholder={t('search.placeholder')}
              autoFocus
              className="w-full px-6 py-4 pr-14 rounded-full border-2 border-brand-line focus:border-brand-pink bg-white text-[17px] outline-none transition-colors shadow-brand-sm"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-ink-soft pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            {query && (
              <button
                type="button"
                onClick={() => handleChange('')}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink-soft hover:text-brand-pink transition-colors"
                aria-label={t('search.clear')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick filters */}
          {!query && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleChange(tag)}
                  className="px-4 py-1.5 rounded-full text-sm border border-brand-line bg-white hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink-softer transition-all text-brand-ink-soft"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-brand h-[460px] animate-pulse" />
            ))}
          </div>
        ) : query.trim() === '' ? (
          <PopularSection products={allProducts} />
        ) : results.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            <p className="text-brand-ink-soft mb-6 text-center">
              <span className="font-bold text-brand-ink">{fmt(results.length)}</span> {t('search.resultsFor')} &quot;{query}&quot;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

      </div>
    </section>
  );
}

function PopularSection({ products }) {
  const { t } = useLang();
  const popular = products.filter(p => p.badge?.kind === 'hot').slice(0, 8);
  if (!popular.length) return null;
  return (
    <div>
      <h2 className="text-2xl text-center mb-6 text-brand-ink-soft font-cairo font-medium">
        {t('search.popular')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {popular.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

function EmptyState({ query }) {
  const { t } = useLang();
  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="text-2xl mb-3">{t('search.noResults')} &quot;{query}&quot;</h2>
      <p className="text-brand-ink-soft mb-8 text-sm leading-relaxed">
        {t('search.noResultsTip')}
      </p>
      <Link to="/shop" className="btn btn-primary">{t('search.browseShop')}</Link>
    </div>
  );
}
