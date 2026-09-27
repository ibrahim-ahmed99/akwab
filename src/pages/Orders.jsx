import { useEffect, useState } from 'react'
import { Search, Eye, X, CheckCircle, Clock, XCircle, Truck, Loader2 } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import { useBadges } from '../context/BadgesContext'
import StateBlock, { Loading, ErrorState } from '../components/StateBlock'
import Pagination from '../components/Pagination'
import * as ordersApi from '../services/orders'
import { ORDER_BADGE, badgeClass } from '../services/statusMaps'
import { money, num } from '../services/format'

const STATUS_ICON = {
  delivered:  <CheckCircle size={13} />,
  confirmed:  <Clock size={13} />,
  processing: <Clock size={13} />,
  pending:    <Clock size={13} />,
  shipped:    <Truck size={13} />,
  cancelled:  <XCircle size={13} />,
}

/**
 * Statuses the update endpoint accepts. `جاري` is sent as the Arabic label
 * because it maps to two DB values (confirmed + processing) — the API expands
 * it via OrderStatus::keysForLabel().
 */
const UPDATE_OPTIONS = [
  { value: 'processing', label: 'جاري' },
  { value: 'shipped',    label: 'شحن' },
  { value: 'delivered',  label: 'مكتمل' },
  { value: 'pending',    label: 'معلق' },
  { value: 'cancelled',  label: 'ملغي' },
]

