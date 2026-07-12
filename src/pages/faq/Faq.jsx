import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Faq() {
  const { t } = useLang();
  const categories = t('faq.categories');

  const [activeCat, setActiveCat] = useState('shipping');
  const [openIdx, setOpenIdx] = useState(null);

  const current = categories.find(c => c.id === activeCat);

  const toggleItem = (i) => setOpenIdx(prev => (prev === i ? null : i));

  return (
    <>
      {/* Header */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 60%,#d8e8f3 100%)' }}
      >
        <span className="absolute top-8 left-20 text-4xl opacity-20 select-none">✿</span>
        <span className="absolute bottom-6 right-16 text-3xl opacity-20 select-none">🌸</span>
        <div className="akwab-container relative z-10">
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
            {t('faq.kicker')}
          </p>
          <h1 className="text-[clamp(32px,4.5vw,56px)] mb-4">{t('faq.title')}</h1>
          <p className="text-brand-ink-soft text-[17px] max-w-xl mx-auto">
            {t('faq.desc')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="akwab-container max-w-4xl">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(cat.id); setOpenIdx(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat.id
                    ? 'bg-brand-pink text-white shadow-brand-md'
                    : 'bg-white text-brand-ink border border-brand-line hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink-softer'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {current?.items.map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-brand shadow-brand-sm overflow-hidden transition-all ${
                  openIdx === i ? 'shadow-brand-md' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="font-semibold text-base">{item.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    openIdx === i
                      ? 'bg-brand-pink text-white rotate-45'
                      : 'bg-brand-cream text-brand-ink-soft'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-60' : 'max-h-0'}`}>
                  <p className="px-5 pb-5 text-brand-ink-soft text-sm leading-relaxed border-t border-brand-line pt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div
            className="mt-14 rounded-brand p-8 text-center"
            style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 100%)' }}
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl mb-3 font-amiri">{t('faq.stillNeedHelp')}</h3>
            <p className="text-brand-ink-soft text-sm mb-6 max-w-sm mx-auto">
              {t('faq.stillDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/201013958495"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whats justify-center"
              >
                {t('faq.whatsapp')}
              </a>
              <Link to="/contact" className="btn btn-outline justify-center">
                {t('faq.messageUs')}
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
