import { useEffect, useState } from 'react'
import { Save, CheckCircle2, Loader2, Eye, Trash2, X } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useBadges } from '../context/BadgesContext'
import StateBlock, { Loading, ErrorState } from '../components/StateBlock'
import Pagination from '../components/Pagination'
import ImageUploader from '../components/ImageUploader'
import FormError from '../components/FormError'
import { getFormContent, updateFormContent, listGovernorates } from '../services/settings'
import * as submissionsApi from '../services/formSubmissions'
import { REQUEST_BADGE, badgeClass, REQUEST_STATUSES } from '../services/statusMaps'
import { num } from '../services/format'

export default function FormPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>النموذج</h1>
          <p>إدارة محتوى صفحة النموذج وطلباتها</p>
        </div>
      </div>

      <FormContent />
      <Submissions />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Page content — card 1 (content block) + card 2 (form config)
   ══════════════════════════════════════════════════════════ */
function FormContent() {
  const content = useApi(() => getFormContent(), [])
  const cities  = useApi(() => listGovernorates(), [])

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
      link2:     content.data.card1.link2 ?? '',
      images:    content.data.card1.images ?? [],
    })
    setCard2({
      title:     content.data.card2.title ?? '',
      paragraph: content.data.card2.paragraph ?? '',
      fields:    content.data.card2.fields ?? [],
    })
  }, [content.data])

  const availableFields = content.data?.card2?.available_fields ?? []

  const set1 = (k, v) => setCard1(p => ({ ...p, [k]: v }))
  const set2 = (k, v) => setCard2(p => ({ ...p, [k]: v }))

  const toggleField = (key) =>
    setCard2(p => ({
      ...p,
      fields: p.fields.includes(key) ? p.fields.filter(f => f !== key) : [...p.fields, key],
    }))

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

  const filled1 = [card1.title, card1.subtitle, card1.paragraph, card1.images.length ? '✓' : '', card1.link1, card1.link2]
    .filter(v => String(v).trim()).length
  const total1  = 6
  const filled2 = [card2.title, card2.paragraph, card2.fields.length ? '✓' : '']
    .filter(v => String(v).trim()).length
  const total2  = 3

  return (
    <>
      {error && <FormError message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

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

            <Field label="الرابط الثاني (Link 2)">
              <input className="form-control" placeholder="https://akwab.com/other"
                value={card1.link2} onChange={e => set1('link2', e.target.value)}
                style={{ direction: 'ltr', textAlign: 'left' }} />
            </Field>
          </div>
        </div>

        {/* ══════════ CARD 2 ══════════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="p-bg-2" style={{ padding: '18px 22px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 17, color: 'var(--brand-ink)' }}>
                إعدادات النموذج
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>
                {filled2} / {total2} حقول مكتملة
              </div>
            </div>
            <ProgressRing value={filled2} total={total2} color="#89B8D8" />
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="العنوان الرئيسي" required>
              <input className="form-control" placeholder="مثال: نموذج الطلب"
                value={card2.title} onChange={e => set2('title', e.target.value)} />
            </Field>

            <Field label="البراجراف">
              <textarea className="form-control" rows={3} placeholder="مثال: أكمل بياناتك وسيتواصل معك فريقنا في أقرب وقت..."
                value={card2.paragraph} onChange={e => set2('paragraph', e.target.value)} />
            </Field>

            <div style={{ height: '1.5px', background: 'var(--brand-line)' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-ink-soft)', letterSpacing: 1, marginBottom: 4 }}>
                الحقول الظاهرة في النموذج
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.7 }}>
                اختر الحقول التي يراها الزائر عند ملء النموذج على الموقع.
              </div>
            </div>

            {availableFields.map(f => (
              <FieldToggle
                key={f.key}
                checked={card2.fields.includes(f.key)}
                onChange={() => toggleField(f.key)}
                label={f.label}
                hint={f.key === 'governorate'
                  ? `قائمة منسدلة — ${num((cities.data ?? []).length)} محافظة`
                  : `نوع الحقل: ${f.type}`}
              />
            ))}
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
          <ProgressChip label="محتوى القسم"   filled={filled1} total={total1} color="var(--brand-pink)" />
          <div style={{ width: 1, height: 20, background: 'var(--brand-line)' }} />
          <ProgressChip label="إعدادات النموذج" filled={filled2} total={total2} color="#89B8D8" />
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

/* ══════════════════════════════════════════════════════════
   Submissions — the requests the public form produced
   ══════════════════════════════════════════════════════════ */
function Submissions() {
  const [status, setStatus] = useState('')
  const [page, setPage]     = useState(1)
  const [view, setView]     = useState(null)
  const [busy, setBusy]     = useState(false)
  const { refreshBadges }   = useBadges()

  useEffect(() => { setPage(1) }, [status])

  const list  = useApi(() => submissionsApi.listSubmissions({ status, page, per_page: 15 }), [status, page])
  const stats = useApi(() => submissionsApi.submissionStats(), [])

  const rows = list.data ?? []

  const afterChange = () => { list.reload(); stats.reload(); refreshBadges() }

  const changeStatus = async (id, next) => {
    if (busy) return
    setBusy(true)
    try {
      await submissionsApi.updateSubmissionStatus(id, next)
      setView(prev => prev?.id === id
        ? { ...prev, status: next, status_label: REQUEST_STATUSES.find(s => s.key === next)?.label }
        : prev)
      afterChange()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    try {
      await submissionsApi.deleteSubmission(id)
      setView(null)
      afterChange()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'إجمالي الطلبات', value: stats.data?.total,     bg: 'p-bg-1', color: '#E0478A' },
          { label: 'جديد',           value: stats.data?.new,       bg: 'p-bg-4', color: '#6B4E6E' },
          { label: 'قيد المراجعة',   value: stats.data?.in_review, bg: 'p-bg-2', color: '#89B8D8' },
          { label: 'تم الرد',        value: stats.data?.replied,   bg: 'p-bg-3', color: '#C8A84B' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{
              width: 46, height: 46, borderRadius: 'var(--radius-brand-sm)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: s.color,
            }}>{s.value === undefined ? '—' : num(s.value)}</div>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="card-title" style={{ marginBottom: 0 }}>طلبات النموذج</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="">كل الحالات</option>
              {REQUEST_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
              {num(list.meta?.total ?? rows.length)} طلب
            </span>
          </div>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!rows.length} emptyLabel="لا توجد طلبات بعد"
        >
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الهاتف</th>
                    <th>المحافظة</th>
                    <th>الكمية</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setView(r)}>
                      <td style={{ fontWeight: 700 }}>{r.name || '—'}</td>
                      <td style={{ fontSize: 13 }}>{r.phone || '—'}</td>
                      <td>{r.governorate || '—'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.quantity ?? '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--brand-ink-soft)', whiteSpace: 'nowrap' }}>{r.date}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <span className={`badge ${badgeClass(REQUEST_BADGE, r.status)}`}>{r.status_label}</span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setView(r)} style={{
                            background: 'var(--brand-pink-softer)', border: 'none', borderRadius: 10,
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Eye size={14} color="var(--brand-pink)" />
                          </button>
                          <button onClick={() => remove(r.id)} style={{
                            background: 'var(--error-soft)', border: 'none', borderRadius: 10,
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Trash2 size={14} color="var(--error)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination meta={list.meta} onPage={setPage} />
          </>
        </StateBlock>
      </div>

      {/* Detail modal */}
      {view && (
        <div className="modal-overlay" onClick={() => setView(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>طلب #{view.id}</h2>
                <span className={`badge ${badgeClass(REQUEST_BADGE, view.status)}`} style={{ marginTop: 6 }}>
                  {view.status_label}
                </span>
              </div>
              <button onClick={() => setView(null)} style={{ background: 'none', border: 'none' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'الاسم',     value: view.name },
                { label: 'الهاتف',    value: view.phone },
                { label: 'البريد',    value: view.email },
                { label: 'المحافظة',  value: view.governorate },
                { label: 'الكمية',    value: view.quantity },
                { label: 'التاريخ',   value: view.date },
              ].map(f => (
                <div key={f.label} className="p-bg-1" style={{ borderRadius: 'var(--radius-brand-sm)', padding: '11px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, wordBreak: 'break-word' }}>
                    {f.value === null || f.value === undefined || f.value === '' ? '—' : f.value}
                  </div>
                </div>
              ))}
            </div>

            {view.notes && (
              <div style={{
                background: 'var(--brand-cream)', borderRadius: 'var(--radius-brand-sm)',
                padding: 16, marginBottom: 16, border: '1.5px solid var(--brand-line)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 8 }}>ملاحظات</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{view.notes}</p>
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>تحديث الحالة</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 20 }}>
              {REQUEST_STATUSES.map(s => {
                const active = view.status === s.key
                return (
                  <button key={s.key} onClick={() => changeStatus(view.id, s.key)} disabled={busy || active} style={{
                    padding: '7px 16px', borderRadius: 10,
                    fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
                    border: '2px solid',
                    borderColor: active ? 'var(--brand-pink)' : 'var(--brand-line)',
                    background:  active ? 'var(--brand-pink)' : '#fff',
                    color:       active ? '#fff'              : 'var(--brand-ink-soft)',
                    transition: 'all 0.2s',
                  }}>{s.label}</button>
                )
              })}
            </div>

            <div className="modal-footer">
              <button onClick={() => remove(view.id)} className="btn btn-danger" disabled={busy}>
                <Trash2 size={14} /> حذف الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── small pieces ─── */

const selectStyle = {
  padding: '9px 16px', borderRadius: 'var(--radius-brand-sm)', border: '2px solid var(--brand-line)',
  fontFamily: 'Cairo', fontSize: 14, background: '#fff', color: 'var(--brand-ink)', cursor: 'pointer',
}

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

function FieldToggle({ checked, onChange, label, hint }) {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 14px', borderRadius: 'var(--radius-brand-sm)',
        border: `2px solid ${checked ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
        background: checked ? 'var(--brand-pink-softer)' : '#fff',
        cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
        background: checked ? 'var(--brand-pink)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-ink)' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 2 }}>{hint}</div>
      </div>
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
