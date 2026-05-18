import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts.js';
import { SectionHead } from '../../components/SectionHead.jsx';

const ICONS = {
  pottery: (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[52px] h-[52px]">
      <path d="M28 22 Q28 16 40 16 Q52 16 52 22 L54 30 Q62 34 62 44 Q62 60 50 66 L30 66 Q18 60 18 44 Q18 34 26 30 Z" />
      <path d="M54 34 Q66 34 66 44 Q66 52 58 54" />
      <path d="M24 38 Q40 34 56 38" strokeDasharray="1 3" />
      <path d="M22 48 Q40 44 58 48" strokeDasharray="1 3" />
      <ellipse cx="40" cy="22" rx="10" ry="2.5" />
    </svg>
  ),
  porcelain: (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[52px] h-[52px]">
      <path d="M18 34 Q18 30 22 30 L54 30 Q58 30 58 34 L55 52 Q54 58 48 58 L28 58 Q22 58 21 52 Z" />
      <path d="M58 38 Q68 38 68 46 Q68 52 60 52" />
      <ellipse cx="38" cy="64" rx="26" ry="3.5" />
      <circle cx="38" cy="42" r="4.5" fill="currentColor" opacity=".35" stroke="none" />
      <circle cx="38" cy="42" r="2.5" fill="currentColor" stroke="none" />
      <path d="M22 36 L54 36" strokeDasharray="1 3" />
    </svg>
  ),
  glass: (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[52px] h-[52px]">
      <path d="M24 16 L56 16 L52 38 Q52 48 40 50 Q28 48 28 38 Z" />
      <path d="M40 50 L40 64" />
      <path d="M28 64 L52 64" />
      <path d="M32 22 Q32 32 38 36" opacity=".6" />
      <path d="M46 20 L46 26" opacity=".6" />
      <ellipse cx="40" cy="20" rx="14" ry="2" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[52px] h-[52px]">
      <path d="M22 24 Q22 20 26 20 L50 20 Q54 20 54 24 L52 54 Q51 60 45 60 L31 60 Q25 60 24 54 Z" />
      <path d="M54 30 Q64 30 64 40 Q64 48 56 50" />
      <path d="M38 36 Q35 32 31 34 Q27 36 29 41 Q31 46 38 50 Q45 46 47 41 Q49 36 45 34 Q41 32 38 36 Z" fill="currentColor" stroke="none" opacity=".85" />
      <path d="M62 18 L62 26 M58 22 L66 22" />
      <path d="M18 46 L18 50 M16 48 L20 48" />
    </svg>
  ),
};

const CAT_STYLES = [
  { bg: 'linear-gradient(160deg,#FCE8F0,#F7D2E0)', color: '#C93A7A' },
  { bg: 'linear-gradient(160deg,#EFE3F5,#DDC9E8)', color: '#8B5A9F' },
  { bg: 'linear-gradient(160deg,#FAF0D9,#F2DDA8)', color: '#6A8CAE' },
  { bg: 'linear-gradient(160deg,#DCEAF4,#B9D4E8)', color: '#B8822A' },
];

export default function Categories() {
  const cats = useCategories();

  return (
    <section className="py-[clamp(60px,8vw,110px)]" id="cats">
      <div className="akwab-container">
        <SectionHead
          kicker="تسوّقي حسب الذوق"
          title="فئاتنا المفضلة"
          desc="أربع مجموعات مصنوعة بحبٍ لتناسب كل ذوق — من الخزف الدافئ إلى القطع المصمّمة خصيصاً لكِ."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {cats.map((c, i) => {
            const st = CAT_STYLES[i % 4];
            return (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="reveal relative block rounded-brand text-center transition-all duration-[350ms] hover:-translate-y-1.5 hover:shadow-brand-md overflow-hidden border border-transparent group"
                style={{ background: st.bg, padding: 'clamp(28px,4vw,36px) 26px' }}
              >
                <span
                  className="inline-flex items-center justify-center w-[88px] h-[88px] mb-4 rounded-full transition-all duration-[400ms] group-hover:scale-[1.08] group-hover:rotate-[-4deg]"
                  style={{ background: 'rgba(255,255,255,.65)', color: st.color }}
                >
                  {ICONS[c.slug] || null}
                </span>
                <h3 className="text-2xl mb-1">{c.name}</h3>
                <p className="text-sm text-brand-ink-soft">{c.desc}</p>
                <span
                  className="inline-block mt-3.5 px-3.5 py-1 rounded-full text-xs font-semibold text-brand-ink"
                  style={{ background: 'rgba(255,255,255,.7)' }}
                >
                  {c.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
