import { useState } from 'react';
import { SectionHead } from '../../components/SectionHead.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import { sendMessage } from '../../services/contentService.js';

const ITEM_ICONS = [
  <PhoneIcon />,
  <MailIcon />,
  <MapPinIcon />,
  <ClockIcon />,
];

export default function Contact() {
  const { t } = useLang();
  const { c } = useContent();
  const contactItems = c('contact.items', []);
  const subjects = c('contact.subjects', []);

  const [form, setFormState] = useState({ name: '', contact: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => {
    setFormState(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = c('contact.errors.name');
    if (!form.contact.trim()) e.contact = c('contact.errors.contact');
    if (!form.subject) e.subject = c('contact.errors.subject');
    if (form.message.trim().length < 10) e.message = c('contact.errors.message');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});
    try {
      // Lands in the dashboard's Messages screen and bumps its sidebar badge.
      await sendMessage({
        name: form.name.trim(),
        contact: form.contact.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setErrors(err.errors
        ? Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))
        : { _: err.message });
    } finally {
      setSubmitting(false);
    }
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
            {c('contact.kicker')}
          </p>
          <h1 className="text-[clamp(32px,4.5vw,56px)] mb-4">{c('contact.title')}</h1>
          <p className="text-brand-ink-soft text-[17px] max-w-xl mx-auto">
            {c('contact.desc')}
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
                  <h3 className="text-2xl mb-3 font-amiri">{c('contact.sent')}</h3>
                  <p className="text-brand-ink-soft text-sm mb-6">{c('contact.sentDesc')}</p>
                  <button onClick={() => { setSent(false); setFormState({ name: '', contact: '', subject: '', message: '' }); }}
                    className="btn btn-outline">{c('contact.sendAnother')}</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl mb-6 flex items-center gap-2.5">
                    <span className="text-brand-pink"><MessageIcon /></span>
                    {c('contact.formTitle')}
                  </h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={c('contact.fullName')} error={errors.name} required>
                        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                          placeholder={c('contact.namePlaceholder')} className={inputCls(errors.name)} />
                      </Field>
                      <Field label={c('contact.phoneOrEmail')} error={errors.contact} required>
                        <input type="text" value={form.contact} onChange={e => set('contact', e.target.value)}
                          placeholder={c('contact.phonePlaceholder')} className={inputCls(errors.contact)} dir="ltr" />
                      </Field>
                    </div>
                    <Field label={c('contact.subject')} error={errors.subject} required>
                      <select value={form.subject} onChange={e => set('subject', e.target.value)}
                        className={inputCls(errors.subject)}>
                        <option value="">{c('contact.chooseSubject')}</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label={c('contact.messageLbl')} error={errors.message} required>
                      <textarea value={form.message} onChange={e => set('message', e.target.value)}
                        rows={5} placeholder={c('contact.writePlaceholder')}
                        className={`${inputCls(errors.message)} resize-none`} />
                    </Field>
                    <button type="submit" disabled={submitting}
                      className="btn btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          {c('contact.sending')}
                        </span>
                      ) : c('contact.sendMessage')}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4 lg:sticky lg:top-28">
              {contactItems.map((item, i) => (
                <div key={i} className="bg-white rounded-brand p-5 shadow-brand-sm flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-full bg-brand-pink-softer text-brand-pink flex items-center justify-center shrink-0">
                    {ITEM_ICONS[i]}
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
                <div className="text-sm font-semibold mb-3">{c('contact.followUs')}</div>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/akwab_official_/" target="_blank" rel="noopener noreferrer"
                    aria-label="إنستغرام"
                    className="w-10 h-10 rounded-xl bg-brand-cream text-brand-ink-soft flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@akwab_official" target="_blank" rel="noopener noreferrer"
                    aria-label="تيك توك"
                    className="w-10 h-10 rounded-xl bg-brand-cream text-brand-ink-soft flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                      <path d="M16 3v2.5a5.5 5.5 0 0 0 5 5.5v3a8 8 0 0 1-5-1.8V17a6 6 0 1 1-6-6h1v3h-1a3 3 0 1 0 3 3V3z" />
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/share/1JRzZ2ggrL/" target="_blank" rel="noopener noreferrer"
                    aria-label="فيسبوك"
                    className="w-10 h-10 rounded-xl bg-brand-cream text-brand-ink-soft flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
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