export default function Orders() {
  const [search, setSearch]   = useState('')
  // '' = الكل; otherwise a comma-separated list of canonical status keys
  // (e.g. "confirmed,processing" for جاري) — never a display label.
  const [filter, setFilter]   = useState('')
  const [page, setPage]       = useState(1)
  const [viewId, setViewId]   = useState(null)
  const [updating, setUpdating] = useState(false)
  const { refreshBadges } = useBadges()

  const debouncedSearch = useDebounced(search)

  useEffect(() => { setPage(1) }, [debouncedSearch, filter])

  const list  = useApi(
    () => ordersApi.listOrders({ search: debouncedSearch, status: filter, page, per_page: 15 }),
    [debouncedSearch, filter, page],
  )
  const stats = useApi(() => ordersApi.orderStats(), [])
  const detail = useApi(() => ordersApi.showOrder(viewId), [viewId], { skip: !viewId })

  const orders = list.data ?? []
  const tabs = [
    { label: 'الكل', value: '', count: stats.data?.total },
    // value is the tab's canonical keys joined — decoupled from the Arabic label.
    ...(stats.data?.counts_by_status ?? []).map(c => ({ label: c.label, value: (c.keys ?? []).join(','), count: c.count })),
  ]

  const updateStatus = async (status) => {
    if (updating) return
    setUpdating(true)
    try {
      await ordersApi.updateOrderStatus(viewId, status)
      detail.reload()
      list.reload()
      stats.reload()
      refreshBadges()
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const order = detail.data

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>الأوردرات</h1>
          <p>متابعة وإدارة طلبات العملاء</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلبات',   value: stats.data && num(stats.data.total),                                    bg: 'p-bg-1', color: '#E0478A' },
          { label: 'إيرادات مكتملة',   value: stats.data && money(stats.data.revenue_completed),                      bg: 'p-bg-3', color: '#C8A84B' },
          { label: 'قيد التنفيذ',      value: stats.data && num(stats.data.in_progress),                              bg: 'p-bg-2', color: '#89B8D8' },
          { label: 'ملغية',            value: stats.data && num(stats.data.cancelled),                                bg: 'p-bg-4', color: '#6B4E6E' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{
              minWidth: 46, height: 46, padding: '0 10px', borderRadius: 'var(--radius-brand-sm)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: s.color,
              fontSize: (s.value ?? '').toString().length > 6 ? 12 : 18,
            }}>{s.value ?? '—'}</div>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.label} onClick={() => setFilter(t.value)} style={{
              padding: '7px 15px', borderRadius: 'var(--radius-brand-sm)', border: 'none',
              fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
              background: filter === t.value ? 'var(--brand-pink)' : 'var(--brand-cream)',
              color:      filter === t.value ? '#fff'              : 'var(--brand-ink-soft)',
              boxShadow:  filter === t.value ? 'var(--shadow-md)'  : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.2s',
            }}>
              {t.label}
              <span style={{
                background: filter === t.value ? 'rgba(255,255,255,0.25)' : 'var(--brand-line)',
                color:      filter === t.value ? '#fff' : 'var(--brand-ink-soft)',
                borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 800,
              }}>{t.count ?? '—'}</span>
            </button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-bar">
            <Search size={15} color="var(--brand-ink-soft)" />
            <input placeholder="ابحث برقم الطلب أو اسم العميل..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {num(list.meta?.total ?? orders.length)} طلب
          </span>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!orders.length} emptyLabel="لا توجد طلبات"
        >
          <>
            <div className="table-wrapper">
              <table className="table-cards">
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
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 13 }}>{o.number}</span></td>
                      <td data-label="العميل" style={{ fontWeight: 700 }}>{o.customer || '—'}</td>
                      <td data-label="المنتج" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)' }}>
                        {o.product || '—'}
                      </td>
                      <td data-label="الكمية" style={{ textAlign: 'center', fontWeight: 700 }}>{o.qty}</td>
                      <td data-label="المبلغ" style={{ fontWeight: 800 }}>{money(o.amount)}</td>
                      <td data-label="التاريخ" style={{ color: 'var(--brand-ink-soft)', fontSize: 13, whiteSpace: 'nowrap' }}>{o.date}</td>
                      <td data-label="الحالة">
                        <span className={`badge ${badgeClass(ORDER_BADGE, o.status)}`}>
                          {STATUS_ICON[o.status]} {o.status_label}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => setViewId(o.id)} style={{
                          background: 'var(--brand-pink-softer)', border: 'none',
                          borderRadius: 10, width: 32, height: 32,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Eye size={14} color="var(--brand-pink)" />
                        </button>
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
      {viewId && (
        <div className="modal-overlay" onClick={() => setViewId(null)}>
          <div className="modal" style={{ maxWidth: 600, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

            {detail.loading && <Loading />}
            {detail.error && <ErrorState error={detail.error} onRetry={detail.reload} />}

            {/* !loading guard: opening a second order keeps the previous
                response in state until the new one lands. */}
            {!detail.loading && !detail.error && order && (
              <>
                <div className="modal-header">
                  <div>
                    <h2>تفاصيل الطلب #{order.id}</h2>
                    <span className={`badge ${badgeClass(ORDER_BADGE, order.status)}`} style={{ marginTop: 6 }}>
                      {STATUS_ICON[order.status]} {order.status_label}
                    </span>
                  </div>
                  <button onClick={() => setViewId(null)} style={{ background: 'none', border: 'none' }}>
                    <X size={20} color="var(--brand-ink-soft)" />
                  </button>
                </div>

                <div className="grid-2" style={{ gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'العميل',       value: order.shipping_address?.name || order.customer_details?.name },
                    { label: 'الهاتف',       value: order.shipping_address?.phone || order.customer_details?.phone },
                    { label: 'تاريخ الطلب', value: order.date },
                    { label: 'العنوان',      value: order.shipping_address?.full },
                    { label: 'طريقة الدفع',  value: order.payment_method_label },
                    { label: 'البريد',       value: order.customer_details?.email },
                  ].map(f => (
                    <div key={f.label} className="p-bg-1" style={{ borderRadius: 'var(--radius-brand-sm)', padding: '12px 16px' }}>
                      <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 3 }}>{f.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-ink)', wordBreak: 'break-word' }}>
                        {f.value || '—'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment receipt (InstaPay / wallet) */}
                {order.payment_receipt && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginBottom: 8 }}>إيصال التحويل</div>
                    <a href={order.payment_receipt} target="_blank" rel="noreferrer">
                      <img src={order.payment_receipt} alt="إيصال التحويل" style={{
                        maxWidth: 220, maxHeight: 260, borderRadius: 'var(--radius-brand-sm)',
                        border: '2px solid var(--brand-line)', objectFit: 'cover', cursor: 'zoom-in',
                      }} />
                    </a>
                  </div>
                )}

                {/* Items */}
                <div style={{
                  background: 'var(--brand-cream)', borderRadius: 'var(--radius-brand-sm)',
                  padding: 16, marginBottom: 18, border: '1.5px solid var(--brand-line)',
                }}>
                  <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginBottom: 10 }}>عناصر الطلب</div>

                  {(order.items ?? []).map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                    }}>
                      {item.image && (
                        <img src={item.image} alt="" style={{
                          width: 36, height: 36, borderRadius: 9, objectFit: 'cover',
                          border: '1.5px solid var(--brand-line)', flexShrink: 0,
                        }} />
                      )}
                      <span style={{ fontWeight: 700, flex: 1, fontSize: 14 }}>{item.product_name}</span>
                      <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)', whiteSpace: 'nowrap' }}>
                        {money(item.unit_price)} × {item.quantity}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{money(item.total)}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1.5px solid var(--brand-line)', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <TotalRow label="المجموع الفرعي" value={money(order.subtotal)} />
                    {order.discount > 0 && <TotalRow label="الخصم" value={`- ${money(order.discount)}`} />}
                    <TotalRow label="الشحن" value={money(order.shipping)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontWeight: 800 }}>الإجمالي</span>
                      <span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 17 }}>{money(order.total)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1.5px solid var(--brand-line)' }}>
                      <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 4 }}>ملاحظات</div>
                      <div style={{ fontSize: 13 }}>{order.notes}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    تحديث الحالة
                    {updating && <Loader2 size={13} color="var(--brand-pink)" style={{ animation: 'spin 1s linear infinite' }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {UPDATE_OPTIONS.map(opt => {
                      const active = order.status_label === opt.label
                      return (
                        <button key={opt.value} onClick={() => updateStatus(opt.value)} disabled={updating || active} style={{
                          padding: '7px 16px', borderRadius: 10,
                          fontFamily: 'Cairo', fontWeight: 700, fontSize: 13,
                          border: '2px solid',
                          borderColor: active ? 'var(--brand-pink)' : 'var(--brand-line)',
                          background:  active ? 'var(--brand-pink)' : '#fff',
                          color:       active ? '#fff'              : 'var(--brand-ink-soft)',
                          opacity: updating && !active ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}>{opt.label}</button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TotalRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--brand-ink-soft)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--brand-ink)' }}>{value}</span>
    </div>
  )
}
