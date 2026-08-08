import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/** Client-side half of the API's auth:admins_api guard — no admin, no dashboard. */
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        background: 'var(--brand-cream)',
      }}>
        <Loader2 size={30} color="var(--brand-pink)" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 14, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>
          جاري التحقق من الجلسة...
        </span>
      </div>
    )
  }

  if (!admin) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return children
}
