import { useState, useRef } from 'react';
import { SectionHead } from '../../components/SectionHead.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { useContent } from '../../context/ContentContext.jsx';

export default function Testimonials() {
  const { t } = useLang();
  const { c } = useContent();
  const [lightbox, setLightbox] = useState(null);
  const trackRef = useRef(null);

  // The review wall is content now, served with the rest of the page copy.
  const reviews = c('testimonials.images', []);

  if (!reviews.length) return null;

  function scroll(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-card]');
    const step = card ? card.offsetWidth + 16 : 280;
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
  }

  return (
    <section className="py-[clamp(60px,8vw,110px)] overflow-hidden">
      <div className="akwab-container">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <SectionHead
            title={c('testimonials.title')}
            desc={c('testimonials.desc')}
            className="mb-0"
          />
          <div className="flex gap-2 flex-shrink-0" dir="ltr">
            <ArrowBtn label="←" onClick={() => scroll(-1)} aria={c('testimonials.scrollLeft')} />
            <ArrowBtn label="→" onClick={() => scroll(1)}  aria={c('testimonials.scrollRight')} />
          </div>
        </div>

        <div
          ref={trackRef}
          dir="ltr"
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((img, i) => (
            <div
              key={img || i}
              data-card
              className="reveal flex-shrink-0 cursor-zoom-in overflow-hidden rounded-brand border border-brand-line snap-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-brand-md"
              style={{ width: 'clamp(220px, 28vw, 320px)' }}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img}
                alt={c('testimonials.reviewAlt')}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,.88)' }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt={c('testimonials.reviewAlt')}
            className="max-h-[90vh] max-w-[90vw] rounded-brand shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white text-brand-ink flex items-center justify-center text-2xl font-bold leading-none hover:bg-brand-pink hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}

function ArrowBtn({ label, onClick, aria }) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className="w-11 h-11 rounded-full border border-brand-line flex items-center justify-center text-brand-ink text-lg hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all duration-200"
    >
      {label}
    </button>
  );
}
