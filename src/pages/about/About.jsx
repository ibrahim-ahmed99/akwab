import { Link } from 'react-router-dom';
import { SectionHead } from '../../components/SectionHead.jsx';

const VALUES = [
  {
    icon: <HandIcon />,
    title: 'صناعة يدوية',
    desc: 'كل قطعة تُشكَّل باليد من بداية الطين حتى اللمسة الأخيرة من الألوان.',
  },
  {
    icon: <HeartIcon />,
    title: 'بمحبة من القاهرة',
    desc: 'ورشتنا في قلب القاهرة. نُصدّر البهجة لكل ربوع مصر.',
  },
  {
    icon: <LeafIcon />,
    title: 'خامات آمنة',
    desc: 'جميع موادنا خالية من المواد الضارة وآمنة للاستخدام اليومي.',
  },
  {
    icon: <StarIcon />,
    title: 'جودة لا تُساوم',
    desc: 'كل كوب يمر بمراحل فحص دقيقة قبل أن يصل إليكِ بعلبة هديتك المميزة.',
  },
];

const STATS = [
  { num: '+٥٠٠٠', label: 'عميلة سعيدة' },
  { num: '+٢٠٠', label: 'تصميم فريد' },
  { num: '٣', label: 'سنوات من الإبداع' },
  { num: '٢٧', label: 'محافظة نصلها' },
];

export default function About() {
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
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
            من نحن
          </p>
          <h1 className="text-[clamp(36px,5vw,64px)] mb-6 leading-tight">
            قصة كوب.. وحكاية حب
          </h1>
          <p className="text-brand-ink-soft text-[18px] leading-relaxed max-w-2xl mx-auto">
            بدأت أكواب كفكرة بسيطة: أن كل لحظة قهوة تستحق كوباً يليق بها.
            من ورشة صغيرة في القاهرة، إلى آلاف البيوت المصرية — نحمل معنا شغف الصناعة اليدوية وعشق التفاصيل.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="akwab-container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
                الحكاية
              </p>
              <h2 className="text-[clamp(28px,3.5vw,44px)] mb-5">
                من يد الفنانة إلى يديكِ
              </h2>
              <p className="text-brand-ink-soft leading-relaxed mb-4">
                في عام ٢٠٢٢، قررت سارة — مصممة الخزف — أن تترك وظيفتها وتُحوّل شغفها إلى مشروع حقيقي.
                بدأت بمنضدة صغيرة ودولاب طين، واليوم تُشغّل ورشة كاملة بفريق من الفنانات الموهوبات.
              </p>
              <p className="text-brand-ink-soft leading-relaxed mb-6">
                كل قطعة تمر بأيدٍ كثيرة قبل أن تصل إليكِ: من العجن والتشكيل، إلى الفرن والتزجيج،
                وصولاً إلى التلوين اليدوي والتغليف بعلبة هدية تليق بالمناسبة.
              </p>
              <Link to="/shop" className="btn btn-primary">تسوّقي معنا</Link>
            </div>
            <div className="reveal grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={`rounded-brand overflow-hidden aspect-square p-bg-${n}`}>
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🏺</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg,#fef9e7 0%,#fefcf0 100%)' }}>
        <div className="akwab-container">
          <SectionHead
            kicker="قيمنا"
            title="ما يجعلنا مختلفات"
            desc="أربعة مبادئ تحكم كل قطعة نصنعها."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="reveal bg-white rounded-brand p-6 shadow-brand-sm text-center">
                <div className="w-14 h-14 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-4 text-brand-pink">
                  {v.icon}
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
            {STATS.map((s, i) => (
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
            kicker="انضمي إلينا"
            title="كوني جزءاً من حكايتنا"
            desc="تسوّقي، أو شاركينا تجربتك، أو راسلينا لطلب تصميم خاص."
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn btn-primary justify-center">تصفّحي المتجر</Link>
            <Link to="/contact" className="btn btn-outline justify-center">تواصلي معنا</Link>
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
