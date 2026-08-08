import { ChevronRight, ChevronLeft } from 'lucide-react'

const btn = (disabled, active) => ({
  minWidth: 34, height: 34, padding: '0 10px',
  borderRadius: 10, cursor: disabled ? 'default' : 'pointer',
  border: `1.5px solid ${active ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
  background: active ? 'var(--brand-pink)' : '#fff',
  color: active ? '#fff' : 'var(--brand-ink-soft)',
  fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1,
  transition: 'all 0.2s',
})

/** Window of page numbers around the current page. */
function pageWindow(current, last, span = 2) {
  const from = Math.max(1, current - span)
  const to   = Math.min(last, current + span)
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

/** Driven by the API's `meta` block: {current_page, last_page, per_page, total}. */
export default function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null

  const { current_page: current, last_page: last, total } = meta

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1.5px solid var(--brand-line)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>
        صفحة {current} من {last} — {total} عنصر
      </span>

      <div style={{ display: 'flex', gap: 6 }}>
        <button style={btn(current === 1)} disabled={current === 1} onClick={() => onPage(current - 1)}>
          <ChevronRight size={15} />
        </button>

        {pageWindow(current, last).map(p => (
          <button key={p} style={btn(false, p === current)} onClick={() => onPage(p)}>{p}</button>
        ))}

        <button style={btn(current === last)} disabled={current === last} onClick={() => onPage(current + 1)}>
          <ChevronLeft size={15} />
        </button>
      </div>
    </div>
  )
}
