import { useState } from 'react'
import { LogOut, Loader2, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ title, onMenuClick }) {
  const { admin, logout } = useAuth()
  const [leaving, setLeaving] = useState(false)

  const handleLogout = async () => {
    if (leaving) return
    setLeaving(true)
    await logout()
  }

  return (
    <header className="app-header" style={{
      height: 68,
      background: '#fff',
      borderBottom: '2px solid var(--brand-line)',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <button className="header-hamburger" onClick={onMenuClick} aria-label="فتح القائمة">
        <Menu size={18} color="var(--brand-ink)" />
      </button>

      <h2 style={{
        flex: 1,
        fontFamily: 'Amiri, serif',
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--brand-ink)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{title}</h2>

      <div className="app-header-date" style={{
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

      {admin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="app-header-admin-name" style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{admin.name}</span>
          <button
            onClick={handleLogout}
            disabled={leaving}
            title="تسجيل الخروج"
            style={{
              background: 'var(--error-soft)', border: 'none', borderRadius: 10,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {leaving
              ? <Loader2 size={15} color="var(--error)" style={{ animation: 'spin 1s linear infinite' }} />
              : <LogOut size={15} color="var(--error)" />}
          </button>
        </div>
      )}
    </header>
  )
}
