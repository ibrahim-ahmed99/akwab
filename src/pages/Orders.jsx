import { useState, useEffect } from 'react'
import { Search, Eye, X, CheckCircle, Clock, XCircle, Truck } from 'lucide-react'
import { useBadges } from '../context/BadgesContext'

const initialOrders = [
  { id: '#10234', customer: 'أحمد محمد',   phone: '01012345678', product: 'لابتوب Dell XPS 15',    qty: 1, amount: 18500, status: 'مكتمل', date: '2026/05/28', address: 'القاهرة، مدينة نصر' },
  { id: '#10235', customer: 'سارة أحمد',   phone: '01123456789', product: 'هاتف iPhone 15 Pro',    qty: 1, amount: 25000, status: 'جاري',  date: '2026/05/29', address: 'الجيزة، المهندسين' },
  { id: '#10236', customer: 'محمود علي',   phone: '01234567890', product: 'سماعات Sony WH',         qty: 2, amount: 6400,  status: 'معلق',  date: '2026/05/29', address: 'الإسكندرية، الرمل' },
  { id: '#10237', customer: 'فاطمة خالد',  phone: '01098765432', product: 'كاميرا Canon EOS R5',   qty: 1, amount: 12000, status: 'مكتمل', date: '2026/05/30', address: 'القاهرة، المعادي' },
  { id: '#10238', customer: 'عمر يوسف',    phone: '01187654321', product: 'تابلت iPad Pro 12.9',   qty: 1, amount: 22000, status: 'ملغي',  date: '2026/05/30', address: 'المنصورة، الدقهلية' },
  { id: '#10239', customer: 'نورا حسن',    phone: '01565432109', product: 'كرسي مكتب Ergonomic',   qty: 2, amount: 11000, status: 'شحن',   date: '2026/05/30', address: 'القاهرة، الزمالك' },
  { id: '#10240', customer: 'ياسر إبراهيم', phone: '01076543210', product: 'حذاء أديداس Ultraboost', qty: 3, amount: 8400,  status: 'جاري',  date: '2026/05/31', address: 'طنطا، الغربية' },
  { id: '#10241', customer: 'منى عبدالله', phone: '01234509876', product: 'تيشيرت قطن بريميوم',     qty: 5, amount: 1750,  status: 'مكتمل', date: '2026/05/31', address: 'أسوان، كورنيش النيل' },
]

const statusMeta = {
  'مكتمل': { badge: 'badge-success', icon: <CheckCircle size={13} /> },
  'جاري':  { badge: 'badge-info',    icon: <Clock size={13} /> },
  'معلق':  { badge: 'badge-warning', icon: <Clock size={13} /> },
  'ملغي':  { badge: 'badge-danger',  icon: <XCircle size={13} /> },
  'شحن':   { badge: 'badge-gold',    icon: <Truck size={13} /> },
}

const STATUSES = ['الكل', 'مكتمل', 'جاري', 'معلق', 'شحن', 'ملغي']

