import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice, digits } from '../../utils/arabic.js';
import { productPath } from '../../utils/routes.js';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Cart() {
  const { t, lang } = useLang();
  const {
    items, discounts, count, subtotal, discount, shipping, total,
    loading, remove, setQty, clear, applyCoupon,
  } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [busy, setBusy] = useState(false);

  const fmt = (n) => formatPrice(n, lang);

  // The discount engine lives on the server; a code that came back applied is
  // present in `discounts`, so there is no client-side coupon table any more.
  const handleCoupon = async () => {
    const code = couponInput.trim();
    if (!code || busy) return;

    setBusy(true);
    setCouponError('');
    try {
      await applyCoupon(code);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || t('cart.invalidCoupon'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="akwab-container py-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-brand h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <h1 className="text-4xl mb-4">{t('cart.empty')}</h1>
        <p className="text-brand-ink-soft mb-8">{t('cart.emptyDesc')}</p>
        <Link to="/shop" className="btn btn-primary">{t('cart.startShopping')}</Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="akwab-container max-w-4xl">
        <h1 className="text-4xl mb-2">{t('cart.title')}</h1>
        <p className="text-brand-ink-soft mb-8">{digits(count, lang)} {t('cart.itemsCount')}</p>

        {/* Product list */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product_id} className="bg-white rounded-brand p-4 flex gap-4 items-center shadow-brand-sm">
              <Link
                to={productPath(item)}
                className={`w-24 h-24 rounded-brand-sm overflow-hidden shrink-0 p-bg-${item.bg || 1}`}
              >
                {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={productPath(item)} className="block text-lg mb-1 truncate hover:text-brand-pink transition-colors">
                  {item.name}
                </Link>
                <div className="text-brand-pink font-bold">{fmt(item.price)}</div>
                {!item.available && (
                  <p className="text-xs text-[#D64545] mt-1">{t('cart.unavailable')}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.product_id, item.qty - 1)}
                  className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                >−</button>
                <span className="w-8 text-center font-semibold">{digits(item.qty, lang)}</span>
                <button
                  onClick={() => setQty(item.product_id, item.qty + 1)}
                  className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                >+</button>
              </div>
              <button
                onClick={() => remove(item.product_id)}
                className="text-brand-ink-soft hover:text-[#D64545] px-3"
                aria-label={t('cart.remove')}
              >✕</button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-brand p-6 mt-8 shadow-brand-sm">

          {/* Coupon field */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-brand-ink mb-2">{t('cart.couponCode')}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                placeholder={t('cart.enterCode')}
                disabled={busy}
                className="flex-1 px-4 py-2.5 rounded-[12px] border border-brand-line text-sm bg-brand-cream outline-none focus:border-brand-pink focus:bg-white focus:shadow-[0_0_0_3px_rgba(224,71,138,.1)] transition-all disabled:opacity-60"
              />
              <button
                onClick={handleCoupon}
                disabled={busy || !couponInput.trim()}
                className="px-5 py-2.5 rounded-[12px] bg-brand-pink text-white text-sm font-semibold hover:bg-[#c93a7a] transition-colors disabled:opacity-60"
              >
                {t('cart.apply')}
              </button>
            </div>

            {couponError && (
              <p className="text-[#D64545] text-xs mt-2 flex items-center gap-1">
                <span>✕</span> {couponError}
              </p>
            )}
          </div>

          <div className="border-t border-brand-line pt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-brand-ink-soft">{t('cart.subtotal')}</span>
              <span className="font-bold">{fmt(subtotal)}</span>
            </div>

            {discounts.map((d, i) => (
              <div key={`${d.code}-${i}`} className="flex justify-between items-center mb-2 text-green-600">
                <span>{d.label || d.code}</span>
                <span className="font-bold">− {fmt(d.amount)}</span>
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-ink-soft">{t('cart.shipping')}</span>
              <span className={shipping > 0 ? 'font-bold' : 'text-brand-ink-soft'}>
                {shipping > 0 ? fmt(shipping) : t('cart.shippingCalc')}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-brand-line mb-6">
              <span className="font-amiri text-xl">{t('cart.total')}</span>
              <span className="font-amiri text-2xl text-brand-pink font-bold">
                {fmt(total || Math.max(0, subtotal - discount))}
              </span>
            </div>

            <div className="flex gap-3">
              {/* Guests can check out — the cart already belongs to a guest
                  identity and checkout collects their contact details. */}
              <button onClick={() => navigate('/checkout')} className="btn btn-primary flex-1 justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                  <path d="m5 12 5 5 9-11" />
                </svg>
                {t('cart.checkout')}
              </button>
              <button onClick={clear} className="btn btn-outline">{t('cart.clearCart')}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
