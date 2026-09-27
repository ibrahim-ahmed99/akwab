import { useEffect, useState } from 'react'
import { Edit2, Trash2, X, Star, Search, Loader2 } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import StateBlock from '../components/StateBlock'
import Pagination from '../components/Pagination'
import FormError from '../components/FormError'
import * as customersApi from '../services/customers'
import { listGovernorates } from '../services/settings'
import { CUSTOMER_BADGE, badgeClass, CUSTOMER_STATUSES } from '../services/statusMaps'
import { money, num } from '../services/format'

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

export default function Customers() {
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState({ name: '', email: '', phone: '', city_id: '', status: 'active' })
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState(null)

  const debouncedSearch = useDebounced(search)

  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  const list = useApi(
    () => customersApi.listCustomers({ search: debouncedSearch, status, page, per_page: 15 }),
    [debouncedSearch, status, page],
  )
  const cities = useApi(() => listGovernorates(), [])

  const customers = list.data ?? []

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({
      name: c.name ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      city_id: c.city_id ?? '',
      status: c.status ?? 'active',
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || saving) return

    setSaving(true)
    setFormError(null)
    try {
      await customersApi.updateCustomer(editing, {
        name: form.name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        city_id: form.city_id === '' ? null : Number(form.city_id),
        status: form.status,
      })
      setShowModal(false)
      list.reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return
    try {
      await customersApi.deleteCustomer(id)
      list.reload()
    } catch (err) {
      alert(err.message)
    }
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
        <div className="toolbar">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={15} color="var(--brand-ink-soft)" />
              <input placeholder="ابحث بالاسم أو البريد أو الهاتف..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="">كل الحالات</option>
              {CUSTOMER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {num(list.meta?.total ?? customers.length)} عميل
          </span>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!customers.length} emptyLabel="لا يوجد عملاء"
        >
          <>
            <div className="table-wrapper">
              <table className="table-cards">
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
                          <div className="avatar" style={{
                            background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                            color: '#fff', fontWeight: 800,
                          }}>{c.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--brand-ink)', fontSize: 14 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>منذ {c.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="البريد الإلكتروني" style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{c.email || '—'}</td>
                      <td data-label="الهاتف" style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                      <td data-label="المدينة">{c.city || '—'}</td>
                      <td data-label="الطلبات" style={{ textAlign: 'center', fontWeight: 800, color: 'var(--brand-pink)' }}>{num(c.orders)}</td>
                      <td data-label="الإنفاق الكلي" style={{ fontWeight: 800 }}>{money(c.spent)}</td>
                      <td data-label="الحالة">
                        <span className={`badge ${badgeClass(CUSTOMER_BADGE, c.status)}`}>
                          {c.status === 'vip' && <Star size={11} fill="currentColor" />}
                          {c.status_label}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(c)} style={iconBtn}>
                            <Edit2 size={13} color="var(--brand-ink-soft)" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} style={dangerBtn}>
                            <Trash2 size={13} color="var(--error)" />
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تعديل بيانات العميل</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            {formError && <FormError message={formError} />}

            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">الاسم الكامل *</label>
                <input className="form-control" placeholder="الاسم الكامل"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input className="form-control" type="email" placeholder="example@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input className="form-control" placeholder="01xxxxxxxxx"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">المحافظة</label>
                <select className="form-control" value={form.city_id}
                  onChange={e => setForm({ ...form, city_id: e.target.value })}>
                  <option value="">بدون</option>
                  {(cities.data ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select className="form-control" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  {CUSTOMER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 14, lineHeight: 1.7 }}>
              💡 الحالة تُشتق من الطلبات والإنفاق تلقائياً — اختيار «محظور» هو الوحيد الذي يُخزَّن بشكل دائم.
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
                  : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  padding: '9px 16px', borderRadius: 'var(--radius-brand-sm)', border: '2px solid var(--brand-line)',
  fontFamily: 'Cairo', fontSize: 14, background: '#fff', color: 'var(--brand-ink)', cursor: 'pointer',
}

const iconBtn = {
  background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)',
  borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const dangerBtn = {
  background: 'var(--error-soft)', border: 'none',
  borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
}
