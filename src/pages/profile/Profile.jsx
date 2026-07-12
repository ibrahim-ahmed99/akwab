import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { toArabicDigits, starsStr } from '../../utils/arabic.js';
import { useLang } from '../../context/LanguageContext.jsx';

const MOCK_USER = {
  name: 'نور أحمد',
  phone: '01012345678',
  email: 'nour@example.com',
  joinDate: 'يناير ٢٠٢٦',
};

const MOCK_ORDERS = [
  {
    id: '١٢٣٤٥٦',
    date: '٨ مايو ٢٠٢٦',
    status: 'تم التسليم',
    kind: 'delivered',
    items: [
      { name: 'كوب اليقطين الكريمي', qty: 1, price: '٤٢٠ ج.م' },
      { name: 'كوب الهالوين المرح', qty: 1, price: '٤٨٠ ج.م' },
    ],
    total: '٩٦٠ ج.م',
  },
  {
    id: '٧٨٩٠١٢',
    date: '٢ مايو ٢٠٢٦',
    status: 'قيد الشحن',
    kind: 'shipping',
    items: [
      { name: 'كوب الأقحوان الوردي', qty: 2, price: '٣٩٠ ج.م' },
    ],
    total: '٨٤٠ ج.م',
  },
  {
    id: '٣٤٥٦٧٨',
    date: '١٨ أبريل ٢٠٢٦',
    status: 'تم التسليم',
    kind: 'delivered',
    items: [
      { name: 'كوب تكفيني أنت وطناً لي', qty: 1, price: '٦٥٠ ج.م' },
    ],
    total: '٧١٠ ج.م',
  },
];

const STATUS_STYLE = {
  delivered: 'bg-[#e6f9ef] text-[#1a7a40]',
  shipping:  'bg-brand-blue-soft text-[#4a7fa0]',
  pending:   'bg-[#faf5e4] text-brand-gold',
  cancelled: 'bg-[#fde8e8] text-[#D64545]',
};

export default function Profile() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [tab, setTab] = useState('orders');
  const fmt = (n) => lang === 'ar' ? toArabicDigits(n) : String(n);

  const TABS = [
    { id: 'orders',   label: t('profile.ordersTab'),   icon: <BoxIcon /> },
    { id: 'wishlist', label: t('profile.wishlistTab'),  icon: <HeartIcon /> },
    { id: 'settings', label: t('profile.settingsTab'),  icon: <UserIcon /> },
  ];

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

  return (
    <section className="py-12">
      <div className="akwab-container max-w-4xl">

        {/* Profile header */}
        <div className="bg-white rounded-brand shadow-brand-sm p-6 mb-8 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-brand-pink text-white flex items-center justify-center text-2xl font-amiri font-bold shrink-0">
            {(user.name || 'م').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl mb-0.5">{user.name}</h1>
            <p className="text-sm text-brand-ink-soft">{t('profile.memberSince')} {MOCK_USER.joinDate}</p>
          </div>
          <div className="flex gap-3 text-center">
            <Stat num={fmt(MOCK_ORDERS.length)} label={t('profile.ordersLabel')} />
            <div className="w-px bg-brand-line" />
            <Stat num={fmt(MOCK_ORDERS.filter(o => o.kind === 'delivered').length)} label={t('profile.deliveredLabel')} />
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

        {/* Tab content */}
        {tab === 'orders'   && <OrdersTab />}
        {tab === 'wishlist' && <WishlistTab />}
        {tab === 'settings' && <SettingsTab />}

      </div>
    </section>
  );
}

/* ── Orders ── */
function OrdersTab() {
  const { t } = useLang();
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-4">
      {MOCK_ORDERS.map(order => (
        <div key={order.id} className="bg-white rounded-brand shadow-brand-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(p => p === order.id ? null : order.id)}
            className="w-full flex items-center justify-between gap-4 p-5 text-right"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold">#{order.id}</span>
              <span className="text-sm text-brand-ink-soft">{order.date}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.kind]}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-bold text-brand-pink">{order.total}</span>
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className={`w-4 h-4 transition-transform ${open === order.id ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${open === order.id ? 'max-h-64' : 'max-h-0'}`}>
            <div className="px-5 pb-5 border-t border-brand-line pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-brand-ink-soft">{item.name} × {item.qty}</span>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-brand-line mt-2">
                <span className="text-brand-ink-soft">{t('cart.shipping')}</span>
                <span className="font-medium">٦٠ ج.م</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{t('cart.total')}</span>
                <span className="text-brand-pink">{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {MOCK_ORDERS.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl mb-2">{t('profile.noOrders')}</h3>
          <p className="text-brand-ink-soft text-sm mb-6">{t('profile.noOrdersDesc')}</p>
          <Link to="/shop" className="btn btn-primary">{t('profile.shopNow')}</Link>
        </div>
      )}
    </div>
  );
}

/* ── Wishlist ── */
function WishlistTab() {
  const { t } = useLang();
  const { items, remove } = useWishlist();
  const { add } = useCart();
  const [added, setAdded] = useState(null);

  const handleAdd = (product) => {
    add(product, 1);
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
              aria-label="إزالة"
            >❤️</button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1 text-xs mb-1">
              <span className="text-brand-gold">{starsStr(product.rating)}</span>
            </div>
            <Link to={`/product/${product.id}`} className="block text-sm font-semibold hover:text-brand-pink transition-colors mb-1 truncate">
              {product.name}
            </Link>
            <div className="text-brand-pink font-bold text-sm mb-3">{product.price}</div>
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
  const [form, setFormState] = useState({ ...MOCK_USER });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => { setFormState(p => ({ ...p, [k]: v })); setSaved(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-brand shadow-brand-sm p-6">
      <h2 className="text-xl mb-6 flex items-center gap-2 text-brand-ink">
        <span className="text-brand-pink"><UserIcon /></span>
        {t('profile.personalData')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('profile.fullName')}>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('profile.phone')}>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} dir="ltr" className={inputCls} />
          </Field>
          <Field label={t('profile.email')} className="sm:col-span-2">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} dir="ltr" className={inputCls} />
          </Field>
        </div>

        <div className="border-t border-brand-line pt-5 mt-2">
          <h3 className="text-base font-semibold mb-4">{t('profile.changePassword')}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('profile.currentPass')}>
              <input type="password" placeholder="••••••••" dir="ltr" className={inputCls} />
            </Field>
            <Field label={t('profile.newPass')}>
              <input type="password" placeholder="••••••••" dir="ltr" className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn btn-primary">
            {saved ? (
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                  <path d="m5 12 5 5 9-11" />
                </svg>
                {t('profile.saved')}
              </span>
            ) : t('profile.saveChanges')}
          </button>
          <Link to="/auth" className="btn btn-outline text-[#D64545] border-[#D64545]/20 hover:bg-[#fde8e8] hover:border-[#D64545]">
            {t('profile.logout')}
          </Link>
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

function Field({ label, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-brand-ink mb-1.5">{label}</label>
      {children}
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
