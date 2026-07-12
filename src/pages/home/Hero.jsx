import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 30% at 85% 20%, rgba(224,71,138,.08), transparent 60%), radial-gradient(ellipse 35% 35% at 15% 85%, rgba(137,184,216,.12), transparent 60%)',
        }}
      />

      <div className="akwab-container grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-center relative">
        <div className="reveal">
          <h1 className="text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.15] my-5">
            {t('hero.line1')}
            <br />
            <span className="text-brand-pink italic relative inline-block">{t('hero.line2')}</span>{' '}
            {t('hero.line3')}
          </h1>
          <p className="text-[clamp(16px,1.4vw,19px)] text-brand-ink-soft max-w-[540px] mb-8">
            {t('hero.desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              {t('hero.shopNow')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="relative h-[560px] reveal">
          <span className="absolute text-[28px] opacity-60 pointer-events-none select-none" style={{ top: '10%', left: '48%' }}>🌸</span>
          <span className="absolute text-[28px] opacity-60 pointer-events-none select-none" style={{ bottom: '12%', right: '10%' }}>🍃</span>

          <FloatCard cls="float-1" style={{ top: 0, right: 0 }}
            tag="جديد" tagColor="bg-brand-pink"
            bg="p-bg-1" img="/assets/pottery-4.jpeg"
            name="كوب اليقطين" price="٤٢٠ ج.م" />

          <FloatCard cls="float-2" style={{ top: '40px', left: '-10px' }}
            bg="p-bg-2" img="/assets/porcelain-1.jpeg"
            name="كوب رجل الزنجبيل" price="٤٨٠ ج.م" />

          <FloatCard cls="float-3" style={{ bottom: '20px', right: '60px' }}
            tag="الأكثر طلباً" tagColor="bg-brand-gold"
            bg="p-bg-3" img="/assets/custom-1.jpeg"
            name="تكفيني أنت وطناً لي" price="٦٥٠ ج.م" />

          <FloatCard cls="float-4" style={{ bottom: '60px', left: '20px' }}
            bg="p-bg-4" img="/assets/glass-2.jpeg"
            name="كوب الأقحوان" price="٣٩٠ ج.م" />
        </div>
      </div>
    </section>
  );
}

function FloatCard({ cls, style, tag, tagColor, bg, img, name, price }) {
  return (
    <div
      className={`absolute bg-white rounded-brand p-[22px] shadow-brand-lg w-[220px] border border-brand-line ${cls}`}
      style={style}
    >
      {tag && (
        <span className={`absolute top-3.5 right-3.5 z-[3] px-2.5 py-1 text-[11px] font-bold rounded-full text-white ${tagColor}`}>
          {tag}
        </span>
      )}
      <div className={`relative h-[130px] rounded-brand-sm overflow-hidden mb-3.5 ${bg}`}>
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <h4 className="font-amiri text-[18px] mb-1.5">{name}</h4>
      <div className="text-brand-pink font-bold text-[16px]">{price}</div>
    </div>
  );
}
