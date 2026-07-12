import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { toArabicDigits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';

const GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الشرقية','الدقهلية','البحيرة',
  'الغربية','المنوفية','القليوبية','الإسماعيلية','السويس','بورسعيد',
  'دمياط','كفر الشيخ','أسيوط','سوهاج','قنا','الأقصر','أسوان',
  'المنيا','بني سويف','الفيوم','البحر الأحمر','الوادي الجديد',
  'مطروح','شمال سيناء','جنوب سيناء',
];

const SHIPPING = 60;

function parsePrice(s) {
  if (!s) return 0;
  const map = {'٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'٧':7,'٨':8,'٩':9};
  const d = String(s).split('').map(c => (c in map ? map[c] : /\d/.test(c) ? c : '')).join('');
  return parseInt(d, 10) || 0;
}

export default function Checkout() {
  const { t, lang } = useLang();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const fmt = (n) => lang === 'ar' ? toArabicDigits(n) : String(n);

  const [form, setForm] = useState({
    name:'', phone:'', email:'',
    governorate:'', city:'', street:'', building:'', notes:'',
  });
  const [payment, setPayment] = useState('cod');
  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const total = subtotal + SHIPPING;

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <h1 className="text-4xl mb-4">{t('checkout.emptyCart')}</h1>
        <p className="text-brand-ink-soft mb-8">{t('checkout.addProducts')}</p>
        <Link to="/shop" className="btn btn-primary">{t('checkout.startShopping')}</Link>
      </div>
    );
  }

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const changePayment = (v) => {
    setPayment(v);
    setReceiptFile(null);
    if (errors.receipt) setErrors(p => ({ ...p, receipt: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('checkout.errors.name');
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) e.phone = t('checkout.errors.phone');
    if (!form.governorate) e.governorate = t('checkout.errors.governorate');
    if (!form.city.trim()) e.city = t('checkout.errors.city');
    if (!form.street.trim()) e.street = t('checkout.errors.street');
    if (['instapay', 'vodafone'].includes(payment) && !receiptFile)
      e.receipt = 'يرجى رفع صورة إيصال التحويل';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      const orderNum = Math.floor(100000 + Math.random() * 900000);
      clear();
      navigate('/order-confirmation', { state: { orderNum } });
    }, 1200);
  };

  return (
    <section className="py-12">
      <div className="akwab-container max-w-5xl">
        <nav className="text-sm text-brand-ink-soft mb-8 flex gap-2">
          <Link to="/" className="hover:text-brand-pink">{t('product.home')}</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-brand-pink">{t('cart.title')}</Link>
          <span>/</span>
          <span className="text-brand-ink">{t('checkout.title')}</span>
        </nav>

        <h1 className="text-4xl mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* Form */}
            <div className="space-y-6">

              {/* Delivery */}
              <Card title={t('checkout.deliveryData')} icon={<TruckIcon />}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t('checkout.fullName')} error={errors.name} required>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder={t('checkout.namePlaceholder')} className={inputCls(errors.name)} />
                  </Field>
                  <Field label={t('checkout.phone')} error={errors.phone} required>
                    <input type="tel" value={form.phone} dir="ltr" onChange={e => set('phone', e.target.value)}
                      placeholder="01xxxxxxxxx" className={inputCls(errors.phone)} />
                  </Field>
                  <Field label={t('checkout.email')} className="sm:col-span-2">
                    <input type="email" value={form.email} dir="ltr" onChange={e => set('email', e.target.value)}
                      placeholder={t('checkout.emailOptional')} className={inputCls()} />
                  </Field>
                  <Field label={t('checkout.governorate')} error={errors.governorate} required>
                    <select value={form.governorate} onChange={e => set('governorate', e.target.value)}
                      className={inputCls(errors.governorate)}>
                      <option value="">{t('checkout.chooseGov')}</option>
                      {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label={t('checkout.city')} error={errors.city} required>
                    <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                      placeholder={t('checkout.cityPlaceholder')} className={inputCls(errors.city)} />
                  </Field>
                  <Field label={t('checkout.street')} error={errors.street} required className="sm:col-span-2">
                    <input type="text" value={form.street} onChange={e => set('street', e.target.value)}
                      placeholder={t('checkout.streetPlaceholder')} className={inputCls(errors.street)} />
                  </Field>
                  <Field label={t('checkout.building')}>
                    <input type="text" value={form.building} onChange={e => set('building', e.target.value)}
                      placeholder={t('checkout.buildingPlaceholder')} className={inputCls()} />
                  </Field>
                  <Field label={t('checkout.notes')}>
                    <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
                      placeholder={t('checkout.notesPlaceholder')} className={inputCls()} />
                  </Field>
                </div>
              </Card>

              {/* Payment */}
              <Card title={t('checkout.paymentMethod')} icon={<CardIcon />}>
                <div className="space-y-3">
                  <PayOption value="cod" current={payment} onChange={changePayment}
                    icon="💵" label={t('checkout.codLabel')} desc={t('checkout.codDesc')} />
                  <PayOption value="instapay" current={payment} onChange={changePayment}
                    icon={<InstaPayLogo />} label="InstaPay" desc={t('checkout.instapayDesc')} />
                  <PayOption value="vodafone" current={payment} onChange={changePayment}
                    icon={<VodafoneLogo />} label="Vodafone Cash" desc={t('checkout.vodafoneDesc')} />
                </div>

                {/* InstaPay details */}
                {payment === 'instapay' && (
                  <div className="mt-5 p-5 bg-brand-pink-softer rounded-brand-sm border border-brand-pink/20 space-y-5">
                    <p className="font-semibold text-sm text-brand-ink">حوّل عبر InstaPay ثم ارفع صورة الإيصال:</p>
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                      {/* QR Code */}
                      <div className="shrink-0 bg-white p-2 rounded-brand-sm border border-brand-line">
                        <img
                          src="/assets/instapay-qr.png"
                          alt="InstaPay QR"
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                      {/* Account info + button */}
                      <div className="space-y-3 text-sm w-full">
                        <div className="bg-white rounded-brand-sm p-4 border border-brand-line">
                          <p className="text-xs text-brand-ink-soft mb-1">حساب InstaPay</p>
                          <p className="font-bold text-brand-ink text-base" dir="ltr">
                            abdulrahman.a.e@instapay
                          </p>
                        </div>
                        <a
                          href="https://ipn.eg/S/abdulrahman.a.e/instapay/9sdts3"
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary w-full justify-center gap-2 text-sm"
                        >
                          <span>📲</span>
                          ادفع مباشرةً عبر InstaPay
                        </a>
                      </div>
                    </div>
                    <ReceiptUpload
                      file={receiptFile}
                      onChange={(f) => { setReceiptFile(f); if (errors.receipt) setErrors(p => ({ ...p, receipt: null })); }}
                      error={errors.receipt}
                    />
                  </div>
                )}

                {/* Vodafone Cash details */}
                {payment === 'vodafone' && (
                  <div className="mt-5 p-5 rounded-brand-sm border space-y-5"
                    style={{ background: '#fff7f7', borderColor: 'rgba(214,69,69,.2)' }}>
                    <p className="font-semibold text-sm text-brand-ink">حوّل عبر فودافون كاش ثم ارفع صورة الإيصال:</p>
                    <div className="bg-white rounded-brand-sm p-4 border border-brand-line flex items-center gap-4">
                      <span className="text-3xl">📱</span>
                      <div>
                        <p className="text-xs text-brand-ink-soft mb-1">رقم فودافون كاش</p>
                        <p className="font-bold text-2xl text-brand-ink tracking-wide" dir="ltr">
                          +20 10 13904356
                        </p>
                      </div>
                    </div>
                    <ReceiptUpload
                      file={receiptFile}
                      onChange={(f) => { setReceiptFile(f); if (errors.receipt) setErrors(p => ({ ...p, receipt: null })); }}
                      error={errors.receipt}
                    />
                  </div>
                )}
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-4 lg:sticky lg:top-28">
              <Card title={t('checkout.orderSummary')} icon={<BagIcon />}>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-brand-sm overflow-hidden p-bg-1 shrink-0">
                        {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="text-xs text-brand-ink-soft">×{fmt(item.qty)}</div>
                      </div>
                      <div className="text-sm font-bold text-brand-pink whitespace-nowrap">
                        {fmt(parsePrice(item.price) * item.qty)} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-line pt-4 space-y-2.5 text-sm">
                  <SummaryRow label={t('checkout.subtotal')} value={`${fmt(subtotal)} ج.م`} />
                  <SummaryRow label={t('checkout.shippingFee')} value={`${fmt(SHIPPING)} ج.م`} />
                  <div className="flex justify-between items-center border-t border-brand-line pt-3 mt-1">
                    <span className="font-amiri text-xl">{t('checkout.total')}</span>
                    <span className="font-amiri text-2xl text-brand-pink font-bold">
                      {fmt(total)} ج.م
                    </span>
                  </div>
                </div>
              </Card>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full justify-center text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    {t('checkout.sending')}
                  </span>
                ) : (
                  <>
                    <PaymentIcon method={payment} />
                    {t('checkout.confirmOrder')}
                  </>
                )}
              </button>

              <p className="text-xs text-brand-ink-soft text-center leading-relaxed">
                {t('checkout.terms')}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-brand p-6 shadow-brand-sm">
      <h2 className="text-xl mb-5 flex items-center gap-2.5 text-brand-ink">
        <span className="text-brand-pink">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, error, required, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-brand-ink mb-1.5">
        {label}{required && <span className="text-brand-pink mr-0.5"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return [
    'w-full px-4 py-2.5 rounded-brand-sm border text-sm outline-none transition-colors bg-brand-cream/50',
    hasError ? 'border-[#D64545] focus:border-[#D64545]' : 'border-brand-line focus:border-brand-pink',
  ].join(' ');
}

