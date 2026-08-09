import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Auth() {
  const { t } = useLang();
  const [tab, setTab] = useState('login');

  const TABS = [
    { key: 'login', label: t('auth.loginTab') },
    { key: 'register', label: t('auth.registerTab') },
  ];

  return (
    <section className="py-16 min-h-[calc(100vh-200px)] flex items-center">
      <div className="akwab-container w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <img src="/assets/akwab-logo-transparent.png" alt="أكواب" className="h-20 w-auto" />
            <div>
              <div className="font-amiri text-2xl text-brand-pink font-bold">أكواب</div>
              <div className="text-[10px] tracking-[0.35em] text-brand-ink-soft">ONLINE SHOP</div>
            </div>
          </Link>
          <p className="text-brand-ink-soft mt-3 text-sm">
            {tab === 'login' ? t('auth.welcomeBack') : t('auth.joinFamily')}
          </p>
        </div>

        <div className="bg-white rounded-brand shadow-brand-lg overflow-hidden">
          {/* Gradient top bar */}
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg,#E0478A,#C8A84B,#89B8D8,#E0478A)' }} />

          <div className="p-8">
            {/* Tab switcher */}
            <div className="flex bg-brand-cream rounded-full p-1 mb-8">
              {TABS.map(tabItem => (
                <button
                  key={tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    tab === tabItem.key
                      ? 'bg-white text-brand-pink shadow-brand-sm'
                      : 'text-brand-ink-soft hover:text-brand-ink'
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            {tab === 'login'
              ? <LoginForm />
              : <RegisterForm />
            }
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Login ── */
function LoginForm() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setFormState] = useState({ credential: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => {
    setFormState(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.credential.trim()) e.credential = t('auth.errorCredential');
    if (form.password.length < 6) e.password = t('auth.errorPassShort');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});
    try {
      // Signing in merges whatever the guest identity had in its cart and
      // wishlist into the account, server-side.
      await login(form.credential.trim(), form.password);
      navigate('/');
    } catch (err) {
      setErrors(
        err.status === 401
          ? { _: t('auth.invalidCredentials') }
          : mapErrors(err, t),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors._ && <FormError message={errors._} />}

      <Field label={t('auth.credentialLabel')} error={errors.credential} required>
        <input
          type="text" value={form.credential} dir="ltr"
          onChange={e => set('credential', e.target.value)}
          placeholder={t('auth.credentialPlaceholder')}
          className={inputCls(errors.credential)}
        />
      </Field>

      <Field label={t('auth.passwordLabel')} error={errors.password} required>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'} value={form.password} dir="ltr"
            onChange={e => set('password', e.target.value)}
            placeholder="••••••••"
            className={`${inputCls(errors.password)} pl-10`}
          />
          <button
            type="button"
            onClick={() => setShowPass(p => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-soft hover:text-brand-pink transition-colors"
            aria-label={showPass ? t('auth.hide') : t('auth.show')}
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox" checked={form.remember}
            onChange={e => set('remember', e.target.checked)}
            className="w-4 h-4 rounded accent-[#E0478A]"
          />
          <span className="text-brand-ink-soft">{t('auth.rememberMe')}</span>
        </label>
      </div>

      <button
        type="submit" disabled={submitting}
        className="btn btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? <Spinner label={t('auth.loggingIn')} /> : t('auth.loginBtn')}
      </button>
    </form>
  );
}

/* ── Register ── */
function RegisterForm() {
  const { t } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setFormState] = useState({
    name: '', phone: '', email: '', password: '', confirm: '', terms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => {
    setFormState(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('auth.errorName');
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) e.phone = t('auth.errorPhone');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = t('auth.errorEmail');
    if (form.password.length < 8) e.password = t('auth.errorPass8');
    if (form.password !== form.confirm) e.confirm = t('auth.errorPassMatch');
    if (!form.terms) e.terms = t('auth.errorTerms');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});
    try {
      await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
        password_confirmation: form.confirm,
      });
      navigate('/');
    } catch (err) {
      setErrors(mapErrors(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors._ && <FormError message={errors._} />}

      <Field label={t('auth.fullName')} error={errors.name} required>
        <input
          type="text" value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder={t('auth.namePlaceholder')}
          className={inputCls(errors.name)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t('auth.phone')} error={errors.phone} required>
          <input
            type="tel" value={form.phone} dir="ltr"
            onChange={e => set('phone', e.target.value)}
            placeholder="01xxxxxxxxx"
            className={inputCls(errors.phone)}
          />
        </Field>
        <Field label={t('auth.emailOptional')} error={errors.email}>
          <input
            type="email" value={form.email} dir="ltr"
            onChange={e => set('email', e.target.value)}
            placeholder={t('auth.emailOptionalPlaceholder')}
            className={inputCls(errors.email)}
          />
        </Field>
      </div>

      <Field label={t('auth.passwordLabel')} error={errors.password} required>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'} value={form.password} dir="ltr"
            onChange={e => set('password', e.target.value)}
            placeholder={t('auth.passMin')}
            className={`${inputCls(errors.password)} pl-10`}
          />
          <button
            type="button"
            onClick={() => setShowPass(p => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-soft hover:text-brand-pink transition-colors"
            aria-label={showPass ? t('auth.hide') : t('auth.show')}
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {form.password && <PasswordStrength password={form.password} />}
      </Field>

      <Field label={t('auth.confirmPass')} error={errors.confirm} required>
        <input
          type={showPass ? 'text' : 'password'} value={form.confirm} dir="ltr"
          onChange={e => set('confirm', e.target.value)}
          placeholder={t('auth.confirmPassPlaceholder')}
          className={inputCls(errors.confirm)}
        />
      </Field>

      <div>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox" checked={form.terms}
            onChange={e => set('terms', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-[#E0478A]"
          />
          <span className="text-sm text-brand-ink-soft leading-relaxed">
            {t('auth.agreeTerms')}{' '}
            <Link to="/faq" className="text-brand-pink hover:underline font-medium">{t('auth.termsLink')}</Link>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-[#D64545] mt-1">{errors.terms}</p>}
      </div>

      <button
        type="submit" disabled={submitting}
        className="btn btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? <Spinner label={t('auth.creating')} /> : t('auth.createAccount')}
      </button>
    </form>
  );
}

/** Flattens the API's {field: [msg]} validation payload onto the form. */
function mapErrors(err, t) {
  if (!err.errors) return { _: err.message || t('auth.genericError') };
  const out = Object.fromEntries(
    Object.entries(err.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  // The API calls it password_confirmation; the form field is "confirm".
  if (out.password_confirmation) out.confirm = out.password_confirmation;
  return out;
}

function FormError({ message }) {
  return (
    <div className="bg-[#fde8e8] border border-[#f5c2c2] text-[#D64545] rounded-brand-sm px-4 py-3 text-sm font-medium">
      {message}
    </div>
  );
}

/* ── Shared helpers ── */

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

function Spinner({ label }) {
  return (
    <span className="flex items-center gap-2">
      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
      {label}
    </span>
  );
}





function PasswordStrength({ password }) {
  const { t } = useLang();
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const levels = [
    { label: t('auth.passStrengthWeak'),   color: '#D64545' },
    { label: t('auth.passStrengthFair'),   color: '#C8A84B' },
    { label: t('auth.passStrengthGood'),   color: '#89B8D8' },
    { label: t('auth.passStrengthStrong'), color: '#25D366' },
  ];
  const lvl = levels[score - 1] || levels[0];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i <= score ? lvl.color : '#F0E3E8' }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: lvl.color }}>{lvl.label}</p>
    </div>
  );
}

/* ── Icons ── */
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m1 1 22 22" />
    </svg>
  );
}




