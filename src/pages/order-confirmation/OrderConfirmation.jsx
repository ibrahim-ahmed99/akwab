import { Link, useLocation } from 'react-router-dom';
import { formatPrice, digits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';

export default function OrderConfirmation() {
  const { t, lang } = useLang();
  const { state } = useLocation();
  // The real order the API returned when checkout succeeded.
  const order = state?.order;

  return (
    <section className="py-24">
      <div className="akwab-container max-w-2xl text-center">

        {/* Success circle */}
        <div className="w-24 h-24 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-6"
          style={{ boxShadow: '0 0 0 12px #fce8f0' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#E0478A" strokeWidth="2.5" strokeLinecap="round" className="w-11 h-11">
            <path d="m5 12 5 5 9-11" />
          </svg>
        </div>

        <h1 className="text-4xl mb-3">{t('orderConfirmation.title')}</h1>
        <p className="text-brand-ink-soft text-lg mb-6">{t('orderConfirmation.thanks')}</p>

        {order && (
          <div className="inline-flex items-center gap-3 bg-white rounded-brand px-6 py-3 shadow-brand-sm mb-8">
            <span className="text-brand-ink-soft text-sm">{t('orderConfirmation.orderNumber')}</span>
            <span className="font-amiri text-2xl text-brand-pink font-bold">
              #{digits(order.id, lang)}
            </span>
          </div>
        )}

        {/* Order recap */}
        {order && (
          <div className="bg-white rounded-brand p-6 shadow-brand-sm mb-8 text-start">
            <h3 className="text-lg mb-4 text-center font-amiri">{t('orderConfirmation.summary')}</h3>

            <div className="space-y-3 mb-4">
              {(order.items ?? []).map((item) => (
                <div key={item.product_id} className="flex items-center gap-3">
                  {item.img && (
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-brand-sm object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{item.name}</div>
                    <div className="text-xs text-brand-ink-soft">×{digits(item.qty, lang)}</div>
                  </div>
                  <div className="text-sm font-bold text-brand-pink whitespace-nowrap">
                    {formatPrice(item.line_total, lang)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-line pt-3 space-y-2 text-sm">
              <Row label={t('checkout.subtotal')} value={formatPrice(order.subtotal, lang)} />
              {order.discount > 0 && <Row label={t('cart.discount')} value={`− ${formatPrice(order.discount, lang)}`} />}
              <Row label={t('checkout.shippingFee')} value={formatPrice(order.shipping, lang)} />
              <div className="flex justify-between pt-2 border-t border-brand-line">
                <span className="font-amiri text-lg">{t('checkout.total')}</span>
                <span className="font-amiri text-xl text-brand-pink font-bold">
                  {formatPrice(order.total, lang)}
                </span>
              </div>
            </div>

            {order.address && (
              <div className="border-t border-brand-line mt-4 pt-3 text-xs text-brand-ink-soft leading-relaxed">
                <div className="font-semibold text-brand-ink mb-0.5">{t('checkout.deliveryData')}</div>
                {order.address.name} — {order.address.phone}
                <br />
                {order.address.city}، {order.address.address}
              </div>
            )}
          </div>
        )}

        {/* Steps */}
        <div className="bg-white rounded-brand p-6 shadow-brand-sm mb-8 text-start">
          <h3 className="text-lg mb-5 text-center font-amiri">{t('orderConfirmation.whatsNext')}</h3>
          <div className="space-y-4">
            <Step num={digits(1, lang)} text={t('orderConfirmation.step1')} />
            <Step num={digits(2, lang)} text={t('orderConfirmation.step2')} />
            <Step num={digits(3, lang)} text={t('orderConfirmation.step3')} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn btn-primary justify-center">{t('orderConfirmation.shopAgain')}</Link>
          <Link to="/profile" className="btn btn-outline justify-center">{t('orderConfirmation.myOrders')}</Link>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-brand-ink-soft">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Step({ num, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink font-bold text-sm flex items-center justify-center shrink-0 font-cairo">
        {num}
      </div>
      <p className="text-brand-ink-soft text-sm pt-1.5">{text}</p>
    </div>
  );
}
