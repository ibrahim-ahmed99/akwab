import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { toArabicDigits, starsStr } from '../../utils/arabic.js';
import { useState } from 'react';

export default function Wishlist() {
  const { items, remove, clear, count } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <div className="text-7xl mb-6">🤍</div>
        <h1 className="text-4xl mb-4">قائمة المفضلة فارغة</h1>
        <p className="text-brand-ink-soft mb-8 max-w-sm mx-auto">
          احفظ القطع اللي تعجبك بالضغط على 🤍 في أي منتج، وستظهر هنا.
        </p>
        <Link to="/shop" className="btn btn-primary">ابدأ التسوق</Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="akwab-container max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-1">المفضلة</h1>
            <p className="text-brand-ink-soft">
              {toArabicDigits(count)} {count === 1 ? 'منتج' : 'منتجات'} محفوظة
            </p>
          </div>
          <button
            onClick={clear}
            className="text-sm text-brand-ink-soft hover:text-[#D64545] transition-colors"
          >
            مسح الكل
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(product => (
            <WishlistCard key={product.id} product={product} onRemove={() => remove(product.id)} />
          ))}
        </div>

      </div>
    </section>
  );
}

function WishlistCard({ product, onRemove }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (added) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="bg-white rounded-brand shadow-brand-sm hover:shadow-brand-md transition-all overflow-hidden group">
      {/* Image */}
      <div className="relative">
        <Link to={`/product/${product.id}`} className={`block aspect-square p-bg-${product.bg || 1}`}>
          {product.badge && (
            <span className={`badge badge-${product.badge.kind}`}>{product.badge.text}</span>
          )}
          {product.img && (
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </Link>
        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="إزالة من المفضلة"
          className="absolute top-3 left-3 z-[2] w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-brand-sm text-brand-pink hover:bg-[#D64545] hover:text-white transition-all"
        >
          ❤️
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="text-brand-gold tracking-wider">{starsStr(product.rating)}</span>
          <small className="text-brand-ink-soft">({product.reviews})</small>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg mb-1 hover:text-brand-pink transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-brand-ink-soft mb-3">{product.sub}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-pink font-bold text-lg">{product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-brand-ink-soft line-through">{product.oldPrice}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              added
                ? 'bg-brand-gold text-white'
                : 'bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white'
            }`}
          >
            {added ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-4 h-4">
                  <path d="m5 12 5 5 9-11" />
                </svg>
                تمت الإضافة
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <path d="M5 6h16l-2 11H7Z" /><path d="M9 6a3 3 0 0 1 6 0" />
                </svg>
                أضف للسلة
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-10 h-10 rounded-full border border-brand-line flex items-center justify-center text-brand-ink-soft hover:border-[#D64545] hover:text-[#D64545] transition-all"
            aria-label="إزالة"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
