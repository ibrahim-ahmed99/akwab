import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toArabicDigits } from '../utils/arabic.js';
import { useLang } from '../context/LanguageContext.jsx';

export default function Nav() {
  const { count }              = useCart();
  const { count: wishCount }   = useWishlist();
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const { t, toggle }          = useLang();
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);

  const NAV_LINKS = [
    { to: '/',        label: t('nav.home'),    end: true },
    { to: '/shop',    label: t('nav.shop')              },
    { to: '/about',   label: t('nav.about')             },
    { to: '/contact', label: t('nav.contact')           },
  ];

  const closeAll = () => { setMobileOpen(false); setUserMenuOpen(false); };

  const handleLogout = () => { logout(); closeAll(); navigate('/'); };

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-line">
        <div className="akwab-container grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 py-2.5 md:py-3.5">

          {/* ── Col 1: Desktop nav  /  Mobile burger ── */}
          <div className="justify-self-start">
            {/* Desktop */}
            <nav className="hidden md:flex gap-1.5 items-center">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to} to={l.to} end={l.end}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-full font-medium text-[15px] transition-all relative ${
                      isActive
                        ? 'text-brand-pink'
                        : 'text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <span className="absolute bottom-0.5 right-1/2 translate-x-1/2 w-4 h-0.5 bg-brand-pink rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile burger */}
            <button
              className="md:hidden w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-all"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={t('nav.menu')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
                {mobileOpen
                  ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
                  : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
                }
              </svg>
            </button>
          </div>

          {/* ── Col 2: Logo ── */}
          <Link to="/" onClick={closeAll} className="flex items-center gap-2.5 justify-self-center">
            {/* الشعار: أصغر على الموبايل */}
            <img
              src="/assets/akwab-logo-transparent.png"
              alt="أكواب"
              className="h-[56px] md:h-[88px] w-auto"
            />
            {/* النص مخفي على الموبايل */}
            <div className="hidden md:flex flex-col leading-none">
              <span className="font-amiri text-2xl text-brand-pink font-bold">أكواب</span>
              <span className="text-[10px] tracking-[0.35em] text-brand-ink-soft mt-1">ONLINE SHOP</span>
            </div>
          </Link>

          {/* ── Col 3: Icons ── */}
          <div className="flex items-center gap-1 md:gap-1.5 justify-self-end">

            {/* Lang toggle */}
            <button
              onClick={toggle}
              className="hidden md:flex w-[42px] h-[42px] rounded-full items-center justify-center text-xs font-bold text-brand-pink border border-brand-pink hover:bg-brand-pink hover:text-white transition-all"
              aria-label="تغيير اللغة"
            >
              {t('nav.lang')}
            </button>

            {/* Search — hidden on mobile (in burger menu) */}
            <span className="hidden md:block">
              <IconBtn label={t('nav.search')} onClick={() => navigate('/search')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
              </IconBtn>
            </span>

            {/* Wishlist */}
            <Link
              to="/wishlist" aria-label={t('nav.favorites') || 'wishlist'}
              className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5"
            >
              <span className="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.8]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
                  <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
                </svg>
              </span>
              {wishCount > 0 && <Badge>{toArabicDigits(wishCount)}</Badge>}
            </Link>

            {/* User — hidden on mobile (in burger menu) */}
            <span className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full hover:bg-brand-pink-softer transition-all"
                    aria-label={t('nav.profile')}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold font-cairo shrink-0">
                      {user.name?.charAt(0) || '؟'}
                    </div>
                    <span className="text-sm font-medium text-brand-ink hidden lg:block max-w-[80px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      className={`w-3.5 h-3.5 text-brand-ink-soft transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-brand shadow-brand-lg z-50 overflow-hidden py-1.5 border border-brand-line">
                        <div className="px-4 py-3 border-b border-brand-line">
                          <div className="text-sm font-semibold text-brand-ink truncate">{user.name}</div>
                          {user.phone && <div className="text-xs text-brand-ink-soft mt-0.5" dir="ltr">{user.phone}</div>}
                        </div>
                        <DropLink to="/profile" onClick={() => setUserMenuOpen(false)} icon={<UserIcon />}>{t('nav.profile')}</DropLink>
                        <DropLink to="/profile?tab=orders" onClick={() => setUserMenuOpen(false)} icon={<OrderIcon />}>{t('nav.myOrders')}</DropLink>
                        <div className="border-t border-brand-line mt-1 pt-1">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#D64545] hover:bg-[#fde8e8] transition-colors">
                            <LogoutIcon /> {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="btn btn-primary text-sm px-5 py-2 gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  {t('nav.login')}
                </Link>
              )}
            </span>

            {/* Cart */}
            <Link to="/cart" aria-label={t('nav.cart') || 'cart'}
              className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className="w-5 h-5" strokeWidth="1.8">
                <path d="M5 6h16l-2 11H7Z" />
                <path d="M9 6a3 3 0 0 1 6 0" />
                <circle cx="9" cy="21" r="1.2" /><circle cx="17" cy="21" r="1.2" />
              </svg>
              {count > 0 && <Badge>{toArabicDigits(count)}</Badge>}
            </Link>
          </div>
        </div>

        {/* ── Mobile menu dropdown ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-line bg-brand-cream/95 backdrop-blur-md">
            <div className="akwab-container py-3 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to} to={l.to} end={l.end}
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-[14px] font-medium text-[15px] transition-colors ${
                      isActive
                        ? 'bg-brand-pink-softer text-brand-pink'
                        : 'text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              {/* Search */}
              <button
                onClick={() => { navigate('/search'); closeAll(); }}
                className="px-4 py-3 rounded-[14px] font-medium text-[15px] text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors text-start flex items-center gap-2.5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" className="w-4 h-4">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                {t('nav.search')}
              </button>

              {/* Lang toggle mobile */}
              <button
                onClick={() => { toggle(); closeAll(); }}
                className="px-4 py-3 rounded-[14px] font-medium text-[15px] text-brand-pink hover:bg-brand-pink-softer transition-colors text-start flex items-center gap-2.5"
              >
                🌐 {t('nav.lang') === 'EN' ? 'English' : 'العربية'}
              </button>

              {/* Auth */}
              <div className="pt-2 mt-1 border-t border-brand-line">
                {user ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold font-cairo shrink-0">
                        {user.name?.charAt(0) || '؟'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-ink">{user.name}</p>
                        {user.phone && <p className="text-xs text-brand-ink-soft" dir="ltr">{user.phone}</p>}
                      </div>
                    </div>
                    <Link to="/profile" onClick={closeAll}
                      className="px-4 py-3 rounded-[14px] font-medium text-[15px] text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors flex items-center gap-2.5">
                      <UserIcon /> {t('nav.profile')}
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-[14px] font-medium text-[15px] text-[#D64545] hover:bg-[#fde8e8] transition-colors text-start flex items-center gap-2.5">
                      <LogoutIcon /> {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={closeAll}
                    className="btn btn-primary w-full justify-center text-[15px] py-3 rounded-[14px]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeAll} />
      )}
    </>
  );
}

/* ── Small helpers ── */
function IconBtn({ label, onClick, children }) {
  return (
    <button aria-label={label} onClick={onClick}
      className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5">
      <span className="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.8]">{children}</span>
    </button>
  );
}

function Badge({ children }) {
  return (
    <span className="absolute -top-1 -left-1 bg-brand-pink text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-brand-md">
      {children}
    </span>
  );
}

function DropLink({ to, onClick, icon, children }) {
  return (
    <Link to={to} onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors">
      {icon}{children}
    </Link>
  );
}

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
    <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const OrderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
