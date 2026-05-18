import { Link } from 'react-router-dom';

/* ── Social icons ── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M16 3v2.5a5.5 5.5 0 0 0 5 5.5v3a8 8 0 0 1-5-1.8V17a6 6 0 1 1-6-6h1v3h-1a3 3 0 1 0 3 3V3z" />
  </svg>
);
const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M12 3a5 5 0 0 1 5 5v3c1 .5 2 1.2 3 1.2-.5 1-1.8 1.3-3 1.6.3 1.3 1.5 3 3.5 3.5-1 .8-2.5.5-3.8 1-.3 1-.5 1.7-1.2 1.7-1 0-1.5-1-3.5-1s-2.5 1-3.5 1c-.7 0-.9-.7-1.2-1.7-1.3-.5-2.8-.2-3.8-1 2-.5 3.2-2.2 3.5-3.5-1.2-.3-2.5-.6-3-1.6 1 0 2-.7 3-1.2V8a5 5 0 0 1 5-5Z" />
  </svg>
);
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.5s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.2-4.8 4.6 0 .9.3 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.3-5.3 6.3-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.9 2-1.3 2.7A10 10 0 1 0 12 2Z" />
  </svg>
);
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-pink">
    <path d="M3 7h18v12H3z" /><path d="m3 7 9 7 9-7" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-pink">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.6-3.1 20 20 0 0 1-6-6A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.7a2 2 0 0 1-.5 2L7.8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5c.8.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-pink">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const SOCIALS = [
  { label: 'إنستغرام', Icon: InstagramIcon, href: 'https://www.instagram.com/akwab_official_/' },
  { label: 'تيك توك',  Icon: TikTokIcon,    href: 'https://www.tiktok.com/@akwab_official' },
  { label: 'سناب شات', Icon: SnapchatIcon,   href: 'https://www.snapchat.com/add/akwab_official' },
  { label: 'بنترست',   Icon: PinterestIcon,  href: 'https://www.pinterest.com/akwab_official' },
];

const SHOP_LINKS = [
  { label: 'كل المنتجات',   to: '/shop' },
  { label: 'خزف',           to: '/category/pottery' },
  { label: 'بورسلين',       to: '/category/porcelain' },
  { label: 'زجاج',          to: '/category/glass' },
  { label: 'حسب الطلب',     to: '/category/custom' },
];

const HELP_LINKS = [
  { label: 'الأسئلة الشائعة',    to: '/faq' },
  { label: 'الشحن والتوصيل',     to: '/faq' },
  { label: 'سياسة الإرجاع',      to: '/faq' },
  { label: 'تواصلي معنا',        to: '/contact' },
  { label: 'تتبّع طلبك',         to: '/profile' },
];

export default function Footer() {
  return (
    <footer
      className="mt-20 relative overflow-hidden"
      style={{ background: '#2A1A2E', color: '#D8C8DC', paddingTop: '80px', paddingBottom: '30px' }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #E0478A, #C8A84B, #89B8D8, #E0478A)' }} />

      <div className="akwab-container">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-12">

          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/assets/akwab-logo-transparent.png" alt="أكواب" className="h-24 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="font-amiri text-2xl text-brand-pink font-bold">أكواب</span>
                <span className="text-[10px] tracking-[0.35em] mt-1" style={{ color: '#A598AA' }}>ONLINE SHOP</span>
              </div>
            </Link>
            <p className="text-sm leading-[1.8] max-w-[320px]" style={{ color: '#B5A3BA' }}>
              متجر عربي مستقل للأكواب الفنية وأطقم الشاي. نصنع تصاميمنا بحب، ونشحنها بعناية إلى كل بيت.
            </p>
            <div className="flex gap-2.5 mt-5">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-[250ms] hover:bg-brand-pink hover:text-white hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,.06)', color: '#D8C8DC' }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <FooterCol title="تسوّقي" links={SHOP_LINKS} />

          {/* Help column */}
          <FooterCol title="المساعدة" links={HELP_LINKS} />

          {/* Contact column */}
          <div>
            <FooterHeading>تواصلي معنا</FooterHeading>
            <ul className="flex flex-col gap-3 text-sm" style={{ color: '#B5A3BA' }}>
              <li>
                <a href="mailto:hello@akwab.shop" className="flex items-start gap-2.5 hover:text-brand-pink transition-colors">
                  <EmailIcon /> hello@akwab.shop
                </a>
              </li>
              <li>
                <a href="https://wa.me/201013958495" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-brand-pink transition-colors">
                  <PhoneIcon /> +٢٠ ١٠ ١٣٩٥ ٨٤٩٥
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <LocationIcon /> القاهرة، جمهورية مصر العربية
              </li>
            </ul>

            <div className="mt-6">
              <FooterHeading>روابط سريعة</FooterHeading>
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: '#B5A3BA' }}>
                <li><Link to="/about" className="hover:text-brand-pink transition-colors">من نحن</Link></li>
                <li><Link to="/blog" className="hover:text-brand-pink transition-colors">المدونة</Link></li>
                <li><Link to="/auth" className="hover:text-brand-pink transition-colors">تسجيل الدخول</Link></li>
                <li><Link to="/wishlist" className="hover:text-brand-pink transition-colors">المفضلة</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t text-xs"
          style={{ borderColor: 'rgba(255,255,255,.08)', color: '#8E7D93' }}>
          <span>© ٢٠٢٦ أكواب. جميع الحقوق محفوظة — صُنع بحبٍّ في القاهرة.</span>
          <div className="flex gap-2 flex-wrap items-center">
            {['فيزا', 'ماستركارد', 'فودافون كاش', 'انستاباي', 'الدفع عند الاستلام'].map((p) => (
              <span key={p} className="px-3 py-1 rounded-lg text-[11px] font-semibold"
                style={{ background: 'rgba(255,255,255,.06)', color: '#B5A3BA' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }) {
  return (
    <h4 className="font-cairo text-white text-base font-semibold mb-5 relative pb-3">
      {children}
      <span className="absolute bottom-0 right-0 w-8 h-0.5 bg-brand-pink" />
    </h4>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="flex flex-col gap-3 text-sm" style={{ color: '#B5A3BA' }}>
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} className="transition-all duration-200 hover:text-brand-pink hover:pe-1.5">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
