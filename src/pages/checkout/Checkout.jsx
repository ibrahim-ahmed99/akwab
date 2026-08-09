import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import { formatPrice, digits } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';
import * as orderApi from '../../services/orderService.js';

// Prepaid methods need a transfer receipt before the order is accepted.
const PREPAID = ['instapay', 'wallet'];

export default function Checkout() {
  const { t, lang } = useLang();
  const { c } = useContent();
  const { items, subtotal, discount, shipping, total, count, loading, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fmt = (n) => formatPrice(n, lang);

  const [cities, setCities] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    city_id: '', street: '', building: '', notes: '',
  });
  const [payment, setPayment] = useState('cod');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptName, setReceiptName] = useState(null); // uploaded filename
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Governorates and their shipping fees come from the API; saved addresses let
  // a returning customer skip the form entirely.
  useEffect(() => {
    orderApi.getCities().then(setCities).catch(() => setCities([]));
    orderApi.getAddresses()
      .then((rows) => {
        setAddresses(rows);
        const preferred = rows.find((a) => a.is_default) ?? rows[0];
        if (preferred) setAddressId(String(preferred.id));
      })
      .catch(() => setAddresses([]));
  }, [user?.id]);

  // Prefill from the signed-in account so they aren't retyping what we know.
  useEffect(() => {
    if (!user) return;
    setForm((p) => ({
      ...p,
      name: p.name || user.name || '',
      phone: p.phone || user.phone || '',
      email: p.email || user.email || '',
    }));
  }, [user]);

  const usingSaved = addressId !== '' && addressId !== 'new';
  const selectedCity = cities.find((c) => String(c.id) === String(form.city_id));

  // The server is the authority on shipping; this only previews the fee before
  // an address exists to attach.
  const previewShipping = usingSaved
    ? shipping
    : (selectedCity?.shipping ?? shipping);
  const previewTotal = Math.max(0, subtotal - discount) + previewShipping;

  if (loading) {
    return (
      <div className="akwab-container py-24">
        <div className="max-w-5xl mx-auto h-64 bg-white rounded-brand animate-pulse" />
      </div>
    );
  }

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
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: null }));
  };

  const requiresReceipt = PREPAID.includes(payment);

  // Upload the receipt the moment it's picked, so submit only carries a filename.
  const handleReceipt = async (file) => {
    setReceiptFile(file);
    setReceiptName(null);
    setErrors((p) => ({ ...p, payment_receipt: null }));
    if (!file) return;

    setUploadingReceipt(true);
    try {
      setReceiptName(await orderApi.uploadReceipt(file));
    } catch (err) {
      setReceiptFile(null);
      setErrors((p) => ({ ...p, payment_receipt: err.message }));
    } finally {
      setUploadingReceipt(false);
    }
  };

  const changePayment = (method) => {
    setPayment(method);
    setReceiptFile(null);
    setReceiptName(null);
    setErrors((p) => ({ ...p, payment_receipt: null }));
  };

  const validate = () => {
    const e = {};
    if (!usingSaved) {
      if (!form.name.trim()) e.name = t('checkout.errors.name');
      if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) e.phone = t('checkout.errors.phone');
      if (!form.city_id) e.city_id = t('checkout.errors.governorate');
      if (!form.street.trim()) e.street = t('checkout.errors.street');
    }
    if (requiresReceipt && !receiptName) e.payment_receipt = t('checkout.errors.receipt');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploadingReceipt) return;

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const base = usingSaved
        ? { address_id: Number(addressId), notes: form.notes || undefined }
        : {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || undefined,
            city_id: Number(form.city_id),
            // The API stores one address line; join the parts the form collects.
            address: [form.street.trim(), form.building.trim()].filter(Boolean).join(' — '),
            notes: form.notes || undefined,
          };

      const order = await orderApi.placeOrder({
        ...base,
        payment_method: payment,
        payment_receipt: requiresReceipt ? receiptName : undefined,
      });
      await refresh();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      // Field errors from the API land under the matching inputs.
      if (err.errors) {
        setErrors(Object.fromEntries(
          Object.entries(err.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
        ));
      }
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
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

              {addresses.length > 0 && (
                <Card title={t('checkout.savedAddresses')} icon={<TruckIcon />}>
                  <div className="space-y-3">
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className={[
                          'flex items-start gap-4 p-4 rounded-brand-sm border-2 cursor-pointer transition-all',
                          String(addressId) === String(a.id)
                            ? 'border-brand-pink bg-brand-pink-softer'
                            : 'border-brand-line bg-white hover:border-brand-pink/40',
                        ].join(' ')}
                      >
                        <input
                          type="radio" name="address" className="sr-only"
                          checked={String(addressId) === String(a.id)}
                          onChange={() => setAddressId(String(a.id))}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{a.name} — {a.phone}</div>
                          <div className="text-xs text-brand-ink-soft mt-0.5">{a.city}، {a.address}</div>
                        </div>
                      </label>
                    ))}

                    <label
                      className={[
                        'flex items-center gap-4 p-4 rounded-brand-sm border-2 cursor-pointer transition-all',
                        addressId === 'new'
                          ? 'border-brand-pink bg-brand-pink-softer'
                          : 'border-brand-line bg-white hover:border-brand-pink/40',
                      ].join(' ')}
                    >
                      <input
                        type="radio" name="address" className="sr-only"
                        checked={addressId === 'new'}
                        onChange={() => setAddressId('new')}
                      />
                      <span className="font-semibold text-sm">{t('checkout.newAddress')}</span>
                    </label>
                  </div>
                </Card>
              )}

              {!usingSaved && (
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
                    <Field label={t('checkout.email')} className="sm:col-span-2" error={errors.email}>
                      <input type="email" value={form.email} dir="ltr" onChange={e => set('email', e.target.value)}
                        placeholder={t('checkout.emailOptional')} className={inputCls(errors.email)} />
                    </Field>
                    <Field label={t('checkout.governorate')} error={errors.city_id} required>
                      <select value={form.city_id} onChange={e => set('city_id', e.target.value)}
                        className={inputCls(errors.city_id)}>
                        <option value="">{t('checkout.chooseGov')}</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}{c.shipping > 0 ? ` — ${fmt(c.shipping)}` : ''}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t('checkout.building')}>
                      <input type="text" value={form.building} onChange={e => set('building', e.target.value)}
                        placeholder={t('checkout.buildingPlaceholder')} className={inputCls()} />
                    </Field>
                    <Field label={t('checkout.street')} error={errors.street || errors.address} required className="sm:col-span-2">
                      <input type="text" value={form.street} onChange={e => set('street', e.target.value)}
                        placeholder={t('checkout.streetPlaceholder')} className={inputCls(errors.street || errors.address)} />
                    </Field>
                  </div>
                </Card>
              )}

              <Card title={t('checkout.notes')} icon={<BagIcon />}>
                <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder={t('checkout.notesPlaceholder')} className={inputCls()} />
              </Card>

              {/* Payment methods — copy and transfer accounts come from content. */}
              <Card title={t('checkout.paymentMethod')} icon={<CardIcon />}>
                <div className="space-y-3">
                  {['cod', 'instapay', 'wallet'].map((method) => (
                    <PayOption
                      key={method}
                      value={method}
                      current={payment}
                      onChange={changePayment}
                      icon={<PayIcon method={method} />}
                      label={c(`payment.methods.${method}.label`, method)}
                      desc={c(`payment.methods.${method}.desc`, '')}
                    />
                  ))}
                </div>

                {/* Transfer details + receipt upload for prepaid methods */}
                {requiresReceipt && (
                  <div className="mt-5 p-5 bg-brand-pink-softer rounded-brand-sm border border-brand-pink/20 space-y-4">
                    <p className="text-sm text-brand-ink leading-relaxed">
                      {c(`payment.methods.${payment}.note`, '')}
                    </p>
                    <div className="bg-white rounded-brand-sm p-4 border border-brand-line">
                      <p className="text-xs text-brand-ink-soft mb-1">
                        {c(`payment.methods.${payment}.label`, '')}
                      </p>
                      <p className="font-bold text-brand-ink text-lg" dir="ltr">
                        {c(`payment.methods.${payment}.account`, '')}
                      </p>
                    </div>

                    <ReceiptUpload
                      label={c('payment.uploadLabel', t('checkout.receiptLabel'))}
                      hint={c('payment.uploadHint', '')}
                      file={receiptFile}
                      uploading={uploadingReceipt}
                      uploaded={Boolean(receiptName)}
                      error={errors.payment_receipt}
                      onChange={handleReceipt}
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
                    <div key={item.product_id} className="flex gap-3 items-center">
                      <div className={`w-14 h-14 rounded-brand-sm overflow-hidden shrink-0 p-bg-${item.bg || 1}`}>
                        {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="text-xs text-brand-ink-soft">×{digits(item.qty, lang)}</div>
                      </div>
                      <div className="text-sm font-bold text-brand-pink whitespace-nowrap">
                        {fmt(item.line_total)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-line pt-4 space-y-2.5 text-sm">
                  <SummaryRow label={t('checkout.subtotal')} value={fmt(subtotal)} />
                  {discount > 0 && <SummaryRow label={t('cart.discount')} value={`− ${fmt(discount)}`} />}
                  <SummaryRow
                    label={t('checkout.shippingFee')}
                    value={previewShipping > 0 ? fmt(previewShipping) : t('cart.shippingCalc')}
                  />
                  <div className="flex justify-between items-center border-t border-brand-line pt-3 mt-1">
                    <span className="font-amiri text-xl">{t('checkout.total')}</span>
                    <span className="font-amiri text-2xl text-brand-pink font-bold">
                      {fmt(usingSaved ? (total || previewTotal) : previewTotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-ink-soft pt-1">
                    {digits(count, lang)} {t('cart.itemsCount')}
                  </p>
                </div>
              </Card>

              {submitError && (
                <p className="text-xs text-[#D64545] bg-[#fde8e8] border border-[#f5c2c2] rounded-brand-sm px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || uploadingReceipt}
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 me-1">
                      <path d="m5 12 5 5 9-11" />
                    </svg>
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

function PayOption({ value, current, onChange, icon, label, desc }) {
  const active = value === current;
  return (
    <label className={[
      'flex items-center gap-4 p-4 rounded-brand-sm border-2 cursor-pointer transition-all',
      active ? 'border-brand-pink bg-brand-pink-softer' : 'border-brand-line bg-white hover:border-brand-pink/40',
    ].join(' ')}>
      <input type="radio" name="payment" value={value} checked={active} onChange={() => onChange(value)} className="sr-only" />
      <span className="text-2xl w-8 text-center">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-sm">{label}</div>
        {desc && <div className="text-xs text-brand-ink-soft">{desc}</div>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-brand-pink' : 'border-brand-line'}`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />}
      </div>
    </label>
  );
}

function PayIcon({ method }) {
  const src = {
    cod: '/assets/COD.png',        // cash on delivery
    instapay: '/assets/instapay.png',
    wallet: '/assets/cash.png',    // mobile wallet
  }[method];

  return <img src={src} alt="" className="w-8 h-8 object-contain" />;
}

function ReceiptUpload({ label, hint, file, uploading, uploaded, error, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-brand-ink mb-2">
        {label} <span className="text-brand-pink">*</span>
      </p>
      <label className={[
        'flex flex-col items-center gap-2 p-5 rounded-brand-sm border-2 border-dashed cursor-pointer transition-all bg-white',
        uploaded ? 'border-brand-pink' : error ? 'border-[#D64545]' : 'border-brand-line hover:border-brand-pink/50',
      ].join(' ')}>
        <input type="file" accept="image/*" className="sr-only"
          onChange={(e) => onChange(e.target.files[0] || null)} />
        {uploading ? (
          <span className="flex items-center gap-2 text-brand-ink-soft text-sm">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            جاري الرفع...
          </span>
        ) : uploaded ? (
          <span className="flex items-center gap-2 text-brand-pink text-sm font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
              <path d="m5 12 5 5 9-11" />
            </svg>
            <span className="truncate max-w-[220px]">{file?.name || 'تم رفع الإيصال'}</span>
          </span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8 text-brand-ink-soft">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-sm text-brand-ink-soft">{label}</span>
            {hint && <span className="text-xs text-brand-ink-soft/60">{hint}</span>}
          </>
        )}
      </label>
      {error && <p className="text-xs text-[#D64545] mt-1.5">{error}</p>}
    </div>
  );
}

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

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-brand-ink-soft">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
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
