import { Link, useLocation } from 'react-router-dom';
import { toArabicDigits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';

export default function OrderConfirmation() {
  const { t, lang } = useLang();
  const { state } = useLocation();
  const orderNum = state?.orderNum;

  const fmtOrder = (n) => lang === 'ar' ? toArabicDigits(n) : String(n);

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

        {orderNum && (
          <div className="inline-flex items-center gap-3 bg-white rounded-brand px-6 py-3 shadow-brand-sm mb-8">
            <span className="text-brand-ink-soft text-sm">{t('orderConfirmation.orderNumber')}</span>
            <span className="font-amiri text-2xl text-brand-pink font-bold">
              #{fmtOrder(orderNum)}
            </span>
          </div>
        )}

        {/* Steps */}
        <div className="bg-white rounded-brand p-6 shadow-brand-sm mb-8 text-right">
          <h3 className="text-lg mb-5 text-center font-amiri">{t('orderConfirmation.whatsNext')}</h3>
          <div className="space-y-4">
            <Step num={lang === 'ar' ? '١' : '1'} text={t('orderConfirmation.step1')} />
            <Step num={lang === 'ar' ? '٢' : '2'} text={t('orderConfirmation.step2')} />
            <Step num={lang === 'ar' ? '٣' : '3'} text={t('orderConfirmation.step3')} />
          </div>
        </div>

        {/* Info card */}
        <div className="bg-brand-cream-2 rounded-brand p-5 mb-8 text-sm text-brand-ink-soft flex items-start gap-3 text-right">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C8A84B" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <span>{t('orderConfirmation.note')}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn btn-primary justify-center">{t('orderConfirmation.shopAgain')}</Link>
          <Link to="/" className="btn btn-outline justify-center">{t('orderConfirmation.home')}</Link>
        </div>
      </div>
    </section>
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
