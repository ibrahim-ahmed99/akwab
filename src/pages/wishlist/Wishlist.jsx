import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice, digits } from '../../utils/arabic.js';
import { productPath } from '../../utils/routes.js';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Wishlist() {
  const { t, lang } = useLang();
  const { items, remove, clear, count, loading } = useWishlist();

  if (loading) {
    return (
      <div className="akwab-container py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-brand h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <div className="text-7xl mb-6">🤍</div>
        <h1 className="text-4xl mb-4">{t('wishlist.empty')}</h1>
        <p className="text-brand-ink-soft mb-8 max-w-sm mx-auto">
          {t('wishlist.emptyDesc')}
        </p>
        <Link to="/shop" className="btn btn-primary">{t('wishlist.startShopping')}</Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="akwab-container max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-1">{t('wishlist.title')}</h1>
            <p className="text-brand-ink-soft">
              {digits(count, lang)} {t('wishlist.saved')}
            </p>
          </div>
          <button
            onClick={clear}
            className="text-sm text-brand-ink-soft hover:text-[#D64545] transition-colors"
          >
            {t('wishlist.clearAll')}
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
  const { t, lang } = useLang();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    if (busy || added) return;
    setBusy(true);
    try {
      await add(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // The cart context surfaces the failure; the card stays usable.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-brand shadow-brand-sm overflow-hidden">
      <Link to={productPath(product)} className={`block relative aspect-square p-bg-${product.bg || 1}`}>
        {product.img && <img src={product.img} alt={product.name} className="w-full h-full object-cover" />}
      </Link>
      <div className="p-4">
        <Link
          to={productPath(product)}
          className="block text-base font-semibold hover:text-brand-pink transition-colors mb-1 truncate"
        >
          {product.name}
        </Link>
        <p className="text-xs text-brand-ink-soft mb-2 truncate">{product.sub}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-pink font-bold">{formatPrice(product.price, lang)}</span>
          {product.old_price > 0 && (
            <span className="text-xs text-brand-ink-soft line-through">
              {formatPrice(product.old_price, lang)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={busy}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all disabled:opacity-70 ${
              added ? 'bg-brand-gold text-white' : 'bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white'
            }`}
          >
            {added ? t('productCard.added') : t('productCard.addToCart')}
          </button>
          <button
            onClick={onRemove}
            aria-label={t('productCard.removeWish')}
            className="w-10 rounded-full border border-brand-line text-brand-ink-soft hover:border-[#D64545] hover:text-[#D64545] transition-colors"
          >✕</button>
        </div>
      </div>
    </div>
  );
}
