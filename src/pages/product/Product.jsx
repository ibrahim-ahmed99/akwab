import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as catalog from '../../services/catalogService.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatPrice, digits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import ProductCard from '../../components/ProductCard.jsx';

function ShareBtn({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${className}`}
    >
      {children}
    </a>
  );
}

export default function Product() {
  const { t, lang } = useLang();
  const { c } = useContent();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setQty(1);
    setAdded(false);
    setActiveImg(0);

    // One request returns the product and its related items together.
    catalog.getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data.product);
        setRelated(data.related ?? []);
      })
      .catch(() => { if (!cancelled) setProduct(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
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
        <h2 className="text-3xl mb-4">{t('product.notFound')}</h2>
        <Link to="/shop" className="btn btn-primary">{t('product.backToShop')}</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.img].filter(Boolean);
  const wished = has(product.id);
  const savings = product.savings > 0 ? product.savings : null;
  const available = product.in_stock !== false;

  const handleAdd = async () => {
    if (busy || !available) return;
    setBusy(true);
    try {
      await add(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // The cart context already carries the error state.
    } finally {
      setBusy(false);
    }
  };

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  return (
    <section className="py-10">
      <div className="akwab-container">

        {/* Breadcrumb */}
        <nav className="text-sm text-brand-ink-soft mb-8 flex gap-2 items-center flex-wrap">
          <Link to="/" className="hover:text-brand-pink transition-colors">{t('product.home')}</Link>
          <span className="text-brand-line">/</span>
          <Link to="/shop" className="hover:text-brand-pink transition-colors">
            {product.category_name || t('shop.title')}
          </Link>
          <span className="text-brand-line">/</span>
          <span className="text-brand-ink">{product.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* Image Gallery — first in DOM = right column in RTL */}
          <div className="flex flex-col gap-4">
            <div className={`relative rounded-brand overflow-hidden aspect-square p-bg-${product.bg || 1}`}>
              {images[activeImg] && (
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label={t('product.prevImage')}
                    className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-brand-sm hover:shadow-brand-md transition-all z-10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 rtl:rotate-180">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label={t('product.nextImage')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-brand-sm hover:shadow-brand-md transition-all z-10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 rtl:rotate-180">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`rounded-full transition-all ${i === activeImg ? 'w-5 h-2 bg-brand-pink' : 'w-2 h-2 bg-white/70 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-brand-sm overflow-hidden aspect-square border-2 transition-all ${
                      i === activeImg ? 'border-brand-pink' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs font-semibold text-brand-ink-soft uppercase tracking-wider mb-2 block">
              {product.category_name}
            </span>
            <h1 className="text-4xl md:text-5xl mb-2 leading-snug">{product.name}</h1>
            <p className="text-brand-ink-soft mb-5">{product.sub}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-brand-pink font-bold text-4xl">{formatPrice(product.price, lang)}</span>
              {product.old_price > 0 && (
                <span className="text-lg text-brand-ink-soft line-through">
                  {formatPrice(product.old_price, lang)}
                </span>
              )}
              {savings && (
                <span className="text-sm font-bold bg-brand-pink-softer text-brand-pink px-3 py-1 rounded-full">
                  {t('product.save')} {formatPrice(savings, lang)}
                </span>
              )}
            </div>

            {/* Quantity — hidden when the product can't be bought */}
            {available && (
              <div className="flex items-center justify-end gap-4 mb-5">
                <span className="text-sm text-brand-ink-soft font-medium">{t('product.quantity')}</span>
                <div className="flex items-center border border-brand-line rounded-full overflow-hidden select-none">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-brand-ink">{digits(qty, lang)}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => toggle(product.id)}
                aria-label={wished ? t('productCard.removeWish') : t('productCard.addWish')}
                className={`w-12 h-12 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xl transition-all ${
                  wished
                    ? 'border-brand-pink bg-brand-pink text-white'
                    : 'border-brand-line text-brand-ink-soft hover:border-brand-pink hover:text-brand-pink'
                }`}
              >
                {wished ? '❤️' : '🤍'}
              </button>
              {available ? (
                <button
                  onClick={handleAdd}
                  disabled={busy}
                  className={`btn flex-1 justify-center gap-2 text-base disabled:opacity-70 ${added ? 'btn-gold' : 'btn-primary'}`}
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
                      <span>🛒</span>
                      {t('product.addToCart')}
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="btn flex-1 justify-center text-base bg-brand-cream text-brand-ink-soft border-2 border-brand-line cursor-not-allowed"
                >
                  {t('productCard.outOfStock')}
                </button>
              )}
            </div>

            {/* Perks — editorial copy, so it comes from the content API */}
            {c('product.perks', []).length > 0 && (
              <div className="bg-brand-cream-2 rounded-brand-sm p-5 mb-6 divide-y divide-brand-line">
                {c('product.perks', []).map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 text-sm">
                    <span className="text-base">{perk.icon}</span>
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-brand-ink-soft">{t('product.share')}</span>
              <ShareBtn
                href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ${window.location.href}`)}`}
                className="bg-[#25D366] text-white hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </ShareBtn>
              <ShareBtn
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                className="border border-brand-line text-brand-ink-soft hover:border-brand-pink hover:text-brand-pink"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </ShareBtn>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {product.description && (
          <div className="mt-10 bg-white rounded-brand shadow-brand-sm p-6 lg:p-8">
            <h2 className="text-xl mb-4">{t('product.description')}</h2>
            <p className="text-sm leading-relaxed text-brand-ink-soft whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* ── Specs ── */}
        {product.specs?.length > 0 && (
          <div className="mt-5 bg-white rounded-brand shadow-brand-sm p-6 lg:p-8">
            <h2 className="text-xl mb-5">{t('product.specs')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
              {product.specs.map((s, i) => (
                <div key={`${s.label}-${i}`} className={`px-5 ${i % 3 !== 0 ? 'border-s border-brand-line' : ''}`}>
                  <p className="text-xs text-brand-ink-soft mb-1">{s.label}</p>
                  <p className="font-semibold text-brand-ink">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Shipping — editorial copy from the content API ── */}
        {c('product.shippingNotes', []).length > 0 && (
          <div className="mt-5 bg-white rounded-brand shadow-brand-sm p-6 lg:p-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-pink-softer flex items-center justify-center text-brand-pink text-base">🚚</span>
              {t('product.shipping')}
            </h2>
            <div className="space-y-2 text-sm leading-relaxed text-brand-ink-soft">
              {c('product.shippingNotes', []).map((note, i) => (
                <p key={i}>
                  <strong className="text-brand-ink">{note.label}:</strong> {note.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <p className="text-brand-ink-soft text-sm mb-1">{t('product.mayLike')}</p>
              <h2 className="text-3xl md:text-4xl">{t('product.related')}</h2>
              <span className="text-brand-gold text-xl mt-2 block">✦</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
