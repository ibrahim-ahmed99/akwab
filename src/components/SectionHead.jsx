export function SectionHead({ kicker, title, desc }) {
  return (
    <div className="reveal text-center max-w-2xl mx-auto mb-[clamp(40px,5vw,64px)]">
      <div className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-2.5 font-cairo">
        {kicker}
      </div>
      <h2 className="text-[clamp(32px,4.2vw,52px)] mb-3.5">{title}</h2>
      <div className="flex items-center justify-center gap-3 my-4 text-brand-gold text-xs">
        <span className="block w-10 h-px bg-brand-gold opacity-50" />
        ✿
        <span className="block w-10 h-px bg-brand-gold opacity-50" />
      </div>
      {desc && <p className="text-brand-ink-soft text-[17px]">{desc}</p>}
    </div>
  );
}
