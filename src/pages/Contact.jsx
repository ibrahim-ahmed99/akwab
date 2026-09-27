import { useEffect, useState } from 'react'
import {
  Mail, Phone, MapPin, MessageSquare, Check, Trash2, Eye, X,
  Search, Save, Loader2, Edit2,
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import { useBadges } from '../context/BadgesContext'
import StateBlock, { Loading, ErrorState } from '../components/StateBlock'
import Pagination from '../components/Pagination'
import FormError from '../components/FormError'
import * as messagesApi from '../services/messages'
import { getContactInfo, updateContactInfo } from '../services/settings'
import { REQUEST_BADGE, badgeClass, REQUEST_STATUSES } from '../services/statusMaps'
import { num } from '../services/format'

/* Presentation for each contact card — keyed by the API's card key. */
const CARD_STYLE = {
  phone:    { icon: <Phone size={20} />,          bg: 'p-bg-1', color: '#E0478A' },
  email:    { icon: <Mail size={20} />,           bg: 'p-bg-2', color: '#89B8D8' },
  address:  { icon: <MapPin size={20} />,         bg: 'p-bg-3', color: '#C8A84B' },
  whatsapp: { icon: <MessageSquare size={20} />,  bg: 'p-bg-4', color: '#25D366' },
}
const CARD_ORDER = ['phone', 'email', 'address', 'whatsapp']

export default function Contact() {
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [viewMsg, setViewMsg]   = useState(null)
  const [replyText, setReply]   = useState('')
  const [busy, setBusy]         = useState(false)
  const [modalError, setModalError] = useState(null)
  const { refreshBadges } = useBadges()

  const debouncedSearch = useDebounced(search)

  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  const info  = useApi(() => getContactInfo(), [])
  const stats = useApi(() => messagesApi.messageStats(), [])
  const list  = useApi(
    () => messagesApi.listMessages({ search: debouncedSearch, status, page, per_page: 15 }),
    [debouncedSearch, status, page],
  )

  const messages = list.data ?? []

  const afterChange = () => {
    list.reload()
    stats.reload()
    refreshBadges()
  }

  const runAction = async (action) => {
    if (busy) return
    setBusy(true)
    setModalError(null)
    try {
      await action()
      afterChange()
      return true
    } catch (err) {
      setModalError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const markReview = () =>
    runAction(async () => {
      await messagesApi.updateMessageStatus(viewMsg.id, 'in_review')
      setViewMsg(prev => ({ ...prev, status: 'in_review', status_label: 'قيد المراجعة' }))
    })

  // Reply persists the body *and* flips the status to replied in one call.
  const sendReply = () =>
    runAction(async () => {
      await messagesApi.replyToMessage(viewMsg.id, replyText.trim())
      setViewMsg(prev => ({ ...prev, status: 'replied', status_label: 'تم الرد', reply: replyText.trim() }))
      setReply('')
    })

  // Reachable from the table too, where the modal error banner isn't mounted —
  // so surface failures with an alert rather than silently swallowing them.
  const deleteMsg = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟') || busy) return

    setBusy(true)
    try {
      await messagesApi.deleteMessage(id)
      setViewMsg(null)
      afterChange()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  const openMsg = (m) => {
    setViewMsg(m)
    setReply(m.reply ?? '')
    setModalError(null)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>التواصل</h1>
          <p>الرسائل الواردة وبيانات التواصل</p>
        </div>
      </div>

      {/* Contact info cards */}
      <ContactCards info={info} />

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'إجمالي الرسائل', value: stats.data?.total,   bg: 'p-bg-1', color: '#E0478A' },
          { label: 'رسائل جديدة',    value: stats.data?.new,     bg: 'p-bg-4', color: '#6B4E6E' },
          { label: 'تم الرد',        value: stats.data?.replied, bg: 'p-bg-3', color: '#C8A84B' },
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

      {/* Messages table */}
      <div className="card">
        <div className="card-title">الرسائل الواردة</div>

        <div className="toolbar">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={15} color="var(--brand-ink-soft)" />
              <input placeholder="ابحث في الرسائل..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="">كل الحالات</option>
              {REQUEST_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {num(list.meta?.total ?? messages.length)} رسالة
          </span>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!messages.length} emptyLabel="لا توجد رسائل"
        >
          <>
            <div className="table-wrapper">
              <table className="table-cards">
                <thead>
                  <tr>
                    <th>المرسل</th>
                    <th>الموضوع</th>
                    <th>الرسالة</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => openMsg(m)}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{m.name || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)' }}>{m.email}</div>
                      </td>
                      <td data-label="الموضوع" style={{ fontWeight: 700, fontSize: 14 }}>{m.subject || '—'}</td>
                      <td data-label="الرسالة" style={{ maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)', fontSize: 13 }}>
                        {m.message}
                      </td>
                      <td data-label="التاريخ" style={{ fontSize: 12, color: 'var(--brand-ink-soft)', whiteSpace: 'nowrap' }}>{m.date}</td>
                      <td data-label="الحالة" onClick={e => e.stopPropagation()}>
                        <span className={`badge ${badgeClass(REQUEST_BADGE, m.status)}`}>{m.status_label}</span>
                      </td>
                      <td className="actions-cell" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openMsg(m)} style={{
                            background: 'var(--brand-pink-softer)', border: 'none', borderRadius: 10,
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Eye size={14} color="var(--brand-pink)" />
                          </button>
                          <button onClick={() => deleteMsg(m.id)} style={{
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

      {/* Message detail modal */}
      {viewMsg && (
        <div className="modal-overlay" onClick={() => setViewMsg(null)}>
          <div className="modal" style={{ maxWidth: 560, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{viewMsg.subject || 'رسالة'}</h2>
                <span className={`badge ${badgeClass(REQUEST_BADGE, viewMsg.status)}`} style={{ marginTop: 6 }}>
                  {viewMsg.status_label}
                </span>
              </div>
              <button onClick={() => setViewMsg(null)} style={{ background: 'none', border: 'none' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            {modalError && <FormError message={modalError} />}

            <div className="grid-2" style={{ gap: 10, marginBottom: 16 }}>
              {[
                { label: 'المرسل',  value: viewMsg.name },
                { label: 'البريد',  value: viewMsg.email },
                { label: 'الهاتف',  value: viewMsg.phone },
                { label: 'التاريخ', value: viewMsg.date },
              ].map(f => (
                <div key={f.label} className="p-bg-1" style={{ borderRadius: 'var(--radius-brand-sm)', padding: '11px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, wordBreak: 'break-word' }}>{f.value || '—'}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'var(--brand-cream)', borderRadius: 'var(--radius-brand-sm)',
              padding: 16, marginBottom: 16, border: '1.5px solid var(--brand-line)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 8 }}>الرسالة</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewMsg.message}</p>
            </div>

            {viewMsg.replied_at && (
              <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 12 }}>
                تم الرد في {viewMsg.replied_at}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">كتابة رد</label>
              <textarea className="form-control" rows={3} placeholder="اكتب ردك هنا..."
                value={replyText} onChange={e => setReply(e.target.value)} disabled={busy} />
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => deleteMsg(viewMsg.id)} className="btn btn-danger" disabled={busy}>
                <Trash2 size={14} /> حذف
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={markReview} className="btn btn-outline"
                  disabled={busy || viewMsg.status === 'in_review'}>
                  قيد المراجعة
                </button>
                <button onClick={sendReply} className="btn btn-primary" disabled={busy || !replyText.trim()}>
                  {busy
                    ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> جاري الإرسال...</>
                    : <><Check size={14} /> إرسال الرد</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── the four editable contact cards ─── */
function ContactCards({ info }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState({})
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const cards = info.data?.cards

  const startEdit = () => {
    setDraft(structuredClone(cards))
    setError(null)
    setEditing(true)
  }

  const save = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      // The API expects {phone: {value, sub}, email: {...}, …}
      const body = Object.fromEntries(
        CARD_ORDER.map(k => [k, { value: draft[k]?.value ?? '', sub: draft[k]?.sub ?? '' }]),
      )
      await updateContactInfo(body)
      setEditing(false)
      info.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (info.loading) return <div className="card" style={{ marginBottom: 24 }}><Loading /></div>
  if (info.error)   return <div className="card" style={{ marginBottom: 24 }}><ErrorState error={info.error} onRetry={info.reload} /></div>
  if (!cards)       return null

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
        {editing ? (
          <>
            <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => setEditing(false)} disabled={saving}>
              إلغاء
            </button>
            <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={save} disabled={saving}>
              {saving
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
                : <><Save size={14} /> حفظ بيانات التواصل</>}
            </button>
          </>
        ) : (
          <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={startEdit}>
            <Edit2 size={14} /> تعديل بيانات التواصل
          </button>
        )}
      </div>

      {error && <FormError message={error} />}

      <div className="grid-4">
        {CARD_ORDER.map(key => {
          const card  = cards[key]
          const style = CARD_STYLE[key]
          return (
            <div key={key} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div className={style.bg} style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-brand-sm)', color: style.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{style.icon}</div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{card.label}</span>
              </div>

              {editing ? (
                <>
                  <input className="form-control" style={{ padding: '7px 12px', fontSize: 13, marginBottom: 6 }}
                    placeholder="القيمة"
                    value={draft[key]?.value ?? ''}
                    onChange={e => setDraft({ ...draft, [key]: { ...draft[key], value: e.target.value } })} />
                  <input className="form-control" style={{ padding: '7px 12px', fontSize: 12 }}
                    placeholder="نص فرعي"
                    value={draft[key]?.sub ?? ''}
                    onChange={e => setDraft({ ...draft, [key]: { ...draft[key], sub: e.target.value } })} />
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 14, color: style.color, wordBreak: 'break-word' }}>
                    {card.value || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>{card.sub}</div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const selectStyle = {
  padding: '9px 16px', borderRadius: 'var(--radius-brand-sm)', border: '2px solid var(--brand-line)',
  fontFamily: 'Cairo', fontSize: 14, background: '#fff', color: 'var(--brand-ink)', cursor: 'pointer',
}
