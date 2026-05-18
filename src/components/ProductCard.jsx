import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { starsStr } from '../utils/arabic.js';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);

  const wished = has(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (added) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWish = (e) => {
    e.preventDefault();
    toggle(product);
  };

  return (
    <article className="reveal bg-white rounded-brand shadow-brand-sm hover:shadow-brand-md transition-all overflow-hidden group">
      <Link to={`/product/${product.id}`} className={`block relative aspect-square p-bg-${product.bg || 1}`}>
        {product.badge && (
          <span className={`badge badge-${product.badge.kind}`}>{product.badge.text}</span>
        )}
        <button
          type="button"
          aria-label={wished ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          onClick={handleWish}
          className="absolute top-3 left-3 z-[2] w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-base shadow-brand-sm transition-transform hover:scale-110"
        >
          {wished ? '❤️' : '🤍'}
        </button>
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="text-brand-gold tracking-wider">{starsStr(product.rating)}</span>
          <small className="text-brand-ink-soft">({product.reviews})</small>
        </div>
        <h3 className="text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-brand-ink-soft mb-3">{product.sub}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-pink font-bold text-lg">{product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-brand-ink-soft line-through">{product.oldPrice}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
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
                <path d="M5 6h16l-2 11H7Z" />
                <path d="M9 6a3 3 0 0 1 6 0" />
              </svg>
              أضف للسلة
            </>
          )}
        </button>
      </div>
    </article>
  );
}
