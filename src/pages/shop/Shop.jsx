import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts.js';
import ProductCard from '../../components/ProductCard.jsx';
import { SectionHead } from '../../components/SectionHead.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Shop() {
  const { t } = useLang();
  const [cat, setCat] = useState('all');
  const cats = useCategories();
  // 60 is the API's per_page ceiling — the shop shows everything on one page.
  const { data, loading, error } = useProducts(cat, { per_page: 60 });
  const tabs = [{ slug: 'all', name: t('shop.all') }, ...cats];

  return (
    <section className="py-12">
      <div className="akwab-container">
        <SectionHead
          kicker={t('shop.kicker')}
          title={t('shop.title')}
          desc={t('shop.desc')}
        />

        <div className="reveal flex flex-wrap gap-2 justify-center mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setCat(tab.slug)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                cat === tab.slug
                  ? 'bg-brand-pink text-white shadow-brand-md'
                  : 'bg-white text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink border border-brand-line'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center text-[#D64545] py-10">{error.message}</p>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-brand h-[420px] animate-pulse" />
                ))
              : data.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="text-center text-brand-ink-soft py-16">{t('shop.empty')}</p>
        )}
      </div>
    </section>
  );
}
