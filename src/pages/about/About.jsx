import { Link } from 'react-router-dom';
import { SectionHead } from '../../components/SectionHead.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

const VALUE_ICONS = [
  <HandIcon />,
  <HeartIcon />,
  <LeafIcon />,
  <StarIcon />,
];

export default function About() {
  const { t } = useLang();
  const values = t('about.values');
  const stats = t('about.stats');

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 50%,#d8e8f3 100%)' }}
      >
        <Petal className="absolute top-10 right-16 text-5xl opacity-30 rotate-12">🌸</Petal>
        <Petal className="absolute bottom-10 left-20 text-4xl opacity-20 -rotate-12">🍃</Petal>
        <Petal className="absolute top-1/2 left-8 text-3xl opacity-20 rotate-45">✿</Petal>

        <div className="akwab-container max-w-3xl text-center relative z-10">
          <h1 className="text-[clamp(36px,5vw,64px)] mb-6 leading-tight">
            {t('about.heroTitle')}
          </h1>
          <p className="text-brand-ink-soft text-[18px] leading-relaxed max-w-2xl mx-auto">
            {t('about.heroDesc')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="akwab-container max-w-3xl text-center">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
              {t('about.storyKicker')}
            </p>
            <h2 className="text-[clamp(28px,3.5vw,44px)] mb-6">
              {t('about.storyTitle')}
            </h2>
            <p className="text-brand-ink-soft leading-relaxed mb-4 text-[17px]">
              {t('about.storyP1')}
            </p>
            <p className="text-brand-ink-soft leading-relaxed mb-8 text-[17px]">
              {t('about.storyP2')}
            </p>
            <Link to="/shop" className="btn btn-primary">{t('about.shopWithUs')}</Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg,#fef9e7 0%,#fefcf0 100%)' }}>
        <div className="akwab-container">
          <SectionHead
            kicker={t('about.valuesKicker')}
            title={t('about.valuesTitle')}
            desc={t('about.valuesDesc')}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="reveal bg-white rounded-brand p-6 shadow-brand-sm text-center">
                <div className="w-14 h-14 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-4 text-brand-pink">
                  {VALUE_ICONS[i]}
                </div>
                <h3 className="text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-brand-ink-soft leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg,#E0478A 0%,#c93a7a 100%)' }}
      >
        <div className="akwab-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="reveal text-center text-white">
                <div className="font-amiri text-[clamp(36px,4vw,52px)] font-bold mb-1">{s.num}</div>
                <div className="text-white/80 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="akwab-container max-w-2xl text-center">
          <SectionHead
            kicker={t('about.ctaKicker')}
            title={t('about.ctaTitle')}
            desc={t('about.ctaDesc')}
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn btn-primary justify-center">{t('about.browseShop')}</Link>
            <Link to="/contact" className="btn btn-outline justify-center">{t('about.contactUs')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Petal({ className, children }) {
  return <span className={`select-none pointer-events-none ${className}`}>{children}</span>;
}

function HandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
      <path d="M10 10.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2V17a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-5a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
