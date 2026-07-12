import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, MessageSquare, Check, Trash2, Eye, X } from 'lucide-react'
import { useBadges } from '../context/BadgesContext'

const initialMessages = [
  { id: 1, name: 'أحمد محمد',    email: 'ahmed@email.com',  phone: '01012345678', subject: 'استفسار عن المنتجات',    message: 'أريد الاستفسار عن توافر لابتوب Dell XPS 15 وهل يوجد خصومات للكميات الكبيرة؟',           status: 'جديد',        date: '2026/05/30 10:30' },
  { id: 2, name: 'سارة علي',     email: 'sara@email.com',   phone: '01123456789', subject: 'مشكلة في الطلب',          message: 'لم يصلني طلبي رقم #10235 حتى الآن وقد مضى على الطلب أكثر من أسبوع.',                 status: 'قيد المراجعة', date: '2026/05/29 15:45' },
  { id: 3, name: 'محمود السيد',  email: 'mahmoud@email.com',phone: '01234567890', subject: 'طلب شراكة تجارية',        message: 'لدينا اهتمام بالتعاون معكم كموزع معتمد في منطقة الإسكندرية.',                        status: 'تم الرد',     date: '2026/05/28 09:15' },
  { id: 4, name: 'فاطمة إبراهيم',email: 'fatma@email.com',  phone: '01098765432', subject: 'اقتراح تحسين الخدمة',    message: 'أقترح إضافة خاصية المقارنة بين المنتجات في الموقع لتسهيل اتخاذ قرار الشراء.',        status: 'جديد',        date: '2026/05/30 08:00' },
  { id: 5, name: 'عمر حسن',      email: 'omar@email.com',   phone: '01187654321', subject: 'طلب فاتورة رسمية',       message: 'أحتاج فاتورة رسمية للطلب رقم #10238 لأغراض المحاسبة في الشركة.',                      status: 'تم الرد',     date: '2026/05/27 14:20' },
]

const statusBadge = { 'جديد': 'badge-pink', 'قيد المراجعة': 'badge-warning', 'تم الرد': 'badge-success' }

const contactCards = [
  { icon: <Phone size={20} />,       label: 'الهاتف',         value: '+20 100 123 4567', sub: 'السبت – الخميس: 9ص – 6م',   bg: 'p-bg-1', color: '#E0478A' },
  { icon: <Mail size={20} />,        label: 'البريد',         value: 'info@akwab.com',   sub: 'رد خلال 24 ساعة',           bg: 'p-bg-2', color: '#89B8D8' },
  { icon: <MapPin size={20} />,      label: 'العنوان',        value: 'القاهرة، مصر',     sub: 'شارع التحرير، المبنى 12',   bg: 'p-bg-3', color: '#C8A84B' },
  { icon: <MessageSquare size={20}/>, label: 'واتساب',        value: '+20 100 123 4567', sub: 'ردود فورية',                bg: 'p-bg-4', color: '#25D366' },
]

export default function Contact() {
  const [messages, setMessages] = useState(initialMessages)
  const [viewMsg, setViewMsg]   = useState(null)
  const [replyText, setReply]   = useState('')
  const { setBadge } = useBadges()

  useEffect(() => {
    setBadge('/contact', messages.filter(m => m.status === 'جديد').length)
  }, [messages])

  const markReplied = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'تم الرد' } : m))
    setViewMsg(prev => prev?.id === id ? { ...prev, status: 'تم الرد' } : prev)
  }

  const markReview = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'قيد المراجعة' } : m))
    setViewMsg(prev => prev?.id === id ? { ...prev, status: 'قيد المراجعة' } : prev)
  }

  const deleteMsg = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      setMessages(prev => prev.filter(m => m.id !== id))
      setViewMsg(null)
    }
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {contactCards.map(c => (
          <div key={c.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div className={c.bg} style={{ width: 44, height: 44, borderRadius: 'var(--radius-brand-sm)', color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.icon}
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الرسائل',   value: messages.length,                                   bg: 'p-bg-1', color: '#E0478A' },
          { label: 'رسائل جديدة',      value: messages.filter(m => m.status === 'جديد').length,  bg: 'p-bg-4', color: '#6B4E6E' },
          { label: 'تم الرد',           value: messages.filter(m => m.status === 'تم الرد').length, bg: 'p-bg-3', color: '#C8A84B' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{ width: 46, height: 46, borderRadius: 'var(--radius-brand-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Messages table */}
      <div className="card">
        <div className="card-title">الرسائل الواردة</div>
        <div className="table-wrapper">
          <table>
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
                <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setViewMsg(m)}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)' }}>{m.email}</div>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{m.subject}</td>
                  <td style={{ maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)', fontSize: 13 }}>{m.message}</td>
                  <td style={{ fontSize: 12, color: 'var(--brand-ink-soft)', whiteSpace: 'nowrap' }}>{m.date}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <span className={`badge ${statusBadge[m.status]}`}>{m.status}</span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewMsg(m)} style={{ background: 'var(--brand-pink-softer)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Eye size={14} color="var(--brand-pink)" />
                      </button>
                      <button onClick={() => deleteMsg(m.id)} style={{ background: 'var(--error-soft)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={14} color="var(--error)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message detail modal */}
      {viewMsg && (
        <div className="modal-overlay" onClick={() => setViewMsg(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{viewMsg.subject}</h2>
                <span className={`badge ${statusBadge[viewMsg.status]}`} style={{ marginTop: 6 }}>{viewMsg.status}</span>
              </div>
              <button onClick={() => setViewMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--brand-ink-soft)" /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'المرسل',  value: viewMsg.name },
                { label: 'البريد',  value: viewMsg.email },
                { label: 'الهاتف',  value: viewMsg.phone },
                { label: 'التاريخ', value: viewMsg.date },
              ].map(f => (
                <div key={f.label} className="p-bg-1" style={{ borderRadius: 'var(--radius-brand-sm)', padding: '11px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--brand-cream)', borderRadius: 'var(--radius-brand-sm)', padding: 16, marginBottom: 16, border: '1.5px solid var(--brand-line)' }}>
              <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 8 }}>الرسالة</div>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>{viewMsg.message}</p>
            </div>

            <div className="form-group">
              <label className="form-label">كتابة رد</label>
              <textarea className="form-control" rows={3} placeholder="اكتب ردك هنا..." value={replyText} onChange={e => setReply(e.target.value)} />
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => deleteMsg(viewMsg.id)} className="btn btn-danger"><Trash2 size={14} /> حذف</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => markReview(viewMsg.id)} className="btn btn-outline">قيد المراجعة</button>
                <button onClick={() => { markReplied(viewMsg.id); setReply('') }} className="btn btn-primary">
                  <Check size={14} /> تم الرد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
