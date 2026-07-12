import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { ShoppingCart, Package, Users, TrendingUp, ArrowUpLeft } from 'lucide-react'

const salesData = [
  { month: 'يناير', مبيعات: 42000, طلبات: 120 },
  { month: 'فبراير', مبيعات: 58000, طلبات: 165 },
  { month: 'مارس',  مبيعات: 49000, طلبات: 140 },
  { month: 'أبريل', مبيعات: 73000, طلبات: 210 },
  { month: 'مايو',  مبيعات: 65000, طلبات: 185 },
  { month: 'يونيو', مبيعات: 88000, طلبات: 250 },
  { month: 'يوليو', مبيعات: 95000, طلبات: 270 },
]

const categoryData = [
  { name: 'إلكترونيات', value: 38, color: '#E0478A' },
  { name: 'ملابس',      value: 25, color: '#89B8D8' },
  { name: 'أثاث',       value: 18, color: '#C8A84B' },
  { name: 'رياضة',      value: 12, color: '#6B4E6E' },
  { name: 'أخرى',       value:  7, color: '#F7D2E0' },
]

const recentOrders = [
  { id: '#10234', customer: 'أحمد محمد',  product: 'لابتوب Dell XPS',    amount: 'ج.م 18,500', status: 'مكتمل', date: '28 مايو' },
  { id: '#10235', customer: 'سارة أحمد',  product: 'هاتف iPhone 15',    amount: 'ج.م 25,000', status: 'جاري',  date: '29 مايو' },
  { id: '#10236', customer: 'محمود علي',  product: 'سماعات Sony WH',    amount: 'ج.م 3,200',  status: 'معلق',  date: '29 مايو' },
  { id: '#10237', customer: 'فاطمة خالد', product: 'كاميرا Canon EOS',  amount: 'ج.م 12,000', status: 'مكتمل', date: '30 مايو' },
  { id: '#10238', customer: 'عمر يوسف',   product: 'تابلت iPad Pro',    amount: 'ج.م 22,000', status: 'ملغي',  date: '30 مايو' },
]

const topProducts = [
  { name: 'لابتوب Dell XPS 15',    sales: 85, revenue: '156,000', bg: 'p-bg-1' },
  { name: 'هاتف iPhone 15 Pro',    sales: 72, revenue: '180,000', bg: 'p-bg-2' },
  { name: 'سماعات Sony WH-1000',   sales: 68, revenue: '21,760',  bg: 'p-bg-3' },
  { name: 'كاميرا Canon EOS R5',   sales: 45, revenue: '540,000', bg: 'p-bg-4' },
]

const statusBadge = {
  'مكتمل': 'badge-success',
  'جاري':  'badge-info',
  'معلق':  'badge-warning',
  'ملغي':  'badge-danger',
}

const barColors = ['#E0478A', '#89B8D8', '#C8A84B', '#6B4E6E']

export default function Dashboard() {
  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>لوحة التحكم</h1>
          <p>مرحباً بك — إليك ملخص أعمالك اليوم</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ fontSize: 13 }}>تصدير تقرير</button>
          <button className="btn btn-primary" style={{ fontSize: 13 }}>+ طلب جديد</button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <StatCard
          icon="💰"
          bg="linear-gradient(135deg,#fce8f0,#f7d2e0)"
          iconColor="#E0478A"
          label="إجمالي الإيرادات"
          value="ج.م 470,500"
          badge="+12.5%" up
        />
        <StatCard
          icon="🛒"
          bg="linear-gradient(135deg,#d8e8f3,#b6d2e5)"
          iconColor="#89B8D8"
          label="إجمالي الطلبات"
          value="1,340"
          badge="+8.2%" up
        />
        <StatCard
          icon="📦"
          bg="linear-gradient(135deg,#faf5e4,#f0e3c4)"
          iconColor="#C8A84B"
          label="المنتجات النشطة"
          value="284"
          badge="+3.1%" up
        />
        <StatCard
          icon="👥"
          bg="linear-gradient(135deg,#efe3f0,#d9c4dc)"
          iconColor="#6B4E6E"
          label="إجمالي العملاء"
          value="5,820"
          badge="-1.4%" up={false}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="charts-grid">
        {/* Area chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="card-title" style={{ marginBottom: 0 }}>المبيعات الشهرية</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['7 أيام', '30 يوم', '12 شهر'].map((t, i) => (
                <button key={t} style={{
                  padding: '5px 13px', borderRadius: 10, border: 'none',
                  fontFamily: 'Cairo, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: i === 2 ? '#E0478A' : 'var(--brand-cream)',
                  color: i === 2 ? '#fff' : 'var(--brand-ink-soft)',
                  boxShadow: i === 2 ? '0 4px 12px rgba(224,71,138,0.25)' : 'none',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={salesData}>
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
                formatter={v => [`ج.م ${v.toLocaleString('ar')}`, 'مبيعات']}
              />
              <Area type="monotone" dataKey="مبيعات" stroke="#E0478A" strokeWidth={2.5} fill="url(#pinkGrad)" dot={false} activeDot={{ r: 5, fill: '#E0478A' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="card-title">توزيع الأقسام</div>
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={78}
                paddingAngle={4} dataKey="value"
              >
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ fontFamily: 'Cairo', borderRadius: 12, border: '2px solid var(--brand-line)' }}
                formatter={v => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 6 }}>
            {categoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-ink)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="card-title" style={{ marginBottom: 0 }}>آخر الطلبات</span>
            <a href="/orders" style={{
              fontSize: 13, color: 'var(--brand-pink)', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              عرض الكل <ArrowUpLeft size={14} />
            </a>
          </div>
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
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--brand-pink)', fontSize: 13 }}>{o.id}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-ink-soft)' }}>{o.product}</td>
                    <td style={{ fontWeight: 800 }}>{o.amount}</td>
                    <td><span className={`badge ${statusBadge[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-title">أكثر المنتجات مبيعاً</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className={p.bg} style={{
                      width: 38, height: 38, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                    }}>
                      {['💻', '📱', '🎧', '📷'][i]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-ink)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>
                        {p.sales} مبيعة · ج.م {p.revenue}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: barColors[i] }}>{p.sales}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.sales}%`, background: barColors[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, bg, iconColor, label, value, badge, up }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
        <span className={`stat-badge ${up ? 'up' : 'down'}`}>
          {up ? '▲' : '▼'} {badge}
        </span>
      </div>
    </div>
  )
}
