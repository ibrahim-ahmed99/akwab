import { useEffect, useState } from 'react'
import { Save, CheckCircle2, Loader2 } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorState } from '../components/StateBlock'
import ImageUploader from '../components/ImageUploader'
import FormError from '../components/FormError'
import { getFormContent, updateFormContent } from '../services/settings'

export default function FormPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>النموذج</h1>
          <p>إدارة محتوى صفحة النموذج</p>
        </div>
      </div>

      <FormContent />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Page content — card 1 (content block) + card 2 (form config)
   ══════════════════════════════════════════════════════════ */
function FormContent() {
  const content = useApi(() => getFormContent(), [])

  const [card1, setCard1] = useState(null)
  const [card2, setCard2] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState(null)

  // Seed the editable draft once the API responds.
  useEffect(() => {
    if (!content.data) return
    setCard1({
      title:     content.data.card1.title ?? '',
      subtitle:  content.data.card1.subtitle ?? '',
      paragraph: content.data.card1.paragraph ?? '',
      link1:     content.data.card1.link1 ?? '',
      images:    content.data.card1.images ?? [],
    })
    setCard2({
      title:     content.data.card2.title ?? '',
      paragraph: content.data.card2.paragraph ?? '',
      fields:    content.data.card2.fields ?? [],
    })
  }, [content.data])

  const set1 = (k, v) => setCard1(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await updateFormContent({ card1, card2 })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      content.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (content.loading) return <div className="card"><Loading /></div>
  if (content.error)   return <div className="card"><ErrorState error={content.error} onRetry={content.reload} /></div>
  if (!card1 || !card2) return null

  const filled1 = [card1.title, card1.subtitle, card1.paragraph, card1.images.length ? '✓' : '', card1.link1]
    .filter(v => String(v).trim()).length
  const total1  = 5

  return (
    <>
      {error && <FormError message={error} />}

      <div style={{ marginBottom: 24 }}>

        {/* ══════════ CARD 1 ══════════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="p-bg-1" style={{ padding: '18px 22px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 17, color: 'var(--brand-ink)' }}>
                محتوى القسم
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>
                {filled1} / {total1} حقول مكتملة
              </div>
            </div>
            <ProgressRing value={filled1} total={total1} color="#E0478A" />
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="العنوان الرئيسي" required>
              <input className="form-control" placeholder="مثال: تواصل معنا"
                value={card1.title} onChange={e => set1('title', e.target.value)} />
            </Field>

            <Field label="العنوان الفرعي">
              <input className="form-control" placeholder="مثال: نحن هنا دائماً للمساعدة"
                value={card1.subtitle} onChange={e => set1('subtitle', e.target.value)} />
            </Field>

            <Field label="البراجراف">
              <textarea className="form-control" rows={4} placeholder="اكتب النص التفصيلي هنا..."
                value={card1.paragraph} onChange={e => set1('paragraph', e.target.value)} />
            </Field>

            <ImageUploader
              label="الصور"
              folder="form"
              multiple
              max={6}
              value={card1.images}
              onChange={images => set1('images', images)}
            />

            <Field label="الرابط الأول (Link 1)">
              <input className="form-control" placeholder="https://akwab.com/page"
                value={card1.link1} onChange={e => set1('link1', e.target.value)}
                style={{ direction: 'ltr', textAlign: 'left' }} />
            </Field>
          </div>
        </div>
      </div>

      {/* ══════ زرار الحفظ الموحّد ══════ */}
      <div style={{
        marginTop: 24, marginBottom: 28,
        background: '#fff', border: '2px solid var(--brand-line)',
        borderRadius: 'var(--radius-brand)', padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <ProgressChip label="محتوى القسم" filled={filled1} total={total1} color="var(--brand-pink)" />
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}
          style={{ minWidth: 150, justifyContent: 'center', fontSize: 15 }}>
          {saving   ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
            : saved ? <><CheckCircle2 size={16} /> تم الحفظ بنجاح</>
            :         <><Save size={16} /> حفظ الكل</>}
        </button>
      </div>
    </>
  )
}

/* ─── small pieces ─── */

function Field({ label, required, children }) {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        {label}
        {required && <span style={{ color: 'var(--brand-pink)', fontWeight: 800 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function ProgressChip({ label, filled, total, color }) {
  const done = filled === total
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: done ? '#16a34a' : color }} />
      <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>
        {label}:&nbsp;
        <span style={{ color: done ? '#15803d' : color, fontWeight: 800 }}>{filled}/{total}</span>
      </span>
    </div>
  )
}

function ProgressRing({ value, total, color }) {
  const pct    = total > 0 ? Math.round((value / total) * 100) : 0
  const r      = 18
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
      <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={4} />
        <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color,
      }}>{pct}%</div>
    </div>
  )
}
