import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts.js';
import ProductCard from '../../components/ProductCard.jsx';
import { SectionHead } from '../../components/SectionHead.jsx';

export default function Shop() {
  const [cat, setCat] = useState('all');
  const cats = useCategories();
  const { data, loading } = useProducts(cat);
  const tabs = [{ slug: 'all', name: 'الكل' }, ...cats];

  return (
    <section className="py-12">
      <div className="akwab-container">
        <SectionHead
          kicker="كل المنتجات"
          title="المتجر"
          desc="تصفحي كل تشكيلاتنا — من الخزف الدافئ إلى البورسلين الراقي."
        />

        <div className="reveal flex flex-wrap gap-2 justify-center mb-10">
          {tabs.map((t) => (
            <button
              key={t.slug}
              onClick={() => setCat(t.slug)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                cat === t.slug
                  ? 'bg-brand-pink text-white shadow-brand-md'
                  : 'bg-white text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink border border-brand-line'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-brand h-[460px] animate-pulse" />
              ))
            : data.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
