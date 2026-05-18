import { useParams, Link } from 'react-router-dom';
import { useProducts, useCategories } from '../../hooks/useProducts.js';
import ProductCard from '../../components/ProductCard.jsx';
import { SectionHead } from '../../components/SectionHead.jsx';

export default function Category() {
  const { slug } = useParams();
  const { data, loading } = useProducts(slug);
  const cats = useCategories();
  const current = cats.find((c) => c.slug === slug);

  return (
    <section className="py-12">
      <div className="akwab-container">
        <SectionHead
          kicker="الفئة"
          title={current?.name || slug}
          desc={current?.desc}
        />

        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-brand h-[460px] animate-pulse" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-ink-soft mb-4">لا توجد منتجات في هذه الفئة بعد.</p>
              <Link to="/shop" className="btn btn-outline">عودة للمتجر</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