export default function Orders() {
  const [orders, setOrders]         = useState(initialOrders)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState('الكل')
  const [viewOrder, setViewOrder]   = useState(null)
  const { setBadge } = useBadges()

  useEffect(() => {
    const active = orders.filter(o => ['جاري','معلق','شحن'].includes(o.status)).length
    setBadge('/orders', active)
  }, [orders])

  const filtered = orders.filter(o => {
    const matchS = o.id.includes(search) || o.customer.includes(search) || o.product.includes(search)
    const matchF = filterStatus === 'الكل' || o.status === filterStatus
    return matchS && matchF
  })

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'الكل' ? orders.length : orders.filter(o => o.status === s).length
    return acc
  }, {})

  const totalRevenue = orders.filter(o => o.status === 'مكتمل').reduce((s, o) => s + o.amount, 0)

  const updateStatus = (orderId, ns) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: ns } : o))
    setViewOrder(prev => prev?.id === orderId ? { ...prev, status: ns } : prev)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>الأوردرات</h1>
          <p>متابعة وإدارة طلبات العملاء</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلبات',    value: orders.length,                          bg: 'p-bg-1', color: '#E0478A' },
          { label: 'إيرادات مكتملة (k)', value: `${(totalRevenue/1000).toFixed(1)}`,  bg: 'p-bg-3', color: '#C8A84B' },
          { label: 'قيد التنفيذ',        value: counts['جاري'] + counts['شحن'],        bg: 'p-bg-2', color: '#89B8D8' },
          { label: 'ملغية',              value: counts['ملغي'],                         bg: 'p-bg-4', color: '#6B4E6E' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{ width: 46, height: 46, borderRadius: 'var(--radius-brand-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: s.value.toString().length > 3 ? 15 : 20, color: s.color }}>{s.value}</div>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 15px', borderRadius: 'var(--radius-brand-sm)', border: 'none', cursor: 'pointer',
              fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
              background: filterStatus === s ? 'var(--brand-pink)' : 'var(--brand-cream)',
              color:      filterStatus === s ? '#fff'               : 'var(--brand-ink-soft)',
              boxShadow:  filterStatus === s ? 'var(--shadow-md)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.2s',
            }}>
              {s}
              <span style={{
                background: filterStatus === s ? 'rgba(255,255,255,0.25)' : 'var(--brand-line)',
                color:      filterStatus === s ? '#fff' : 'var(--brand-ink-soft)',
                borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 800,
              }}>{counts[s]}</span>
            </button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-bar">
            <Search size={15} color="var(--brand-ink-soft)" />
            <input placeholder="ابحث برقم الطلب أو اسم العميل..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{filtered.length} طلب</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 13 }}>{o.id}</span></td>
                  <td style={{ fontWeight: 700 }}>{o.customer}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)' }}>{o.product}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{o.qty}</td>
                  <td style={{ fontWeight: 800 }}>ج.م {o.amount.toLocaleString('ar')}</td>
                  <td style={{ color: 'var(--brand-ink-soft)', fontSize: 13 }}>{o.date}</td>
                  <td>
                    <span className={`badge ${statusMeta[o.status].badge}`}>
                      {statusMeta[o.status].icon} {o.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setViewOrder(o)} style={{
                      background: 'var(--brand-pink-softer)', border: 'none',
                      borderRadius: 10, width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      <Eye size={14} color="var(--brand-pink)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewOrder && (
        <div className="modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>تفاصيل الطلب {viewOrder.id}</h2>
                <span className={`badge ${statusMeta[viewOrder.status].badge}`} style={{ marginTop: 6 }}>
                  {statusMeta[viewOrder.status].icon} {viewOrder.status}
                </span>
              </div>
              <button onClick={() => setViewOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'العميل',       value: viewOrder.customer },
                { label: 'الهاتف',       value: viewOrder.phone },
                { label: 'تاريخ الطلب', value: viewOrder.date },
                { label: 'العنوان',      value: viewOrder.address },
              ].map(f => (
                <div key={f.label} className="p-bg-1" style={{ borderRadius: 'var(--radius-brand-sm)', padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-ink)' }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--brand-cream)', borderRadius: 'var(--radius-brand-sm)', padding: 16, marginBottom: 18, border: '1.5px solid var(--brand-line)' }}>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginBottom: 8 }}>المنتج</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{viewOrder.product}</span>
                <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>× {viewOrder.qty}</span>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1.5px solid var(--brand-line)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>الإجمالي</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 17 }}>ج.م {viewOrder.amount.toLocaleString('ar')}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>تحديث الحالة</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {['جاري','شحن','مكتمل','معلق','ملغي'].map(s => (
                  <button key={s} onClick={() => updateStatus(viewOrder.id, s)} style={{
                    padding: '7px 16px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
                    border: '2px solid',
                    borderColor: viewOrder.status === s ? 'var(--brand-pink)' : 'var(--brand-line)',
                    background:  viewOrder.status === s ? 'var(--brand-pink)'  : '#fff',
                    color:       viewOrder.status === s ? '#fff'                : 'var(--brand-ink-soft)',
                    transition: 'all 0.2s',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
