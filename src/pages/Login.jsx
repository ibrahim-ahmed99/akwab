import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { admin, loading: booting, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmit] = useState(false)
  const [error, setError]       = useState(null)

  if (!booting && admin) return <Navigate to={location.state?.from || '/'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmit(true)
    setError(null)
    try {
      await login(email.trim(), password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      // 401 → wrong credentials, 429 → throttle:6,1 on the login route.
      setError(err.status === 401 ? 'بيانات الدخول غير صحيحة' : err.message)
    } finally {
      setSubmit(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      background: 'linear-gradient(135deg, #3D2540 0%, #6B4E6E 55%, #3D2540 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles — same language as the About hero */}
      <div style={{ position: 'absolute', top: -120, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(224,71,138,0.14)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(200,168,75,0.12)' }} />

      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '36px 34px', position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 62, height: 62, borderRadius: 20,
            background: 'linear-gradient(135deg, #E0478A 0%, #C8A84B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 30, color: '#fff',
            boxShadow: '0 10px 26px rgba(224,71,138,0.4)', marginBottom: 14,
          }}>A</div>
          <h1 style={{ fontSize: 24 }}>Akwab</h1>
          <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', marginTop: 4 }}>
            تسجيل الدخول إلى لوحة التحكم
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: 'var(--error-soft)', color: 'var(--error)',
            border: '1.5px solid #f5c2c2', borderRadius: 'var(--radius-brand-sm)',
            padding: '11px 14px', marginBottom: 18, fontSize: 13, fontWeight: 700,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} color="var(--brand-pink)" /> البريد الإلكتروني
            </label>
            <input
              className="form-control" type="email" required autoFocus
              placeholder="admin@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={submitting}
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} color="var(--brand-pink)" /> كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control" type={showPass ? 'text' : 'password'} required
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                disabled={submitting}
                style={{ direction: 'ltr', textAlign: 'left', paddingLeft: 44 }}
              />
              <button
                type="button" onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', display: 'flex', padding: 4,
                }}
              >
                {showPass
                  ? <EyeOff size={16} color="var(--brand-ink-soft)" />
                  : <Eye size={16} color="var(--brand-ink-soft)" />}
              </button>
            </div>
          </div>

          <button
            type="submit" className="btn btn-primary" disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: 6, fontSize: 15 }}
          >
            {submitting
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> جاري الدخول...</>
              : <><LogIn size={16} /> دخول</>}
          </button>
        </form>
      </div>
    </div>
  )
}
