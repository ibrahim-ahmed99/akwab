import { useState } from 'react';
import { SectionHead } from '../../components/SectionHead.jsx';

const CONTACT_ITEMS = [
  {
    icon: <PhoneIcon />,
    label: 'واتساب',
    value: '01013958495',
    sub: 'متاحة من ١٠ص حتى ١٠م',
    href: 'https://wa.me/201013958495',
    btnLabel: 'ابدئي محادثة',
    btnClass: 'btn-whats',
  },
  {
    icon: <MailIcon />,
    label: 'البريد الإلكتروني',
    value: 'hello@akwab.shop',
    sub: 'نرد خلال ٢٤ ساعة',
    href: 'mailto:hello@akwab.shop',
    btnLabel: 'راسليني',
    btnClass: 'btn-outline',
  },
  {
    icon: <MapPinIcon />,
    label: 'الموقع',
    value: 'القاهرة، مصر',
    sub: 'التوصيل لكل المحافظات',
    href: null,
    btnLabel: null,
    btnClass: null,
  },
  {
    icon: <ClockIcon />,
    label: 'ساعات العمل',
    value: 'السبت – الخميس',
    sub: '١٠:٠٠ صباحاً — ١٠:٠٠ مساءً',
    href: null,
    btnLabel: null,
    btnClass: null,
  },
];

const SUBJECTS = [
  'استفسار عن منتج',
  'طلب تصميم مخصص',
  'مشكلة في الطلب',
  'شراء بالجملة',
  'تعاون أو شراكة',
  'أخرى',
];

export default function Contact() {
  const [form, setFormState] = useState({
    name: '', contact: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => {
    setFormState(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.contact.trim()) e.contact = 'رقم الهاتف أو البريد الإلكتروني مطلوب';
    if (!form.subject) e.subject = 'اختاري الموضوع';
    if (form.message.trim().length < 10) e.message = 'الرسالة قصيرة جداً';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSent(true); }, 1200);
  };

  return (
    <>
      {/* Header */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 60%,#d8e8f3 100%)' }}
      >
        <span className="absolute top-8 right-20 text-4xl opacity-20 select-none">🌸</span>
        <span className="absolute bottom-8 left-16 text-3xl opacity-20 select-none">✿</span>
        <div className="akwab-container relative z-10">
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
            تواصلي معنا
          </p>
          <h1 className="text-[clamp(32px,4.5vw,56px)] mb-4">كيف نقدر نساعدك؟</h1>
          <p className="text-brand-ink-soft text-[17px] max-w-xl mx-auto">
            سواء عندك سؤال عن منتج أو طلب مخصص أو أي استفسار — فريقنا هنا لك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="akwab-container max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* Form */}
            <div className="bg-white rounded-brand p-8 shadow-brand-sm">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-5"
                    style={{ boxShadow: '0 0 0 10px #fce8f0' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E0478A" strokeWidth="2.5" strokeLinecap="round" className="w-10 h-10">
                      <path d="m5 12 5 5 9-11" />
                    </svg>
                  </div>
                  <h3 className="text-2xl mb-3 font-amiri">تم إرسال رسالتك!</h3>
                  <p className="text-brand-ink-soft text-sm mb-6">سنتواصل معك خلال ٢٤ ساعة على أقصى تقدير.</p>
                  <button onClick={() => { setSent(false); setFormState({ name: '', contact: '', subject: '', message: '' }); }}
                    className="btn btn-outline">إرسال رسالة أخرى</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl mb-6 flex items-center gap-2.5">
                    <span className="text-brand-pink"><MessageIcon /></span>
                    أرسلي رسالة
                  </h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="الاسم الكامل" error={errors.name} required>
                        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                          placeholder="مثال: نور أحمد" className={inputCls(errors.name)} />
                      </Field>
                      <Field label="الهاتف أو البريد الإلكتروني" error={errors.contact} required>
                        <input type="text" value={form.contact} onChange={e => set('contact', e.target.value)}
                          placeholder="01xxxxxxxx أو email@..." className={inputCls(errors.contact)} dir="ltr" />
                      </Field>
                    </div>
                    <Field label="الموضوع" error={errors.subject} required>
                      <select value={form.subject} onChange={e => set('subject', e.target.value)}
                        className={inputCls(errors.subject)}>
                        <option value="">اختاري الموضوع</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="رسالتك" error={errors.message} required>
                      <textarea value={form.message} onChange={e => set('message', e.target.value)}
                        rows={5} placeholder="اكتبي رسالتك هنا..."
                        className={`${inputCls(errors.message)} resize-none`} />
                    </Field>
                    <button type="submit" disabled={submitting}
                      className="btn btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          جاري الإرسال...
                        </span>
                      ) : 'إرسال الرسالة'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4 lg:sticky lg:top-28">
              {CONTACT_ITEMS.map((item, i) => (
                <div key={i} className="bg-white rounded-brand p-5 shadow-brand-sm flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-full bg-brand-pink-softer text-brand-pink flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-brand-ink-soft mb-0.5">{item.label}</div>
                    <div className="font-semibold text-sm mb-0.5">{item.value}</div>
                    <div className="text-xs text-brand-ink-soft">{item.sub}</div>
                    {item.href && (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className={`btn ${item.btnClass} mt-3 text-xs px-4 py-2`}>
                        {item.btnLabel}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-white rounded-brand p-5 shadow-brand-sm">
                <div className="text-sm font-semibold mb-3">تابعينا على</div>
                <div className="flex gap-3">
                  {[
                    { label: 'Instagram', color: '#E0478A', icon: '📸' },
                    { label: 'TikTok', color: '#3D2540', icon: '🎵' },
                    { label: 'Pinterest', color: '#E0478A', icon: '📌' },
                  ].map(s => (
                    <button key={s.label} aria-label={s.label}
                      className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-lg hover:scale-110 transition-transform">
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

/* ── Helpers ── */
function Field({ label, error, required, children }) {
  return (
    <div>
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

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.5 5.5l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}

function MapPinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
}

function MessageIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
