import { useState, useEffect } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts.js';
import ProductCard from '../../components/ProductCard.jsx';
import { SectionHead } from '../../components/SectionHead.jsx';

const PAGE_SIZE = 4;

export default function ProductsSection() {
  const [cat,     setCat]     = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const cats                  = useCategories();
  const { data, loading }     = useProducts(cat);

  /* لما تتغير التاب ارجع للـ 4 الأوائل */
  useEffect(() => { setVisible(PAGE_SIZE); }, [cat]);

  const tabs    = [{ slug: 'all', name: 'الكل' }, ...cats];
  const shown   = data.slice(0, visible);
  const hasMore = visible < data.length;

  return (
    <section
      id="products"
      className="py-16 rounded-[36px] mx-2 md:mx-6"
      style={{ background: 'var(--tw-bg-opacity, #FAF5E4)' }}
    >
      <div className="akwab-container" style={{ background: '#FAF5E4', borderRadius: 36, padding: 'clamp(40px,5vw,64px) clamp(16px,3vw,32px)' }}>
        <SectionHead
          title="الأكثر مبيعاً"
          desc="قطعٌ اختارتها عميلاتنا — بأعلى التقييمات وأجمل القصص."
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
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-brand h-[460px] animate-pulse" />
              ))
            : shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* زرار المزيد — يظهر بس في تاب الكل ولو في منتجات إضافية */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn btn-outline gap-2 px-8"
            >
              عرض المزيد
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
