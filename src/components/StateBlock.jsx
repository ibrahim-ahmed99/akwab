import { Loader2, AlertCircle, Inbox } from 'lucide-react'

const wrap = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 10, padding: '48px 20px', textAlign: 'center',
}

export function Loading({ label = 'جاري التحميل...' }) {
  return (
    <div style={wrap}>
      <Loader2 size={26} color="var(--brand-pink)" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div style={wrap}>
      <AlertCircle size={26} color="var(--error)" />
      <span style={{ fontSize: 14, color: 'var(--error)', fontWeight: 700 }}>
        {error?.message || 'حدث خطأ أثناء التحميل'}
      </span>
      {onRetry && (
        <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={onRetry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}

export function Empty({ label = 'لا توجد بيانات' }) {
  return (
    <div style={wrap}>
      <Inbox size={26} color="var(--brand-ink-soft)" />
      <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

/**
 * Renders loading / error / empty, or `children` when there is data.
 * `isEmpty` defaults to an empty array check.
 */
export default function StateBlock({ loading, error, onRetry, isEmpty, emptyLabel, children }) {
  if (loading) return <Loading />
  if (error)   return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return <Empty label={emptyLabel} />
  return children
}
