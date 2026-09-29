import { useEffect, useState } from 'react'
import { Save, Globe, Phone, Mail, MapPin, Users, Target, Eye, Plus, Trash2, Loader2 } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorState } from '../components/StateBlock'
import ImageUploader from '../components/ImageUploader'
import FormError from '../components/FormError'
import { getAbout, updateAbout } from '../services/settings'

const SCALARS = [
  'companyName', 'tagline', 'description', 'vision', 'mission',
  'website', 'email', 'phone', 'address', 'founded', 'employees',
]

const CONTACT_FIELDS = [
  { icon: <Globe size={17} />,  label: 'الموقع',        k: 'website',   bg: 'p-bg-1', color: '#E0478A' },
  { icon: <Mail size={17} />,   label: 'البريد',        k: 'email',     bg: 'p-bg-2', color: '#89B8D8' },
  { icon: <Phone size={17} />,  label: 'الهاتف',        k: 'phone',     bg: 'p-bg-3', color: '#C8A84B' },
  { icon: <MapPin size={17} />, label: 'العنوان',       k: 'address',   bg: 'p-bg-4', color: '#6B4E6E' },
  { icon: <Users size={17} />,  label: 'عدد الموظفين', k: 'employees', bg: 'p-bg-1', color: '#E0478A' },
]

const VALUE_BG = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']
const HIGHLIGHT_COLORS = ['#E0478A', '#89B8D8', '#C8A84B', '#6B4E6E']

