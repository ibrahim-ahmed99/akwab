import { useState } from 'react'
import {
  Monitor, LayoutGrid, BadgeCheck, Layers,
  Edit2, X, CheckCircle2, Link, Type, AlignLeft, Tag, Loader2,
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import StateBlock from '../components/StateBlock'
import FormError from '../components/FormError'
import { listHomeSections, updateHomeSection, setHomeSectionActive } from '../services/settings'
import { relativeTime } from '../services/format'

/* Presentation only — the fields, labels and data all come from the API. */
const SECTION_STYLE = {
  hero:     { icon: Monitor,    iconBg: 'p-bg-1', iconColor: '#E0478A' },
  features: { icon: LayoutGrid, iconBg: 'p-bg-2', iconColor: '#89B8D8' },
  badge:    { icon: BadgeCheck, iconBg: 'p-bg-3', iconColor: '#C8A84B' },
  cta:      { icon: Layers,     iconBg: 'p-bg-4', iconColor: '#6B4E6E' },
}
const FALLBACK_STYLE = { icon: Layers, iconBg: 'p-bg-1', iconColor: '#E0478A' }

const fieldIcon = (field) => {
  if (field.type === 'url')        return Link
  if (field.key === 'badge')       return Tag
  if (field.key.includes('desc') || field.key.includes('subtitle')) return AlignLeft
  return Type
}

export default function HomePage() {
  const sections = useApi(() => listHomeSections(), [])

  const [activeSection, setActiveSection] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [toggling, setToggling] = useState(null)

  const items = sections.data ?? []

  const openEdit = (section) => {
    setActiveSection(section)
    setFormData({ ...section.data })
    setError(null)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await updateHomeSection(activeSection.id, formData)
      setActiveSection(null)
      sections.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (section) => {
    if (toggling) return
    setToggling(section.id)
    try {
      await setHomeSectionActive(section.id, !section.active)
      sections.reload()
    } catch (err) {
      alert(err.message)
    } finally {
      setToggling(null)
    }
  }

  const activeCount = items.filter(s => s.active).length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>الصفحة الرئيسية</h1>
          <p>إدارة محتوى وأقسام الصفحة الرئيسية للمتجر</p>
        </div>
        {items.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            {activeCount} قسم مفعّل
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-line)', display: 'inline-block', marginRight: 6 }} />
            {items.length - activeCount} موقوف
          </div>
        )}
      </div>

      <StateBlock
        loading={sections.loading} error={sections.error} onRetry={sections.reload}
        isEmpty={!items.length} emptyLabel="لا توجد أقسام"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {items.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              toggling={toggling === section.id}
              onEdit={() => openEdit(section)}
              onToggle={() => toggleActive(section)}
            />
          ))}
        </div>
      </StateBlock>

      {/* ══════ EDIT MODAL ══════ */}
      {activeSection && (() => {
        const style = SECTION_STYLE[activeSection.id] ?? FALLBACK_STYLE
        const Icon = style.icon
        return (
          <div className="modal-overlay" onClick={() => !saving && setActiveSection(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: '#fff', borderRadius: 'var(--radius-brand)',
              width: '100%', maxWidth: 600, maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)', animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)', overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 26px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                <div className={style.iconBg} style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={style.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 17 }}>تعديل — {activeSection.title}</h2>
                  <p style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3, fontFamily: 'Cairo' }}>{activeSection.description}</p>
                </div>
                <button onClick={() => setActiveSection(null)} style={{
                  background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)',
                  borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={17} color="var(--brand-ink-soft)" />
                </button>
              </div>

              <div style={{ overflowY: 'auto', padding: '22px 26px', flex: 1 }}>
                {error && <FormError message={error} />}

                {activeSection.fields.map((field, i) => (
                  <FieldGroup key={field.key} field={field}
                    value={formData[field.key] ?? ''}
                    onChange={v => setFormData(prev => ({ ...prev, [field.key]: v }))}
                    index={i} totalFields={activeSection.fields.length} sectionId={activeSection.id}
                  />
                ))}
              </div>

              <div style={{ padding: '14px 26px', borderTop: '2px solid var(--brand-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--brand-cream)', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>
                  {activeSection.fields.filter(f => (formData[f.key] ?? '').toString().trim()).length} / {activeSection.fields.length} حقول مكتملة
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setActiveSection(null)} disabled={saving}>إلغاء</button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
                      : 'حفظ التعديلات'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

/* ─── SectionCard ─── */
function SectionCard({ section, onEdit, onToggle, toggling }) {
  const style   = SECTION_STYLE[section.id] ?? FALLBACK_STYLE
  const Icon    = style.icon
  const total   = section.fields.length
  const filled  = section.fields.filter(f => (section.data[f.key] ?? '').toString().trim()).length
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0

  return (
    <div className="card" style={{
      padding: '20px 22px', display: 'flex', flexDirection: 'column',
      opacity: section.active ? 1 : 0.65,
      transition: 'opacity 0.2s',
    }}>
      {/* Checkbox row */}
      <div
        onClick={toggling ? undefined : onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 14, cursor: toggling ? 'default' : 'pointer', userSelect: 'none',
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          border: `2px solid ${section.active ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
          background: section.active ? 'var(--brand-pink)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {toggling
            ? <Loader2 size={11} color={section.active ? '#fff' : 'var(--brand-pink)'} style={{ animation: 'spin 1s linear infinite' }} />
            : section.active && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: section.active ? 'var(--brand-pink)' : 'var(--brand-ink-soft)' }}>
          {section.active ? 'القسم مفعّل' : 'القسم موقوف'}
        </span>
        <span style={{
          marginRight: 'auto',
          background: section.active ? '#dcfce7' : 'var(--brand-cream)',
          color: section.active ? '#15803d' : 'var(--brand-ink-soft)',
          borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
        }}>
          {section.active ? 'ظاهر' : 'مخفي'}
        </span>
      </div>

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div className={style.iconBg} style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={style.iconColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 16, color: 'var(--brand-ink)', marginBottom: 4 }}>{section.title}</div>
          <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.6 }}>{section.description}</div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: 'var(--brand-line)', marginBottom: 14 }} />

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{filled} / {total} حقول</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: percent === 100 ? '#15803d' : percent >= 50 ? '#C8A84B' : 'var(--error)' }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${percent}%`,
            background: percent === 100 ? 'linear-gradient(90deg,#16a34a,#15803d)' : percent >= 50 ? 'linear-gradient(90deg,#C8A84B,#a8893a)' : 'linear-gradient(90deg,#E0478A,#cc3a7a)',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>{relativeTime(section.updated_at)}</span>
        <button onClick={onEdit} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 18px', borderRadius: 10, border: 'none',
          background: '#1e3a2f', color: '#fff', fontFamily: 'Cairo', fontWeight: 700, fontSize: 13, transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
          onMouseLeave={e => e.currentTarget.style.background = '#1e3a2f'}
        >
          <Edit2 size={14} /> تعديل
        </button>
      </div>
    </div>
  )
}

/* ─── FieldGroup ─── */
function FieldGroup({ field, value, onChange, sectionId, index, totalFields }) {
  const isFeatures    = sectionId === 'features'
  const showSeparator = isFeatures && index % 2 === 0
  const cardLabels    = ['الأول', 'الثاني', 'الثالث', 'الرابع']
  const cardNum       = isFeatures ? Math.floor(index / 2) + 1 : null
  const Icon          = fieldIcon(field)

  return (
    <>
      {showSeparator && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: index === 0 ? 0 : 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-pink-softer)', color: 'var(--brand-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{cardNum}</div>
          <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 14 }}>الكارت {cardLabels[cardNum - 1]}</div>
          <div style={{ flex: 1, height: '1.5px', background: 'var(--brand-line)' }} />
        </div>
      )}
      <div className="form-group" style={{ marginBottom: index === totalFields - 1 ? 0 : 16 }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon size={13} color="var(--brand-pink)" /> {field.label}
        </label>
        <input className="form-control"
          type={field.type === 'url' ? 'text' : field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={field.type === 'url' ? { direction: 'ltr', textAlign: 'left' } : {}}
        />
        {value.trim() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <CheckCircle2 size={12} color="#15803d" />
            <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>تم الملء</span>
          </div>
        )}
      </div>
    </>
  )
}
