const STATS = [
  {
    num: '+١٢ ألف',
    lbl: 'عميلة سعيدة',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    num: '+٥٠٠',
    lbl: 'تصميم حصري',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 2h12l2 5H4z" />
        <path d="M4 7v13h16V7" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    num: '٤٫٩ / ٥',
    lbl: 'تقييم العميلات',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m12 2 3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
      </svg>
    ),
  },
  {
    num: '٤٨ ساعة',
    lbl: 'توصيل لكل محافظات مصر',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function Stats() {
  return (
    <section
      className="py-[50px] relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E0478A 0%, #c93a7a 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,.1), transparent 40%), radial-gradient(circle at 80% 50%, rgba(200,168,75,.2), transparent 40%)',
        }}
      />
      <div className="akwab-container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <div key={i} className="reveal text-white">
              <div
                className="w-[52px] h-[52px] rounded-full mx-auto mb-3.5 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)' }}
              >
                {s.icon}
              </div>
              <div className="font-amiri text-[clamp(30px,4vw,44px)] font-bold leading-none">{s.num}</div>
              <div className="text-sm opacity-[.92] mt-1.5">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
