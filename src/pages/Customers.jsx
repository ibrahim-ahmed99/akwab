import { useState } from 'react'
import { Edit2, Trash2, X, Star } from 'lucide-react'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#E0478A,#C8A84B)',
  'linear-gradient(135deg,#89B8D8,#3D2540)',
  'linear-gradient(135deg,#C8A84B,#E0478A)',
  'linear-gradient(135deg,#6B4E6E,#89B8D8)',
  'linear-gradient(135deg,#E0478A,#6B4E6E)',
  'linear-gradient(135deg,#3D2540,#C8A84B)',
  'linear-gradient(135deg,#89B8D8,#E0478A)',
  'linear-gradient(135deg,#C8A84B,#6B4E6E)',
]

const initialCustomers = [
  { id: 1, name: 'أحمد محمد السيد',   email: 'ahmed@email.com',  phone: '01012345678', city: 'القاهرة',     orders: 12, spent: 45000, status: 'VIP',  joined: '2024/01/15', avatar: 'أ' },
  { id: 2, name: 'سارة أحمد علي',     email: 'sara@email.com',   phone: '01123456789', city: 'الجيزة',      orders: 8,  spent: 28000, status: 'نشط',  joined: '2024/03/20', avatar: 'س' },
  { id: 3, name: 'محمود علي محمد',    email: 'mahmoud@email.com',phone: '01234567890', city: 'الإسكندرية', orders: 3,  spent: 9600,  status: 'نشط',  joined: '2024/06/10', avatar: 'م' },
  { id: 4, name: 'فاطمة خالد حسن',   email: 'fatma@email.com',  phone: '01098765432', city: 'المعادي',     orders: 15, spent: 62000, status: 'VIP',  joined: '2023/11/05', avatar: 'ف' },
  { id: 5, name: 'عمر يوسف إبراهيم', email: 'omar@email.com',   phone: '01187654321', city: 'المنصورة',   orders: 1,  spent: 22000, status: 'جديد', joined: '2026/05/28', avatar: 'ع' },
  { id: 6, name: 'نورا حسن محمود',    email: 'nora@email.com',   phone: '01565432109', city: 'الزمالك',     orders: 20, spent: 95000, status: 'VIP',  joined: '2023/08/14', avatar: 'ن' },
  { id: 7, name: 'ياسر إبراهيم كمال', email: 'yasser@email.com', phone: '01076543210', city: 'طنطا',        orders: 5,  spent: 12400, status: 'نشط',  joined: '2024/09/01', avatar: 'ي' },
  { id: 8, name: 'منى عبدالله رمضان', email: 'mona@email.com',   phone: '01234509876', city: 'أسوان',       orders: 7,  spent: 18500, status: 'نشط',  joined: '2024/04/22', avatar: 'م' },
]

const statusBadge = { 'VIP': 'badge-gold', 'نشط': 'badge-success', 'جديد': 'badge-info', 'محظور': 'badge-danger' }

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', status: 'نشط' })

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({ name: c.name, email: c.email, phone: c.phone, city: c.city, status: c.status })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setCustomers(prev => prev.map(c => c.id === editing ? { ...c, ...form } : c))
    } else {
      setCustomers(prev => [...prev, { id: Date.now(), ...form, orders: 0, spent: 0, joined: new Date().toLocaleDateString('ar-EG'), avatar: form.name[0] || 'ع' }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟'))
      setCustomers(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>العملاء</h1>
          <p>إدارة قاعدة بيانات العملاء</p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>العميل</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>المدينة</th>
                <th>الطلبات</th>
                <th>الإنفاق الكلي</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length], color: '#fff', fontWeight: 800 }}>
                        {c.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--brand-ink)', fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>منذ {c.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{c.email}</td>
                  <td style={{ fontSize: 13 }}>{c.phone}</td>
                  <td>{c.city}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--brand-pink)' }}>{c.orders}</td>
                  <td style={{ fontWeight: 800 }}>ج.م {c.spent.toLocaleString('ar')}</td>
                  <td>
                    <span className={`badge ${statusBadge[c.status]}`}>
                      {c.status === 'VIP' && <Star size={11} fill="currentColor" />}
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(c)} style={{ background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Edit2 size={13} color="var(--brand-ink-soft)" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'var(--error-soft)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={13} color="var(--error)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تعديل بيانات العميل</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--brand-ink-soft)" /></button>
            </div>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">الاسم الكامل *</label>
                <input className="form-control" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input className="form-control" type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input className="form-control" placeholder="01xxxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">المدينة</label>
                <input className="form-control" placeholder="القاهرة" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>نشط</option><option>VIP</option><option>جديد</option><option>محظور</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave}>حفظ التعديلات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
