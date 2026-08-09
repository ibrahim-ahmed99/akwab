import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice, digits } from '../../utils/arabic.js';
import { productPath } from '../../utils/routes.js';
import { useLang } from '../../context/LanguageContext.jsx';
import * as orderApi from '../../services/orderService.js';

const STATUS_STYLE = {
  delivered: 'bg-[#e6f9ef] text-[#1a7a40]',
  shipped: 'bg-brand-blue-soft text-[#4a7fa0]',
  processing: 'bg-brand-blue-soft text-[#4a7fa0]',
  confirmed: 'bg-brand-blue-soft text-[#4a7fa0]',
  pending: 'bg-[#faf5e4] text-brand-gold',
  cancelled: 'bg-[#fde8e8] text-[#D64545]',
};

export default function Profile() {
  const { t, lang } = useLang();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) { setOrdersLoading(false); return; }

    let cancelled = false;
    setOrdersLoading(true);

    orderApi.getOrders({ per_page: 20 })
      .then(({ items }) => { if (!cancelled) setOrders(items); })
      .catch(() => { if (!cancelled) setOrders([]); })
      .finally(() => { if (!cancelled) setOrdersLoading(false); });

    return () => { cancelled = true; };
  }, [user?.id]);

  const TABS = [
    { id: 'orders', label: t('profile.ordersTab'), icon: <BoxIcon /> },
    { id: 'wishlist', label: t('profile.wishlistTab'), icon: <HeartIcon /> },
    { id: 'settings', label: t('profile.settingsTab'), icon: <UserIcon /> },
  ];

  if (authLoading) {
    return <div className="akwab-container py-24"><div className="h-40 bg-white rounded-brand animate-pulse" /></div>;
  }

  if (!user) {
    return (
      <div className="akwab-container py-24 text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl mb-3">{t('profile.loginRequired')}</h1>
        <p className="text-brand-ink-soft mb-8">{t('profile.loginDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/auth" className="btn btn-primary justify-center">{t('profile.loginBtn')}</Link>
          <Link to="/shop" className="btn btn-outline justify-center">{t('profile.guestShop')}</Link>
        </div>
      </div>
    );
  }

  const delivered = orders.filter((o) => o.status === 'delivered').length;

  return (
    <section className="py-12">
      <div className="akwab-container max-w-4xl">

        {/* Profile header */}
        <div className="bg-white rounded-brand shadow-brand-sm p-6 mb-8 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-brand-pink text-white flex items-center justify-center text-2xl font-amiri font-bold shrink-0">
            {user.avatar || (user.name || 'م').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl mb-0.5">{user.name}</h1>
            <p className="text-sm text-brand-ink-soft">
              {t('profile.memberSince')} {formatJoined(user.joined_at, lang)}
            </p>
          </div>
          <div className="flex gap-3 text-center">
            <Stat num={digits(orders.length, lang)} label={t('profile.ordersLabel')} />
            <div className="w-px bg-brand-line" />
            <Stat num={digits(delivered, lang)} label={t('profile.deliveredLabel')} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-brand p-1.5 shadow-brand-sm mb-8 overflow-x-auto">
          {TABS.map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                tab === tabItem.id
                  ? 'bg-brand-pink text-white shadow-brand-md'
                  : 'text-brand-ink-soft hover:text-brand-ink'
              }`}
            >
              <span className={tab === tabItem.id ? 'text-white' : 'text-brand-ink-soft'}>{tabItem.icon}</span>
              {tabItem.label}
            </button>
          ))}
        </div>

        {tab === 'orders' && <OrdersTab orders={orders} loading={ordersLoading} />}
        {tab === 'wishlist' && <WishlistTab />}
        {tab === 'settings' && <SettingsTab />}

      </div>
    </section>
  );
}

function formatJoined(iso, lang) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long' });
}

/* ── Orders ── */
function OrdersTab({ orders, loading }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-brand h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl mb-2">{t('profile.noOrders')}</h3>
        <p className="text-brand-ink-soft text-sm mb-6">{t('profile.noOrdersDesc')}</p>
        <Link to="/shop" className="btn btn-primary">{t('profile.shopNow')}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-brand shadow-brand-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(p => p === order.id ? null : order.id)}
            className="w-full flex items-center justify-between gap-4 p-5 text-start"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold">{order.number}</span>
              <span className="text-sm text-brand-ink-soft">{order.date}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.status] ?? 'bg-brand-cream text-brand-ink-soft'}`}>
                {order.status_label}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-bold text-brand-pink">{formatPrice(order.total, lang)}</span>
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className={`w-4 h-4 transition-transform ${open === order.id ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </button>

          {open === order.id && (
            <div className="px-5 pb-5 border-t border-brand-line pt-4 space-y-2">
              {(order.items ?? []).map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-brand-ink-soft">
                    {item.name} × {digits(item.qty, lang)}
                  </span>
                  <span className="font-medium">{formatPrice(item.line_total, lang)}</span>
                </div>
              ))}

              <div className="flex justify-between text-sm pt-2 border-t border-brand-line mt-2">
                <span className="text-brand-ink-soft">{t('checkout.subtotal')}</span>
                <span className="font-medium">{formatPrice(order.subtotal, lang)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t('cart.discount')}</span>
                  <span className="font-medium">− {formatPrice(order.discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-brand-ink-soft">{t('cart.shipping')}</span>
                <span className="font-medium">{formatPrice(order.shipping, lang)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-brand-line">
                <span>{t('cart.total')}</span>
                <span className="text-brand-pink">{formatPrice(order.total, lang)}</span>
              </div>

              {order.address && (
                <p className="text-xs text-brand-ink-soft pt-2 leading-relaxed">
                  {order.address.name} — {order.address.phone}
                  <br />
                  {order.address.city}، {order.address.address}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Wishlist ── */
function WishlistTab() {
  const { t, lang } = useLang();
  const { items, remove } = useWishlist();
  const { add } = useCart();
  const [added, setAdded] = useState(null);

  const handleAdd = async (product) => {
    await add(product.id, 1);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🤍</div>
        <h3 className="text-xl mb-2">{t('profile.emptyWishlist')}</h3>
        <p className="text-brand-ink-soft text-sm mb-6">{t('profile.emptyWishlistDesc')}</p>
        <Link to="/shop" className="btn btn-primary">{t('profile.browseShop')}</Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(product => (
        <div key={product.id} className="bg-white rounded-brand shadow-brand-sm overflow-hidden">
          <div className={`aspect-square p-bg-${product.bg || 1} relative`}>
            {product.img && <img src={product.img} alt={product.name} className="w-full h-full object-cover" />}
            <button
              onClick={() => remove(product.id)}
              className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-brand-pink hover:bg-[#D64545] hover:text-white transition-all text-sm"
              aria-label={t('productCard.removeWish')}
            >❤️</button>
          </div>
          <div className="p-4">
            <Link to={productPath(product)} className="block text-sm font-semibold hover:text-brand-pink transition-colors mb-1 truncate">
              {product.name}
            </Link>
            <div className="text-brand-pink font-bold text-sm mb-3">{formatPrice(product.price, lang)}</div>
            <button
              onClick={() => handleAdd(product)}
              className={`w-full py-2 rounded-full text-xs font-semibold transition-all ${
                added === product.id
                  ? 'bg-brand-gold text-white'
                  : 'bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white'
              }`}
            >
              {added === product.id ? t('profile.addedToCart') : t('profile.addToCart')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Settings ── */
function SettingsTab() {
  const { t } = useLang();
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
      });

      // Only touch the password when the visitor actually filled the fields.
      if (passwords.current || passwords.next) {
        await updatePassword(passwords.current, passwords.next, passwords.confirm || passwords.next);
        setPasswords({ current: '', next: '', confirm: '' });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors(err.errors
        ? Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))
        : { _: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="bg-white rounded-brand shadow-brand-sm p-6">
      <h2 className="text-xl mb-6 flex items-center gap-2 text-brand-ink">
        <span className="text-brand-pink"><UserIcon /></span>
        {t('profile.personalData')}
      </h2>

      {errors._ && <p className="text-sm text-[#D64545] mb-4">{errors._}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('profile.fullName')} error={errors.name}>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('profile.phone')} error={errors.phone}>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} dir="ltr" className={inputCls} />
          </Field>
          <Field label={t('profile.email')} error={errors.email} className="sm:col-span-2">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} dir="ltr" className={inputCls} />
          </Field>
        </div>

        <div className="border-t border-brand-line pt-5 mt-2">
          <h3 className="text-base font-semibold mb-4">{t('profile.changePassword')}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('profile.currentPass')} error={errors.current_password}>
              <input
                type="password" placeholder="••••••••" dir="ltr" className={inputCls}
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              />
            </Field>
            <Field label={t('profile.newPass')} error={errors.password}>
              <input
                type="password" placeholder="••••••••" dir="ltr" className={inputCls}
                value={passwords.next}
                onChange={e => setPasswords(p => ({ ...p, next: e.target.value, confirm: e.target.value }))}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-70">
            {saved ? (
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                  <path d="m5 12 5 5 9-11" />
                </svg>
                {t('profile.saved')}
              </span>
            ) : t('profile.saveChanges')}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline text-[#D64545] border-[#D64545]/20 hover:bg-[#fde8e8] hover:border-[#D64545]"
          >
            {t('profile.logout')}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Helpers ── */
function Stat({ num, label }) {
  return (
    <div className="text-center px-3">
      <div className="font-amiri text-2xl text-brand-pink font-bold">{num}</div>
      <div className="text-xs text-brand-ink-soft">{label}</div>
    </div>
  );
}

function Field({ label, error, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-brand-ink mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-brand-sm border border-brand-line focus:border-brand-pink text-sm outline-none transition-colors bg-brand-cream/50';

function BoxIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" /></svg>;
}

function UserIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}
