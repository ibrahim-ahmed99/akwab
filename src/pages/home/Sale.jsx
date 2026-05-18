import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toArabicDigits } from '../../utils/arabic.js';

const MugHeart = () => (
  <svg viewBox="0 0 200 160" className="w-10 h-10">
    <ellipse cx="100" cy="148" rx="62" ry="6" fill="rgba(61,37,64,.08)" />
    <path d="M40 60 Q40 50 50 50 L150 50 Q160 50 160 60 L154 130 Q152 144 138 144 L62 144 Q48 144 46 130 Z" fill="#F5B5CE" stroke="#D88AA8" strokeWidth="1.5" />
    <path d="M160 72 Q180 72 180 92 Q180 112 160 112" fill="none" stroke="#D88AA8" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="100" cy="52" rx="60" ry="7" fill="#F9CEDD" />
    <ellipse cx="100" cy="52" rx="54" ry="4" fill="#EBA0BE" />
    <g fill="#E0478A">
      <path d="M72 78 C70 74, 64 74, 64 80 C64 84, 72 90, 72 90 C72 90, 80 84, 80 80 C80 74, 74 74, 72 78 Z" />
      <path d="M120 98 C118 94, 112 94, 112 100 C112 104, 120 110, 120 110 C120 110, 128 104, 128 100 C128 94, 122 94, 120 98 Z" />
      <path d="M95 118 C93 114, 87 114, 87 120 C87 124, 95 130, 95 130 C95 130, 103 124, 103 120 C103 114, 97 114, 95 118 Z" />
    </g>
  </svg>
);

