import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as productsService from '../../services/productsService.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { starsStr } from '../../utils/arabic.js';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setLoading(true);
    productsService.getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="akwab-container py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-white rounded-brand animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-white rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-white rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="akwab-container py-24 text-center">
        <h2 className="text-3xl mb-4">المنتج غير موجود</h2>
        <Link to="/shop" className="btn btn-primary">عودة للمتجر</Link>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="py-12">
      <div className="akwab-container">
        <nav className="text-sm text-brand-ink-soft mb-6 flex gap-2 flex-wrap">
          <Link to="/" className="hover:text-brand-pink">الرئيسية</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-pink">المتجر</Link>
          <span>/</span>
          <span className="text-brand-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          <div className={`relative aspect-square rounded-brand overflow-hidden p-bg-${product.bg || 1}`}>
            {product.badge && (
              <span className={`badge badge-${product.badge.kind}`}>{product.badge.text}</span>
            )}
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl mb-3">{product.name}</h1>
            <p className="text-brand-ink-soft mb-4">{product.sub}</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-brand-gold tracking-wider text-lg">{starsStr(product.rating)}</span>
              <small className="text-brand-ink-soft">({product.reviews} تقييم)</small>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-brand-pink font-bold text-3xl">{product.price}</span>
              {product.oldPrice && (
                <span className="text-lg text-brand-ink-soft line-through">{product.oldPrice}</span>
              )}
            </div>

            <div className="bg-white rounded-brand p-6 mb-6 shadow-brand-sm">
              <h3 className="text-lg mb-3">التفاصيل</h3>
              <ul className="space-y-2 text-sm text-brand-ink-soft">
                <li> صناعة يدوية</li>
                <li> آمن للاستخدام مع الميكروويف</li>
                <li>الشحن خلال من 3 الى 5 أيام عمل غير شامل الجمعة والسبت والاجازات الرسمية </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAdd} className={`btn flex-1 justify-center ${added ? 'btn-gold' : 'btn-primary'}`}>
                {added ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-4 h-4">
                      <path d="m5 12 5 5 9-11" />
                    </svg>
                    تمت الإضافة
                  </>
                ) : 'أضف للسلة'}
              </button>
              <button
                onClick={() => toggle(product)}
                className={`btn ${has(product.id) ? 'btn-primary' : 'btn-outline'}`}
              >
                {has(product.id) ? '❤️ في المفضلة' : '🤍 المفضلة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
