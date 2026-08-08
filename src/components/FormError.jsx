/** Inline error banner for modals and edit forms. */
export default function FormError({ message }) {
  if (!message) return null

  return (
    <div style={{
      background: 'var(--error-soft)', color: 'var(--error)',
      border: '1.5px solid #f5c2c2', borderRadius: 'var(--radius-brand-sm)',
      padding: '10px 14px', marginBottom: 16, fontSize: 13, fontWeight: 700,
    }}>{message}</div>
  )
}
