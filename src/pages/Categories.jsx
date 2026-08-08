import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Tag, X, Loader2, ImageOff } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import StateBlock from '../components/StateBlock'
import Pagination from '../components/Pagination'
import ImageUploader from '../components/ImageUploader'
import FormError from '../components/FormError'
import * as categoriesApi from '../services/categories'
import { productStats } from '../services/products'
import { ACTIVE_BADGE, badgeClass, CATEGORY_STATUSES } from '../services/statusMaps'
import { num } from '../services/format'

const BG_CLASSES = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']
const EMPTY_FORM = { name: '', description: '', image: null, status: 'active' }

export default function Categories() {
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState(null)

  const debouncedSearch = useDebounced(search)

  // Reset to page 1 whenever the filters change, or a shrinking result set
  // leaves us stranded on a page that no longer exists.
  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  const list = useApi(
    () => categoriesApi.listCategories({ search: debouncedSearch, status, page, per_page: 12 }),
    [debouncedSearch, status, page],
  )

  // Two cheap counters the list alone can't provide.
  const activeCount = useApi(() => categoriesApi.listCategories({ status: 'active', per_page: 1 }), [])
  const productTotals = useApi(() => productStats(), [])

  const categories = list.data ?? []

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat.id)
    setForm({
      name: cat.name ?? '',
      description: cat.description ?? '',
      image: cat.image ?? null,
      status: cat.status ?? 'active',
    })
    setFormError(null)
    setShowModal(true)
  }

  const refreshAll = () => {
    list.reload()
    activeCount.reload()
    productTotals.reload()
  }

  const handleSave = async () => {
    if (!form.name.trim() || saving) return

    setSaving(true)
    setFormError(null)
    try {
      const body = {
        name: form.name.trim(),
        description: form.description || null,
        image: form.image,
        status: form.status,
      }
      if (editing) await categoriesApi.updateCategory(editing, body)
      else         await categoriesApi.createCategory(body)

      setShowModal(false)
      refreshAll()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return
    try {
      await categoriesApi.deleteCategory(id)
      refreshAll()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>الأقسام</h1>
          <p>إدارة أقسام المنتجات وتصنيفاتها</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> إضافة قسم
        </button>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <MiniStat label="إجمالي الأقسام"   value={list.meta?.total} bg="p-bg-1" color="#E0478A" />
        <MiniStat label="الأقسام النشطة"   value={activeCount.meta?.total} bg="p-bg-3" color="#C8A84B" />
        <MiniStat label="إجمالي المنتجات"  value={productTotals.data?.total} bg="p-bg-2" color="#89B8D8" />
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={15} color="var(--brand-ink-soft)" />
              <input placeholder="ابحث عن قسم..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="">كل الحالات</option>
              {CATEGORY_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {num(list.meta?.total ?? categories.length)} قسم
          </span>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!categories.length} emptyLabel="لا توجد أقسام"
        >
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16 }}>
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  style={{
                    borderRadius: 'var(--radius-brand)',
                    border: '2px solid var(--brand-line)',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                >
                  {/* Image strip */}
                  <div className={BG_CLASSES[i % 4]} style={{
                    height: 120, position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cat.image_url
                      ? <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageOff size={30} color="rgba(61,37,64,0.25)" />}
                    <span className={`badge ${badgeClass(ACTIVE_BADGE, cat.status)}`} style={{ position: 'absolute', top: 12, left: 12 }}>
                      {cat.status_label}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 16, color: 'var(--brand-ink)' }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 4, lineHeight: 1.6, minHeight: 38 }}>
                      {cat.description || '—'}
                    </div>

                    <div style={{
                      marginTop: 12, paddingTop: 12, borderTop: '1.5px solid var(--brand-line)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 13, color: 'var(--brand-pink)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Tag size={13} /> {num(cat.products_count)} منتج
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(cat)} style={iconBtn}>
                          <Edit2 size={13} color="var(--brand-ink-soft)" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} style={dangerBtn}>
                          <Trash2 size={13} color="var(--error)" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              <h2>{editing ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            {formError && <FormError message={formError} />}

            <div className="form-group">
              <label className="form-label">اسم القسم *</label>
              <input className="form-control" placeholder="مثال: إلكترونيات"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">الوصف</label>
              <textarea className="form-control" rows={3} placeholder="وصف مختصر للقسم"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <ImageUploader
              label="صورة القسم"
              folder="categories"
              value={form.image}
              onChange={image => setForm({ ...form, image })}
            />

            <div className="form-group">
              <label className="form-label">الحالة</label>
              <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {CATEGORY_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
                  : (editing ? 'حفظ التعديلات' : 'إضافة القسم')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── small pieces ─── */

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

function MiniStat({ label, value, color, bg }) {
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className={bg} style={{
        width: 48, height: 48, borderRadius: 'var(--radius-brand-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 18, color, flexShrink: 0,
      }}>
        {value === undefined || value === null ? '—' : num(value)}
      </div>
      <span style={{ fontSize: 14, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{label}</span>
    </div>
  )
}
