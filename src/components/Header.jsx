export default function Header({ title }) {
  return (
    <header style={{
      height: 68,
      background: '#fff',
      borderBottom: '2px solid var(--brand-line)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h2 style={{
        flex: 1,
        fontFamily: 'Amiri, serif',
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--brand-ink)',
      }}>{title}</h2>

      <div style={{
        fontSize: 12, color: 'var(--brand-ink-soft)', fontWeight: 600,
        background: 'var(--brand-cream)',
        padding: '7px 14px',
        borderRadius: 12,
        border: '2px solid var(--brand-line)',
        whiteSpace: 'nowrap',
      }}>
        {new Date().toLocaleDateString('ar-EG', {
          weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
        })}
      </div>
    </header>
  )
}
