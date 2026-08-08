import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowUpLeft } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import StateBlock, { Loading, ErrorState, Empty } from '../components/StateBlock'
import * as dashboardApi from '../services/dashboard'
import { ORDER_BADGE, badgeClass } from '../services/statusMaps'
import { money, num } from '../services/format'

const SLICE_COLORS = ['#E0478A', '#89B8D8', '#C8A84B', '#6B4E6E', '#F7D2E0']
const BAR_COLORS   = ['#E0478A', '#89B8D8', '#C8A84B', '#6B4E6E']
const BG_CLASSES   = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']

const RANGES = [
  { key: '7d',  label: '7 أيام' },
  { key: '30d', label: '30 يوم' },
  { key: '12m', label: '12 شهر' },
]

export default function Dashboard() {
  const [range, setRange] = useState('12m')

  const stats   = useApi(() => dashboardApi.getStats(), [])
  const sales   = useApi(() => dashboardApi.getSales(range), [range])
  const slices  = useApi(() => dashboardApi.getCategoryDistribution(), [])
  const recent  = useApi(() => dashboardApi.getRecentOrders(5), [])
  const top     = useApi(() => dashboardApi.getTopProducts(4), [])

  const salesPoints = sales.data?.points ?? []
  const sliceData   = slices.data ?? []
  const recentRows  = recent.data ?? []
  const topRows     = top.data ?? []

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>لوحة التحكم</h1>
          <p>مرحباً بك — إليك ملخص أعمالك اليوم</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {stats.loading && <div className="card" style={{ marginBottom: 28 }}><Loading /></div>}
      {stats.error && <div className="card" style={{ marginBottom: 28 }}><ErrorState error={stats.error} onRetry={stats.reload} /></div>}
      {stats.data && (
        <div className="stats-grid">
          <StatCard
            icon="💰"
            bg="linear-gradient(135deg,#fce8f0,#f7d2e0)"
            label="إجمالي الإيرادات"
            value={money(stats.data.revenue.value)}
            metric={stats.data.revenue}
          />
          <StatCard
            icon="🛒"
            bg="linear-gradient(135deg,#d8e8f3,#b6d2e5)"
            label="إجمالي الطلبات"
            value={num(stats.data.orders.value)}
            metric={stats.data.orders}
          />
          <StatCard
            icon="📦"
            bg="linear-gradient(135deg,#faf5e4,#f0e3c4)"
            label="المنتجات النشطة"
            value={num(stats.data.active_products.value)}
            metric={stats.data.active_products}
          />
          <StatCard
            icon="👥"
            bg="linear-gradient(135deg,#efe3f0,#d9c4dc)"
            label="إجمالي العملاء"
            value={num(stats.data.customers.value)}
            metric={stats.data.customers}
          />
        </div>
      )}

      {/* ── Charts row ── */}
      <div className="charts-grid">
        {/* Area chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="card-title" style={{ marginBottom: 0 }}>المبيعات</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {RANGES.map(r => (
                <button key={r.key} onClick={() => setRange(r.key)} style={{
                  padding: '5px 13px', borderRadius: 10, border: 'none',
                  fontFamily: 'Cairo, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: range === r.key ? '#E0478A' : 'var(--brand-cream)',
                  color: range === r.key ? '#fff' : 'var(--brand-ink-soft)',
                  boxShadow: range === r.key ? '0 4px 12px rgba(224,71,138,0.25)' : 'none',
                }}>{r.label}</button>
              ))}
            </div>
          </div>

          <StateBlock
            loading={sales.loading} error={sales.error} onRetry={sales.reload}
            isEmpty={!salesPoints.length} emptyLabel="لا توجد مبيعات في هذه الفترة"
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesPoints}>
                <defs>
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E0478A" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#E0478A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E3E8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'Cairo', fill: '#6B4E6E' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'Cairo', fill: '#6B4E6E' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontFamily: 'Cairo', borderRadius: 14, border: '2px solid var(--brand-line)', boxShadow: 'var(--shadow-md)' }}
                  formatter={v => [money(v), 'مبيعات']}
                />
                <Area type="monotone" dataKey="sales" name="مبيعات" stroke="#E0478A" strokeWidth={2.5} fill="url(#pinkGrad)" dot={false} activeDot={{ r: 5, fill: '#E0478A' }} />
              </AreaChart>
            </ResponsiveContainer>
          </StateBlock>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="card-title">توزيع الأقسام</div>
          <StateBlock
            loading={slices.loading} error={slices.error} onRetry={slices.reload}
            isEmpty={!sliceData.length} emptyLabel="لا توجد بيانات أقسام"
          >
            <>
              <ResponsiveContainer width="100%" height={175}>
                <PieChart>
                  <Pie
                    data={sliceData}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={78}
                    paddingAngle={4} dataKey="value"
                  >
                    {sliceData.map((_, i) => <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontFamily: 'Cairo', borderRadius: 12, border: '2px solid var(--brand-line)' }}
                    formatter={v => [`${v}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 6 }}>
                {sliceData.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: SLICE_COLORS[i % SLICE_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-ink)' }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          </StateBlock>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="card-title" style={{ marginBottom: 0 }}>آخر الطلبات</span>
            <Link to="/orders" style={{
              fontSize: 13, color: 'var(--brand-pink)', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              عرض الكل <ArrowUpLeft size={14} />
            </Link>
          </div>

          <StateBlock
            loading={recent.loading} error={recent.error} onRetry={recent.reload}
            isEmpty={!recentRows.length} emptyLabel="لا توجد طلبات بعد"
          >
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>المنتج</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map(o => (
                    <tr key={o.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 13 }}>{o.number}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{o.customer || '—'}</td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)' }}>
                        {o.product || '—'}
                      </td>
                      <td style={{ fontWeight: 800 }}>{money(o.amount)}</td>
                      <td>
                        <span className={`badge ${badgeClass(ORDER_BADGE, o.status)}`}>{o.status_label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StateBlock>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-title">أكثر المنتجات مبيعاً</div>
          <StateBlock
            loading={top.loading} error={top.error} onRetry={top.reload}
            isEmpty={!topRows.length} emptyLabel="لا توجد مبيعات بعد"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topRows.map((p, i) => (
                <div key={p.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{
                          width: 38, height: 38, borderRadius: 12, objectFit: 'cover',
                          flexShrink: 0, border: '1.5px solid var(--brand-line)',
                        }} />
                      ) : (
                        <div className={BG_CLASSES[i % 4]} style={{
                          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                        }}>📦</div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, color: 'var(--brand-ink)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>
                          {num(p.units_sold)} مبيعة · {money(p.revenue)}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: BAR_COLORS[i % 4] }}>
                      {p.share_percent}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.share_percent}%`, background: BAR_COLORS[i % 4] }} />
                  </div>
                </div>
              ))}
            </div>
          </StateBlock>
        </div>
      </div>
    </div>
  )
}

/** `metric` is the API's {value, previous, delta, direction} block. */
function StatCard({ icon, bg, label, value, metric }) {
  const up   = metric.direction === 'up'
  const flat = metric.direction === 'flat' || metric.delta === null

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
        {flat ? (
          <span className="stat-badge" style={{ background: 'var(--brand-cream-2)', color: 'var(--brand-ink-soft)' }}>
            — بدون تغيير
          </span>
        ) : (
          <span className={`stat-badge ${up ? 'up' : 'down'}`}>
            {up ? '▲' : '▼'} {Math.abs(metric.delta)}%
          </span>
        )}
      </div>
    </div>
  )
}
