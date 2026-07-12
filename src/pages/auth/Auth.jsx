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
              : <RegisterForm onSwitch={() => setTab('login')} />
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      login({ name: form.credential.includes('@') ? 'مستخدم' : form.credential, phone: form.credential });
      setSubmitting(false);
      navigate('/');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        <button type="button" className="text-brand-pink hover:underline font-medium">
          {t('auth.forgotPass')}
        </button>
      </div>

      <button
        type="submit" disabled={submitting}
        className="btn btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? <Spinner label={t('auth.loggingIn')} /> : t('auth.loginBtn')}
      </button>

      <Divider />
      <SocialButtons />
    </form>
  );
}

/* ── Register ── */
function RegisterForm({ onSwitch }) {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setFormState] = useState({
    name: '', phone: '', email: '', password: '', confirm: '', terms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      login({ name: form.name, phone: form.phone, email: form.email });
      setSubmitting(false);
      navigate('/');
    }, 1200);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#E0478A" strokeWidth="2.5" strokeLinecap="round" className="w-8 h-8">
            <path d="m5 12 5 5 9-11" />
          </svg>
        </div>
        <h3 className="text-xl mb-2 font-amiri">{t('auth.accountCreated')}</h3>
        <p className="text-brand-ink-soft text-sm mb-6">{t('auth.canLoginNow')}</p>
        <button onClick={onSwitch} className="btn btn-primary justify-center">
          {t('auth.loginNow')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
            <button type="button" className="text-brand-pink hover:underline font-medium">{t('auth.termsLink')}</button>
            {' '}{t('auth.and')}{' '}
            <button type="button" className="text-brand-pink hover:underline font-medium">{t('auth.privacyLink')}</button>
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

function Divider() {
  const { t } = useLang();
  return (
    <div className="flex items-center gap-3 text-xs text-brand-ink-soft my-2">
      <span className="flex-1 h-px bg-brand-line" />
      {t('auth.orLoginWith')}
      <span className="flex-1 h-px bg-brand-line" />
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialBtn icon={<GoogleIcon />} label="Google" />
      <SocialBtn icon={<FacebookIcon />} label="Facebook" />
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-brand-sm border border-brand-line bg-white hover:border-brand-pink/40 hover:bg-brand-pink-softer transition-all text-sm font-medium text-brand-ink"
    >
      {icon}
      {label}
    </button>
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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
