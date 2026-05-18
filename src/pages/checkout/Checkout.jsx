import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { toArabicDigits } from '../../utils/arabic.js';

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
  const { items, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:'', phone:'', email:'',
    governorate:'', city:'', street:'', building:'', notes:'',
  });
  const [payment, setPayment] = useState('cod');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const total = subtotal + SHIPPING;

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <h1 className="text-4xl mb-4">السلة فارغة</h1>
        <p className="text-brand-ink-soft mb-8">أضيفي منتجات للسلة أولاً.</p>
        <Link to="/shop" className="btn btn-primary">ابدئي التسوّق</Link>
      </div>
    );
  }

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) e.phone = 'رقم هاتف مصري غير صحيح';
    if (!form.governorate) e.governorate = 'اختاري المحافظة';
    if (!form.city.trim()) e.city = 'المدينة مطلوبة';
    if (!form.street.trim()) e.street = 'العنوان مطلوب';
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
          <Link to="/" className="hover:text-brand-pink">الرئيسية</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-brand-pink">السلة</Link>
          <span>/</span>
          <span className="text-brand-ink">إتمام الطلب</span>
        </nav>

        <h1 className="text-4xl mb-8">إتمام الطلب</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── Left: form ── */}
            <div className="space-y-6">

              {/* Delivery */}
              <Card title="بيانات التوصيل" icon={<TruckIcon />}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="الاسم الكامل" error={errors.name} required>
                    <input
                      type="text" value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="مثال: نور أحمد"
                      className={inputCls(errors.name)}
                    />
                  </Field>
                  <Field label="رقم الهاتف" error={errors.phone} required>
                    <input
                      type="tel" value={form.phone} dir="ltr"
                      onChange={e => set('phone', e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className={inputCls(errors.phone)}
                    />
                  </Field>
                  <Field label="البريد الإلكتروني" className="sm:col-span-2">
                    <input
                      type="email" value={form.email} dir="ltr"
                      onChange={e => set('email', e.target.value)}
                      placeholder="اختياري — لإرسال تأكيد الطلب"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="المحافظة" error={errors.governorate} required>
                    <select
                      value={form.governorate}
                      onChange={e => set('governorate', e.target.value)}
                      className={inputCls(errors.governorate)}
                    >
                      <option value="">اختاري المحافظة</option>
                      {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="المدينة / الحي" error={errors.city} required>
                    <input
                      type="text" value={form.city}
                      onChange={e => set('city', e.target.value)}
                      placeholder="مثال: المعادي"
                      className={inputCls(errors.city)}
                    />
                  </Field>
                  <Field label="الشارع" error={errors.street} required className="sm:col-span-2">
                    <input
                      type="text" value={form.street}
                      onChange={e => set('street', e.target.value)}
                      placeholder="اسم الشارع والرقم"
                      className={inputCls(errors.street)}
                    />
                  </Field>
                  <Field label="رقم المبنى / الشقة">
                    <input
                      type="text" value={form.building}
                      onChange={e => set('building', e.target.value)}
                      placeholder="مثال: عمارة ٣، شقة ١٢"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="ملاحظات للمندوب">
                    <input
                      type="text" value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      placeholder="أي تعليمات إضافية"
                      className={inputCls()}
                    />
                  </Field>
                </div>
              </Card>

              {/* Payment */}
              <Card title="طريقة الدفع" icon={<CardIcon />}>
                <div className="space-y-3">
                  <PayOption value="cod" current={payment} onChange={setPayment}
                    icon="💵" label="الدفع عند الاستلام" desc="ادفعي كاش لما يوصل الطلب" />
                  <PayOption value="instapay" current={payment} onChange={setPayment}
                    icon="📲" label="InstaPay" desc="تحويل إلكتروني سريع" />
                  <PayOption value="vodafone" current={payment} onChange={setPayment}
                    icon="📱" label="Vodafone Cash" desc="تحويل عبر فودافون كاش" />
                </div>
              </Card>
            </div>

            {/* ── Right: summary ── */}
            <div className="space-y-4 lg:sticky lg:top-28">
              <Card title="ملخص الطلب" icon={<BagIcon />}>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-brand-sm overflow-hidden p-bg-1 shrink-0">
                        {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="text-xs text-brand-ink-soft">×{toArabicDigits(item.qty)}</div>
                      </div>
                      <div className="text-sm font-bold text-brand-pink whitespace-nowrap">
                        {toArabicDigits(parsePrice(item.price) * item.qty)} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-line pt-4 space-y-2.5 text-sm">
                  <SummaryRow label="المجموع الفرعي" value={`${toArabicDigits(subtotal)} ج.م`} />
                  <SummaryRow label="رسوم الشحن" value={`${toArabicDigits(SHIPPING)} ج.م`} />
                  <div className="flex justify-between items-center border-t border-brand-line pt-3 mt-1">
                    <span className="font-amiri text-xl">الإجمالي</span>
                    <span className="font-amiri text-2xl text-brand-pink font-bold">
                      {toArabicDigits(total)} ج.م
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
                    جاري إرسال الطلب...
                  </span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
                      <path d="m5 12 5 5 9-11" />
                    </svg>
                    تأكيد الطلب
                  </>
                )}
              </button>

              <p className="text-xs text-brand-ink-soft text-center leading-relaxed">
                بالضغط على تأكيد الطلب أنتِ توافقين على شروط الاستخدام وسياسة الخصوصية.
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
    hasError
      ? 'border-[#D64545] focus:border-[#D64545]'
      : 'border-brand-line focus:border-brand-pink',
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