const MugSmile = () => (
  <svg viewBox="0 0 200 160" className="w-10 h-10">
    <ellipse cx="100" cy="148" rx="56" ry="5" fill="rgba(61,37,64,.08)" />
    <path d="M54 60 Q54 48 66 48 L134 48 Q146 48 146 60 L142 126 Q140 138 128 138 L72 138 Q60 138 58 126 Z" fill="#FDF8EC" stroke="#E8D8B8" strokeWidth="1.5" />
    <path d="M146 74 Q170 74 170 94 Q170 112 146 112" fill="none" stroke="#E8D8B8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="84" cy="90" r="3.5" fill="#3D2540" />
    <circle cx="116" cy="90" r="3.5" fill="#3D2540" />
    <path d="M82 102 Q100 118 118 102" fill="none" stroke="#3D2540" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const TeapotSet = () => (
  <svg viewBox="0 0 200 160" className="w-10 h-10">
    <ellipse cx="100" cy="148" rx="82" ry="5" fill="rgba(61,37,64,.08)" />
    <path d="M50 72 Q40 72 40 82 L40 114 Q40 132 60 132 L110 132 Q130 132 130 114 L130 82 Q130 72 120 72 Z" fill="#F5B5CE" stroke="#D88AA8" strokeWidth="1.5" />
    <ellipse cx="85" cy="72" rx="40" ry="6" fill="#F08FB5" />
    <path d="M60 72 Q60 58 85 58 Q110 58 110 72 Z" fill="#F5B5CE" stroke="#D88AA8" strokeWidth="1.5" />
    <circle cx="85" cy="56" r="4" fill="#C8A84B" />
    <path d="M40 88 Q22 88 18 76 Q16 72 22 70 Q32 74 40 84 Z" fill="#F5B5CE" stroke="#D88AA8" strokeWidth="1.5" />
    <path d="M130 86 Q148 86 148 104 Q148 120 130 120" fill="none" stroke="#D88AA8" strokeWidth="5" strokeLinecap="round" />
    <g transform="translate(80 100)">
      <circle r="10" fill="#E0478A" opacity=".85" />
      <circle r="6" fill="#C93A7A" />
    </g>
    <path d="M146 110 Q146 104 152 104 L174 104 Q180 104 180 110 L178 128 Q177 134 172 134 L154 134 Q149 134 148 128 Z" fill="#F9CEDD" stroke="#D88AA8" strokeWidth="1.2" />
    <ellipse cx="163" cy="138" rx="24" ry="4" fill="#F5B5CE" stroke="#D88AA8" strokeWidth="1" />
  </svg>
);

const GlassCup = () => (
  <svg viewBox="0 0 200 160" className="w-10 h-10">
    <ellipse cx="100" cy="148" rx="50" ry="5" fill="rgba(61,37,64,.08)" />
    <path d="M64 44 L136 44 L130 140 Q129 146 122 146 L78 146 Q71 146 70 140 Z" fill="rgba(230,240,245,.7)" stroke="#B5CAD8" strokeWidth="1.5" />
    <path d="M70 60 L130 60 L126 132 Q125 136 120 136 L80 136 Q75 136 74 132 Z" fill="#C9936D" opacity=".85" />
    <rect x="112" y="20" width="4" height="60" rx="2" fill="#C8A84B" transform="rotate(12 114 50)" />
  </svg>
);

const SALE_CARDS = [
  { icon: <MugHeart />, name: 'كوب القلوب', now: '٢٧٣ ج.م', old: '٣٩٠ ج.م' },
  { icon: <MugSmile />, name: 'كوب ماشميلو', now: '٣١٥ ج.م', old: '٤٥٠ ج.م' },
  { icon: <TeapotSet />, name: 'طقم شاي الورد', now: '٨٧٥ ج.م', old: '١٢٥٠ ج.م' },
  { icon: <GlassCup />, name: 'كوب زجاج الورد', now: '٢٨٠ ج.م', old: '٤٠٠ ج.م' },
];

export default function Sale() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 35 * 60 + 42) * 1000;
    const tick = () => {
      let left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      const d = Math.floor(left / 86400); left -= d * 86400;
      const h = Math.floor(left / 3600); left -= h * 3600;
      const m = Math.floor(left / 60);
      const s = left - m * 60;
      setTime({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { n: time.d, l: 'أيام' },
    { n: time.h, l: 'ساعة' },
    { n: time.m, l: 'دقيقة' },
    { n: time.s, l: 'ثانية' },
  ];

  return (
    <div className="akwab-container" style={{ margin: 'clamp(40px,5vw,60px) auto' }}>
      <section
        className="reveal relative overflow-hidden rounded-[clamp(22px,3vw,36px)] text-white"
        style={{ background: 'linear-gradient(135deg, #7a1f4d 0%, #E0478A 50%, #b83873 100%)', padding: 'clamp(40px,5vw,64px)' }}
      >
        <div className="pointer-events-none absolute -top-[50px] -left-[50px] w-[250px] h-[250px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,168,75,.25), transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-[80px] -right-[80px] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,.1), transparent 70%)' }} />

        <div className="relative z-[1] grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold mb-5"
              style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)' }}>
              ⚡ عرض محدود
            </div>
            <h2 className="text-[clamp(32px,4vw,52px)] text-white mb-4">
              خصومات الربيع<br />
              <span className="text-brand-gold italic">تنتهي قريباً</span>
            </h2>
            <p className="opacity-[.92] text-[17px] mb-7 max-w-[440px]">
              احصلي على خصم حصري ٣٠٪ على مجموعة مختارة من أجمل أكواب الموسم — قبل نفاذ الكمية.
            </p>

            <div className="flex gap-3 flex-wrap mb-8">
              {units.map((u, i) => (
                <div key={i} className="flex flex-col items-center rounded-[18px] px-5 py-4 min-w-[88px] text-center border"
                  style={{ background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,.22)' }}>
                  <span className="font-amiri font-bold text-[clamp(28px,3.5vw,40px)] leading-none text-brand-gold">
                    {toArabicDigits(u.n)}
                  </span>
                  <span className="text-[11px] opacity-85 mt-1.5 tracking-[.05em]">{u.l}</span>
                </div>
              ))}
            </div>

            <Link to="/shop?filter=sale" className="btn btn-gold">
              تصفحي العروض
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <div
              className="spin-fwd absolute -top-[30px] -left-[20px] z-[3] w-[130px] h-[130px] rounded-full flex flex-col items-center justify-center"
              style={{ background: '#C8A84B', color: '#3a2f10', boxShadow: '0 14px 30px rgba(0,0,0,.25)', border: '3px dashed rgba(255,255,255,.5)' }}
            >
              <span className="spin-back font-amiri text-[44px] font-bold leading-none">٣٠٪</span>
              <span className="spin-back text-[11px] font-bold tracking-[.12em] mt-1">خصم</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {SALE_CARDS.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-center rounded-[18px] p-4 transition-all duration-[250ms] hover:-translate-y-[3px] border"
                  style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(14px)', borderColor: 'rgba(255,255,255,.2)' }}
                >
                  <div className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0 bg-white/90">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-cairo text-sm font-semibold mb-1">{c.name}</h4>
                    <span className="text-brand-gold font-bold font-amiri text-[18px]">{c.now}</span>
                    <span className="line-through opacity-70 text-xs mr-1.5">{c.old}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
