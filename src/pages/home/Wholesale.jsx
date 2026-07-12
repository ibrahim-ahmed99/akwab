import { useState } from "react";
import { useLang } from "../../context/LanguageContext.jsx";

const SHOWCASE = [
  { id: 1, img: "https://picsum.photos/seed/akwab-s1/400/520", name: "كافيه النخبة", type: "كافيه" },
  { id: 2, img: "https://picsum.photos/seed/akwab-s2/400/340", name: "إيفنت زفاف فاخر", type: "إيفنت" },
  { id: 3, img: "https://picsum.photos/seed/akwab-s3/400/460", name: "بوتيك هدايا رقيق", type: "محل هدايا" },
  { id: 4, img: "https://picsum.photos/seed/akwab-s4/400/360", name: "مطعم الربيع", type: "مطعم" },
  { id: 5, img: "https://picsum.photos/seed/akwab-s5/400/500", name: "كولكشن رمضان", type: "تغليف" },
  { id: 6, img: "https://picsum.photos/seed/akwab-s6/400/400", name: "ستور أونلاين", type: "بيع أونلاين" },
];

const GOVS = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية",
  "المنوفية", "الغربية", "المنصورة", "طنطا", "الأقصر", "أسوان", "أخرى",
];

const QUANTITIES = [
  "أقل من ٥٠ قطعة", "٥٠ – ١٠٠ قطعة", "١٠٠ – ٣٠٠ قطعة", "أكثر من ٣٠٠ قطعة",
];

const FIELD =
  "px-4 py-3 rounded-[12px] border border-brand-line font-cairo text-sm text-brand-ink bg-brand-cream outline-none transition-all duration-200 focus:border-brand-pink focus:bg-white focus:shadow-[0_0_0_3px_rgba(224,71,138,.1)] w-full max-w-full block";

export default function Wholesale() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="py-[clamp(60px,8vw,110px)]" style={{ paddingTop: 0 }}>
      <div className="akwab-container">
        <div
          className="reveal rounded-[clamp(22px,3vw,36px)] overflow-hidden border border-brand-pink-soft"
          style={{ background: "linear-gradient(135deg, #FAF5E4 0%, #FCE8F0 100%)" }}
        >
          <div className="grid md:grid-cols-2 min-w-0">
            {/* Right side: showcase */}
            <div className="p-5 md:p-[clamp(36px,5vw,60px)] flex flex-col gap-4 md:gap-5 min-w-0">
              <h2 className="text-[clamp(26px,3.5vw,38px)] leading-snug m-0">
                <span className="text-brand-pink italic">{t('wholesale.titleHighlight')}</span>
                <br />
                {t('wholesale.titleRest')}
              </h2>

              <div>
                <p className="font-cairo font-semibold text-brand-ink mb-1">
                  {t('wholesale.samplesTitle')}
                </p>
                <p className="text-sm text-brand-ink-soft mb-4 leading-relaxed">
                  {t('wholesale.samplesDesc')}
                </p>
                <ShowcaseCarousel items={SHOWCASE} onOpen={setLightbox} />
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <a
                  href="https://wa.me/201013958495"
                  className="btn btn-whats"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M20 4a10 10 0 0 0-16 12L2 22l6-2a10 10 0 0 0 15-14zM12 20a8 8 0 0 1-4-1l-3 1 1-3a8 8 0 1 1 6 3zm4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1a6 6 0 0 1-2-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.3-.4.2-.4c0-.2 0-.3-.1-.4L9 8.4c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.8.2.2 1.9 2.9 4.6 4 .6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.7-1.2.2-.5.2-1 .1-1.1l-.6-.3z" />
                  </svg>
                  {t('wholesale.contactWa')}
                </a>
                <a href="#ws-form" className="btn btn-outline">
                  {t('wholesale.requestCatalog')}
                </a>
              </div>
            </div>

            {/* Left side: form */}
            <form
              id="ws-form"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="flex flex-col gap-3.5 border-t md:border-t-0 md:border-r border-brand-line p-5 sm:p-[clamp(28px,4vw,48px)] bg-white min-w-0 overflow-hidden"
            >
              <h3 className="text-[22px] mb-1">{t('wholesale.formTitle')}</h3>
              <p className="text-sm text-brand-ink-soft mb-2.5">
                {t('wholesale.formDesc')}
              </p>

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-brand-ink">{t('wholesale.managerName')}</span>
                <input className={FIELD} type="text" placeholder={t('wholesale.namePlaceholder')} required />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-brand-ink">{t('wholesale.mobile')}</span>
                  <input className={FIELD} type="tel" placeholder={t('wholesale.mobileNum')} required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-brand-ink">{t('wholesale.governorate')}</span>
                  <select className={FIELD} required defaultValue="">
                    <option value="" disabled>{t('wholesale.choose')}</option>
                    {GOVS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-brand-ink">{t('wholesale.quantity')}</span>
                <select className={FIELD}>
                  {QUANTITIES.map((q) => <option key={q}>{q}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-brand-ink">{t('wholesale.notes')}</span>
                <textarea className={FIELD} rows="2" placeholder={t('wholesale.notesPlaceholder')} />
              </label>

              <button
                type="submit"
                className={`mt-1.5 py-3.5 rounded-[12px] font-bold text-[15px] text-white transition-all duration-[250ms] ${sent ? "bg-green-500" : "bg-brand-pink hover:bg-[#c93a7a]"}`}
              >
                {sent ? t('wholesale.sent') : t('wholesale.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.88)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-brand overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.img} alt={lightbox.name} className="w-full max-h-[60vh] object-cover block" />
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-cairo font-bold text-brand-ink text-lg leading-tight">{lightbox.name}</p>
                <p className="text-sm text-brand-ink-soft mt-1">{lightbox.type}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-cream border border-brand-line flex items-center justify-center text-xl text-brand-ink hover:bg-brand-pink hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ShowcaseCarousel({ items, onOpen }) {
  const doubled = [...items, ...items];
  return (
    <div
      dir="ltr"
      className="flex flex-col gap-2.5 overflow-hidden rounded-[16px]"
      style={{
        WebkitMask: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        mask: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <MarqueeRow items={doubled} direction="left" onOpen={onOpen} />
      <div className="hidden md:block">
        <MarqueeRow items={doubled} direction="right" onOpen={onOpen} />
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction, onOpen }) {
  return (
    <div
      style={{
        display: "flex", gap: "10px", width: "max-content",
        animation: `${direction === "left" ? "marquee-left" : "marquee-right"} 20s linear infinite`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
      onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onOpen(item)}
          style={{ flexShrink: 0, width: 'clamp(72px, 18vw, 88px)', height: 'clamp(72px, 18vw, 88px)' }}
          className="group relative rounded-[14px] overflow-hidden border-2 border-white shadow-sm focus:outline-none"
        >
          <img
            src={item.img} alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}
