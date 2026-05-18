import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toArabicDigits } from '../utils/arabic.js';

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/shop', label: 'المتجر' },
  { to: '/about', label: 'من نحن' },
  { to: '/blog', label: 'المدونة' },
  { to: '/contact', label: 'تواصلي معنا' },
];

export default function Nav() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/85 backdrop-blur-md border-b border-brand-line">
      <div className="akwab-container grid grid-cols-[1fr_auto_1fr] items-center gap-6 py-3.5">

        {/* Left — nav links */}
        <nav className="hidden md:flex gap-1.5 items-center justify-self-start">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
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
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 right-1/2 translate-x-1/2 w-4.5 h-0.5 bg-brand-pink rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Center — Logo */}
        <Link to="/" className="flex items-center gap-3 justify-self-center">
          <img src="/assets/akwab-logo-transparent.png" alt="أكواب" className="h-[88px] w-auto" />
          <div className="flex flex-col leading-none">
            <span className="font-amiri text-2xl text-brand-pink font-bold">أكواب</span>
            <span className="text-[10px] tracking-[0.35em] text-brand-ink-soft mt-1">ONLINE SHOP</span>
          </div>
        </Link>

        {/* Right — icon buttons */}
        <div className="flex items-center gap-1.5 justify-self-end">

          {/* Search */}
          <IconButton label="بحث" onClick={() => navigate('/search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
          </IconButton>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="المفضلة"
            className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5"
          >
            <span className="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.8]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
              </svg>
            </span>
            {wishCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-brand-pink text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-brand-md">
                {toArabicDigits(wishCount)}
              </span>
            )}
          </Link>

          {/* User — logged in: dropdown / logged out: login button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(p => !p)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full hover:bg-brand-pink-softer transition-all"
                aria-label="قائمة المستخدم"
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
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  {/* Dropdown */}
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-brand shadow-brand-lg z-50 overflow-hidden py-1.5 border border-brand-line">
                    <div className="px-4 py-3 border-b border-brand-line">
                      <div className="text-sm font-semibold text-brand-ink truncate">{user.name}</div>
                      {user.phone && <div className="text-xs text-brand-ink-soft mt-0.5" dir="ltr">{user.phone}</div>}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                        <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                      الملف الشخصي
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-pink-softer hover:text-brand-pink transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                      طلباتي
                    </Link>
                    <div className="border-t border-brand-line mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#D64545] hover:bg-[#fde8e8] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn btn-primary text-sm px-5 py-2 gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              تسجيل الدخول
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="السلة"
            className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className="w-5 h-5" strokeWidth="1.8">
              <path d="M5 6h16l-2 11H7Z" />
              <path d="M9 6a3 3 0 0 1 6 0" />
              <circle cx="9" cy="21" r="1.2" />
              <circle cx="17" cy="21" r="1.2" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-brand-pink text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-brand-md">
                {toArabicDigits(count)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-brand-ink transition-all hover:bg-brand-pink-softer hover:text-brand-pink hover:-translate-y-0.5"
    >
      <span className="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.8]">
        {children}
      </span>
    </button>
  );
}
