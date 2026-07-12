import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Tag,
  Users, Phone, Info, ChevronLeft, Menu, Home, ClipboardList
} from 'lucide-react'
import { useBadges } from '../context/BadgesContext'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'لوحة التحكم' },
  { to: '/home-page',  icon: Home,            label: 'الرئيسية' },
  { to: '/categories', icon: Tag,             label: 'الأقسام' },
  { to: '/products',   icon: Package,         label: 'المنتجات' },
  { to: '/orders',     icon: ShoppingCart,    label: 'الأوردرات' },
  { to: '/customers',  icon: Users,           label: 'العملاء' },
  { to: '/form',       icon: ClipboardList,   label: 'النموذج' },
  { to: '/contact',    icon: Phone,           label: 'التواصل' },
  { to: '/about',      icon: Info,            label: 'من نحن' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { badges } = useBadges()
  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: collapsed ? '72px' : '264px',
      background: '#3D2540',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      zIndex: 100,
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(61,37,64,0.25)',
    }}>

      {/* ── Logo bar ── */}
      <div style={{
        padding: collapsed ? '20px 0' : '22px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1.5px solid rgba(240,227,232,0.12)',
        gap: 10,
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* logo mark */}
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'linear-gradient(135deg, #E0478A 0%, #C8A84B 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Amiri, serif',
              fontWeight: 700, fontSize: 20, color: '#fff',
              boxShadow: '0 6px 18px rgba(224,71,138,0.4)',
              flexShrink: 0,
            }}>A</div>
            <div>
              <div style={{
                fontFamily: 'Amiri, serif',
                fontWeight: 700, fontSize: 20, color: '#FEFCF0', letterSpacing: 0.5,
              }}>Akwab</div>
              <div style={{ fontSize: 11, color: 'rgba(240,227,232,0.5)', marginTop: 1 }}>لوحة التحكم</div>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'linear-gradient(135deg, #E0478A 0%, #C8A84B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 20, color: '#fff',
            boxShadow: '0 6px 18px rgba(224,71,138,0.4)',
          }}>A</div>
        )}

        <button
          onClick={onToggle}
          style={{
            background: 'rgba(240,227,232,0.08)',
            border: '1.5px solid rgba(240,227,232,0.12)',
            borderRadius: 10,
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(240,227,232,0.55)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,71,138,0.2)'; e.currentTarget.style.color = '#E0478A' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,227,232,0.08)'; e.currentTarget.style.color = 'rgba(240,227,232,0.55)' }}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'rgba(240,227,232,0.35)',
            padding: '6px 20px 10px', textTransform: 'uppercase', letterSpacing: 1.5,
          }}>القائمة</div>
        )}

        {navItems.map(({ to, icon: Icon, label }) => {
          const badgeCount = badges[to]

          return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '13px 0' : '12px 18px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              margin: collapsed ? '3px 8px' : '3px 12px',
              borderRadius: 14,
              color: isActive ? '#fff' : 'rgba(240,227,232,0.6)',
              background: isActive
                ? 'linear-gradient(135deg, #E0478A 0%, #cc3a7a 100%)'
                : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 6px 20px rgba(224,71,138,0.35)' : 'none',
              position: 'relative',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('gradient')) {
                e.currentTarget.style.background = 'rgba(224,71,138,0.12)'
                e.currentTarget.style.color = '#F7D2E0'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('gradient')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(240,227,232,0.6)'
              }
            }}
          >
            {({ isActive }) => (
              <>
                {/* icon + collapsed badge */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Icon size={18} />
                  {collapsed && badgeCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -6, left: -6,
                      background: '#E0478A',
                      color: '#fff',
                      borderRadius: 20,
                      minWidth: 16, height: 16,
                      fontSize: 9, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                      border: '1.5px solid #3D2540',
                      lineHeight: 1,
                    }}>{badgeCount}</span>
                  )}
                </div>

                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{label}</span>
                    {/* expanded: badge OR chevron */}
                    {badgeCount > 0 ? (
                      <span style={{
                        background: isActive ? 'rgba(255,255,255,0.25)' : '#E0478A',
                        color: '#fff',
                        borderRadius: 20,
                        minWidth: 20, height: 20,
                        fontSize: 11, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 6px',
                        lineHeight: 1,
                      }}>{badgeCount}</span>
                    ) : (
                      isActive && <ChevronLeft size={14} style={{ opacity: 0.7 }} />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
          )
        })}
      </nav>

      {/* ── User footer ── */}
      <div style={{
        borderTop: '1.5px solid rgba(240,227,232,0.12)',
        padding: collapsed ? '16px 0' : '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'linear-gradient(135deg, #C8A84B, #E0478A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0,
          boxShadow: '0 4px 12px rgba(200,168,75,0.35)',
        }}>م</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FEFCF0', whiteSpace: 'nowrap' }}>المدير العام</div>
            <div style={{ fontSize: 11, color: 'rgba(240,227,232,0.4)', whiteSpace: 'nowrap' }}>admin@akwab.com</div>
          </div>
        )}
      </div>
    </aside>
  )
}
