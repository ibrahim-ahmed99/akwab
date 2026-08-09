import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/arabic.js';
import { productPath } from '../utils/routes.js';
import { useLang } from '../context/LanguageContext.jsx';

/**
 * Renders the badge the API derived from real data: a discount percentage, or
 * "new" for a recent arrival. The label is a UI string so it follows the locale.
 */
function badgeText(badge, t, lang) {
  if (!badge) return null;
  if (badge.kind === 'sale' && badge.value) {
    return lang === 'ar'
      ? `${t('productCard.discount')} ${badge.value}٪`
      : `${badge.value}% ${t('productCard.discount')}`;
  }
  return t(`productCard.badge.${badge.kind}`);
}

export default function ProductCard({ product }) {
  const { t, lang } = useLang();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  const wished = has(product.id);
  // in_stock comes from the API; default true so non-catalogue callers still work.
  const available = product.in_stock !== false;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (added || busy || !available) return;
    setBusy(true);
    try {
      await add(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      // The cart context already surfaces failures; the card stays interactive.
    } finally {
      setBusy(false);
    }
  };

  const handleWish = async (e) => {
    e.preventDefault();
    try { await toggle(product.id); } catch {}
  };

  const badge = badgeText(product.badge, t, lang);

  return (
    <article className="reveal bg-white rounded-brand shadow-brand-sm hover:shadow-brand-md transition-all overflow-hidden group">
      <Link to={productPath(product)} className={`block relative aspect-square p-bg-${product.bg || 1}`}>
        {/* Out-of-stock takes visual priority over the sale/new badge. */}
        {!available ? (
          <span className="badge badge-danger">{t('productCard.outOfStock')}</span>
        ) : badge && (
          <span className={`badge badge-${product.badge.kind}`}>{badge}</span>
        )}
        <button
          type="button"
          aria-label={wished ? t('productCard.removeWish') : t('productCard.addWish')}
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
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${available ? '' : 'grayscale opacity-70'}`}
          />
        )}
      </Link>

      <div className="p-5">
        <h3 className="text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-brand-ink-soft mb-3 min-h-[20px]">{product.sub}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-pink font-bold text-lg">{formatPrice(product.price, lang)}</span>
          {product.old_price > 0 && (
            <span className="text-sm text-brand-ink-soft line-through">
              {formatPrice(product.old_price, lang)}
            </span>
          )}
        </div>
        {available ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={busy}
            className={`w-full py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
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
                {t('productCard.added')}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <path d="M5 6h16l-2 11H7Z" />
                  <path d="M9 6a3 3 0 0 1 6 0" />
                </svg>
                {t('productCard.addToCart')}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-full font-semibold text-sm bg-brand-cream text-brand-ink-soft cursor-not-allowed border border-brand-line"
          >
            {t('productCard.outOfStock')}
          </button>
        )}
      </div>
    </article>
  );
}