function PayOption({ value, current, onChange, icon, label, desc }) {
  const active = value === current;
  return (
    <label className={[
      'flex items-center gap-4 p-4 rounded-brand-sm border-2 cursor-pointer transition-all',
      active ? 'border-brand-pink bg-brand-pink-softer' : 'border-brand-line bg-white hover:border-brand-pink/40',
    ].join(' ')}>
      <input type="radio" name="payment" value={value} checked={active} onChange={() => onChange(value)} className="sr-only" />
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-brand-ink-soft">{desc}</div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-brand-pink' : 'border-brand-line'}`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />}
      </div>
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-brand-ink-soft">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function PaymentIcon({ method }) {
  if (method === 'instapay') {
    return (
      <span className="inline-flex items-center gap-0.5 font-black text-sm leading-none me-1">
        <span style={{ color: '#f97316' }}>IN</span>
        <svg viewBox="0 0 14 10" fill="none" className="w-3.5 h-2.5" aria-hidden="true">
          <path d="M0 5h10M6 1l4 4-4 4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: '#7c3aed' }}>staPay</span>
      </span>
    );
  }
  if (method === 'vodafone') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white me-1" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="11" fill="#e60000"/>
          <path d="M15.5 7.5C14.3 6.3 12.7 5.5 11 5.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.4 1.3 4.5 3.2 5.7l1.3-2.3c-1-.6-1.7-1.8-1.7-3.1 0-2 1.6-3.7 3.7-3.7.9 0 1.7.3 2.3.8L15.5 7.5z" fill="white"/>
          <path d="M16.5 9.2l-2.2 1.4c.3.5.4 1 .4 1.6 0 2-1.6 3.7-3.7 3.7v2.6c3.6 0 6.5-2.9 6.5-6.5 0-1-.2-2-.7-2.8h-.3z" fill="white"/>
        </svg>
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 me-1">
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}

function ReceiptUpload({ file, onChange, error }) {
  return (
    <div>
      <p className="text-sm font-medium text-brand-ink mb-2">
        صورة إيصال التحويل <span className="text-brand-pink">*</span>
      </p>
      <label className={[
        'flex flex-col items-center gap-2 p-5 rounded-brand-sm border-2 border-dashed cursor-pointer transition-all bg-white',
        file ? 'border-brand-pink' : error ? 'border-[#D64545]' : 'border-brand-line hover:border-brand-pink/50',
      ].join(' ')}>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onChange(e.target.files[0] || null)}
        />
        {file ? (
          <div className="flex items-center gap-2 text-brand-pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 shrink-0">
              <path d="m5 12 5 5 9-11" />
            </svg>
            <span className="text-sm font-semibold truncate max-w-[220px]">{file.name}</span>
          </div>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8 text-brand-ink-soft">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-sm text-brand-ink-soft">اضغط لاختيار صورة الإيصال</span>
            <span className="text-xs text-brand-ink-soft/60">JPG أو PNG</span>
          </>
        )}
      </label>
      {error && <p className="text-xs text-[#D64545] mt-1.5">{error}</p>}
    </div>
  );
}

function InstaPayLogo() {
  return (
    <img
      src="/assets/InstaPay_Logo.png"
      alt="InstaPay"
      className="w-10 h-10 object-contain"
    />
  );
}

function VodafoneLogo() {
  return (
    <img
      src="/assets/vc.png"
      alt="Vodafone Cash"
      className="w-10 h-10 object-contain"
    />
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
      <rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