export default function About() {
  const about = useApi(() => getAbout(), [])

  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft]       = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!about.data) return
    setDraft(buildDraft(about.data))
  }, [about.data])

  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }))

  const setListItem = (list, index, key, value) =>
    setDraft(p => ({
      ...p,
      [list]: p[list].map((row, i) => i === index ? { ...row, [key]: value } : row),
    }))

  const addListItem = (list, blank) =>
    setDraft(p => ({ ...p, [list]: [...p[list], blank] }))

  const removeListItem = (list, index) =>
    setDraft(p => ({ ...p, [list]: p[list].filter((_, i) => i !== index) }))

  const save = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await updateAbout(draft)
      setEditMode(false)
      about.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const cancel = () => {
    setDraft(buildDraft(about.data))
    setError(null)
    setEditMode(false)
  }

  if (about.loading) return <div className="card"><Loading /></div>
  if (about.error)   return <div className="card"><ErrorState error={about.error} onRetry={about.reload} /></div>
  if (!draft)        return null

  // In edit mode we render the draft; otherwise the last saved payload.
  const info = editMode ? draft : buildDraft(about.data)

  // A textarea bound to one scalar key. Declared as a plain call rather than a
  // nested component so React keeps the same element between renders — a nested
  // component definition remounts the field on every keystroke and drops focus.
  const textareaFor = (k, label) => (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && <label className="form-label" style={{ fontSize: 12 }}>{label}</label>}
      <textarea
        className="form-control" rows={3} style={{ fontSize: 14 }}
        value={draft[k]} onChange={e => set(k, e.target.value)}
      />
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>من نحن</h1>
          <p>هوية الشركة ومعلوماتها التفصيلية</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {editMode && (
            <button className="btn btn-outline" onClick={cancel} disabled={saving}>إلغاء</button>
          )}
          <button
            onClick={editMode ? save : () => setEditMode(true)}
            className={`btn ${editMode ? 'btn-gold' : 'btn-outline'}`}
            disabled={saving}
          >
            {saving   ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
              : editMode ? <><Save size={15} /> حفظ التغييرات</>
              : '✏️ تعديل المعلومات'}
          </button>
        </div>
      </div>

      {error && <FormError message={error} />}

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #3D2540 0%, #6B4E6E 60%, #3D2540 100%)',
        borderRadius: 'var(--radius-brand)', padding: '32px 36px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24,
        position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(224,71,138,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 100, width: 150, height: 150, borderRadius: '50%', background: 'rgba(200,168,75,0.12)', pointerEvents: 'none' }} />

        <div style={{
          width: 80, height: 80, borderRadius: 22, flexShrink: 0,
          background: 'linear-gradient(135deg, #E0478A 0%, #C8A84B 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 40, color: '#fff',
          boxShadow: '0 8px 24px rgba(224,71,138,0.5)', position: 'relative', zIndex: 1,
        }}>A</div>

        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {editMode ? (
            <div style={{ display: 'grid', gap: 10, maxWidth: 460 }}>
              <input className="form-control" placeholder="اسم الشركة" value={draft.companyName} onChange={e => set('companyName', e.target.value)} />
              <input className="form-control" placeholder="الشعار" value={draft.tagline} onChange={e => set('tagline', e.target.value)} />
              <div className="grid-2" style={{ gap: 10 }}>
                <input className="form-control" placeholder="سنة التأسيس" value={draft.founded} onChange={e => set('founded', e.target.value)} />
                <input className="form-control" placeholder="عدد الموظفين" value={draft.employees} onChange={e => set('employees', e.target.value)} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: 'Amiri, serif', fontSize: 28, fontWeight: 700, color: '#FEFCF0' }}>
                {info.companyName || '—'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(254,252,240,0.65)', marginTop: 5 }}>{info.tagline}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                {info.website   && <Chip icon="🌐" text={info.website} />}
                {info.founded   && <Chip icon="📅" text={`تأسست ${info.founded}`} />}
                {info.employees && <Chip icon="👥" text={`${info.employees} موظف`} />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Highlights */}
      <div className="card" style={{ marginBottom: 24 }}>
        <ListHeader
          title="أرقام مميزة"
          editMode={editMode}
          onAdd={() => addListItem('highlights', { value: '', label: '', icon: '⭐' })}
        />

        {editMode ? (
          <ListEditor
            rows={draft.highlights}
            onRemove={i => removeListItem('highlights', i)}
            columns="70px 1fr 1fr"
            render={(row, i) => (
              <>
                <input className="form-control" placeholder="⭐" style={{ fontSize: 20, textAlign: 'center' }}
                  value={row.icon ?? ''} onChange={e => setListItem('highlights', i, 'icon', e.target.value)} />
                <input className="form-control" placeholder="القيمة — 5,820+"
                  value={row.value ?? ''} onChange={e => setListItem('highlights', i, 'value', e.target.value)} />
                <input className="form-control" placeholder="الوصف — عميل راضٍ"
                  value={row.label ?? ''} onChange={e => setListItem('highlights', i, 'label', e.target.value)} />
              </>
            )}
          />
        ) : info.highlights.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
            {info.highlights.map((h, i) => (
              <div key={i} className={VALUE_BG[i % 4]} style={{
                borderRadius: 'var(--radius-brand-sm)', border: '1.5px solid var(--brand-line)',
                padding: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{h.icon}</div>
                <div style={{ fontFamily: 'Amiri, serif', fontSize: 24, fontWeight: 700, color: HIGHLIGHT_COLORS[i % 4] }}>{h.value}</div>
                <div style={{ fontSize: 13, color: 'var(--brand-ink-soft)', marginTop: 4 }}>{h.label}</div>
              </div>
            ))}
          </div>
        ) : <EmptyList label="لا توجد أرقام مضافة" />}
      </div>

      {/* About + Contact info */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>

        <div className="card">
          <div className="card-title">عن {info.companyName || 'الشركة'}</div>
          {editMode
            ? textareaFor("description", "وصف الشركة")
            : <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.9 }}>{info.description || '—'}</p>
          }

          <div className="divider" />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div className="p-bg-1" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Eye size={16} color="var(--brand-pink)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>رؤيتنا</div>
              {editMode
                ? textareaFor("vision")
                : <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', lineHeight: 1.8 }}>{info.vision || '—'}</p>
              }
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="p-bg-2" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={16} color="var(--brand-blue)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>مهمتنا</div>
              {editMode
                ? textareaFor("mission")
                : <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', lineHeight: 1.8 }}>{info.mission || '—'}</p>
              }
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">معلومات التواصل</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {CONTACT_FIELDS.map(f => (
              <div key={f.k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={f.bg} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 2 }}>{f.label}</div>
                  {editMode
                    ? <input className="form-control" style={{ padding: '7px 12px', fontSize: 13 }}
                        value={draft[f.k]} onChange={e => set(f.k, e.target.value)} />
                    : <div style={{ fontSize: 14, fontWeight: 700, wordBreak: 'break-word' }}>{info[f.k] || '—'}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="card" style={{ marginBottom: 24 }}>
        <ListHeader
          title="قيمنا"
          editMode={editMode}
          onAdd={() => addListItem('brand_values', { icon: '💎', title: '', desc: '' })}
        />

        {editMode ? (
          <ListEditor
            rows={draft.brand_values}
            onRemove={i => removeListItem('brand_values', i)}
            columns="70px 1fr 2fr"
            render={(row, i) => (
              <>
                <input className="form-control" placeholder="💎" style={{ fontSize: 20, textAlign: 'center' }}
                  value={row.icon ?? ''} onChange={e => setListItem('brand_values', i, 'icon', e.target.value)} />
                <input className="form-control" placeholder="العنوان"
                  value={row.title ?? ''} onChange={e => setListItem('brand_values', i, 'title', e.target.value)} />
                <input className="form-control" placeholder="الوصف"
                  value={row.desc ?? ''} onChange={e => setListItem('brand_values', i, 'desc', e.target.value)} />
              </>
            )}
          />
        ) : info.brand_values.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {info.brand_values.map((v, i) => (
              <div key={i} className={VALUE_BG[i % 4]} style={{ borderRadius: 'var(--radius-brand-sm)', padding: '22px 18px', textAlign: 'center', border: '1.5px solid var(--brand-line)' }}>
                <div style={{ fontSize: 34, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 15, color: 'var(--brand-ink)', marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        ) : <EmptyList label="لا توجد قيم مضافة" />}
      </div>
    </div>
  )
}

/* ─── helpers ─── */

/** Normalises the API payload into a fully-populated editable shape. */
function buildDraft(data) {
  const out = {}
  for (const key of SCALARS) out[key] = data?.[key] ?? ''
  out.team_members = data?.team_members ?? []
  out.brand_values = data?.brand_values ?? []
  out.highlights   = data?.highlights ?? []
  return out
}

const removeBtn = {
  background: 'var(--error-soft)', border: 'none', borderRadius: 10,
  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

function ListHeader({ title, editMode, onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <span className="card-title" style={{ marginBottom: 0 }}>{title}</span>
      {editMode && (
        <button className="btn btn-outline" style={{ fontSize: 13, padding: '7px 14px' }} onClick={onAdd}>
          <Plus size={14} /> إضافة
        </button>
      )}
    </div>
  )
}

function ListEditor({ rows, onRemove, columns, render }) {
  if (!rows.length) return <EmptyList label="لا توجد عناصر — اضغط «إضافة»" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((row, i) => (
        <div key={i} className="list-editor-row" style={{
          display: 'grid', gridTemplateColumns: `${columns} auto`,
          gap: 10, alignItems: 'center',
        }}>
          {render(row, i)}
          <button onClick={() => onRemove(i)} style={removeBtn}>
            <Trash2 size={14} color="var(--error)" />
          </button>
        </div>
      ))}
    </div>
  )
}

function EmptyList({ label }) {
  return (
    <div style={{
      padding: '28px 16px', textAlign: 'center',
      fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600,
      border: '2px dashed var(--brand-line)', borderRadius: 'var(--radius-brand-sm)',
    }}>{label}</div>
  )
}

function Chip({ icon, text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(254,252,240,0.12)', borderRadius: 20,
      padding: '5px 14px', fontSize: 12, color: 'rgba(254,252,240,0.75)', fontWeight: 600,
      border: '1px solid rgba(254,252,240,0.15)',
    }}>
      <span>{icon}</span> {text}
    </div>
  )
}
