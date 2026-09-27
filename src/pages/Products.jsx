import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Loader2, ImageOff } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import StateBlock from '../components/StateBlock'
import Pagination from '../components/Pagination'
import ImageUploader from '../components/ImageUploader'
import FormError from '../components/FormError'
import * as productsApi from '../services/products'
import { listCategories } from '../services/categories'
import { ACTIVE_BADGE, badgeClass, PRODUCT_STATUSES } from '../services/statusMaps'
import { money, num } from '../services/format'

const BG = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']

const EMPTY = {
  name: '', subtitle: '', category_id: '',
  price: '', old_price: '', stock: '', status: 'active',
  description: '', specifications: '',
  images: [],
}

export default function Products() {
  const [search, setSearch]         = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus]         = useState('')
  const [page, setPage]             = useState(1)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState(null)

  const debouncedSearch = useDebounced(search)

  useEffect(() => { setPage(1) }, [debouncedSearch, categoryId, status])

  const list = useApi(
    () => productsApi.listProducts({ search: debouncedSearch, category_id: categoryId, status, page, per_page: 15 }),
    [debouncedSearch, categoryId, status, page],
  )
  const stats = useApi(() => productsApi.productStats(), [])
  // per_page maxes out at 100 on the API — plenty for a dropdown.
  const cats  = useApi(() => listCategories({ per_page: 100 }), [])

  const products   = list.data ?? []
  const categories = cats.data ?? []

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const refreshAll = () => { list.reload(); stats.reload() }

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, category_id: categories[0]?.id ?? '' })
    setFormError(null)
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      name: p.name ?? '',
      subtitle: p.subtitle ?? '',
      category_id: p.category_id ?? '',
      price: p.price ?? '',
      old_price: p.old_price ?? '',
      stock: p.stock ?? 0,
      status: p.status ?? 'active',
      description: p.description ?? '',
      specifications: p.specifications ?? '',
      // Index 0 is the primary image; the API splits it out as main_image.
      images: [p.main_image, ...(p.sub_images ?? [])].filter(Boolean),
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.category_id || saving) return

    setSaving(true)
    setFormError(null)
    try {
      const body = {
        name: form.name.trim(),
        subtitle: form.subtitle || null,
        category_id: Number(form.category_id),
        price: form.price === '' ? 0 : Number(form.price),
        old_price: form.old_price === '' ? null : Number(form.old_price),
        stock: form.stock === '' ? 0 : Number(form.stock),
        description: form.description || null,
        specifications: form.specifications || null,
        status: form.status,
        images: form.images,
      }
      if (editing) await productsApi.updateProduct(editing, body)
      else         await productsApi.createProduct(body)

      setShowModal(false)
      refreshAll()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    try {
      await productsApi.deleteProduct(id)
      refreshAll()
    } catch (err) {
      alert(err.message)
    }
  }

  const savings = (Number(form.old_price) > 0 && Number(form.price) > 0)
    ? Number(form.old_price) - Number(form.price)
    : 0

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>المنتجات</h1>
          <p>إدارة كتالوج المنتجات</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} disabled={!categories.length}>
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المنتجات', value: stats.data?.total,        bg: 'p-bg-1', color: '#E0478A' },
          { label: 'متاح',            value: stats.data?.active,       bg: 'p-bg-3', color: '#C8A84B' },
          { label: 'غير متاح',        value: stats.data?.inactive,     bg: 'p-bg-2', color: '#89B8D8' },
          { label: 'عليها خصم',       value: stats.data?.discounted,   bg: 'p-bg-4', color: '#6B4E6E' },
          { label: 'نفذ المخزون',     value: stats.data?.out_of_stock, bg: 'p-bg-2', color: 'var(--error)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{
              width: 46, height: 46, borderRadius: 'var(--radius-brand-sm)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: s.color,
            }}>
              {s.value === undefined ? '—' : num(s.value)}
            </div>
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="toolbar">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={15} color="var(--brand-ink-soft)" />
              <input placeholder="ابحث باسم المنتج..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={selectStyle}>
              <option value="">كل الأقسام</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
              <option value="">كل الحالات</option>
              {PRODUCT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {num(list.meta?.total ?? products.length)} منتج
          </span>
        </div>

        <StateBlock
          loading={list.loading} error={list.error} onRetry={list.reload}
          isEmpty={!products.length} emptyLabel="لا توجد منتجات"
        >
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>القسم</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {p.main_image_url
                            ? <img src={p.main_image_url} alt={p.name} style={{
                                width: 42, height: 42, borderRadius: 12, objectFit: 'cover',
                                flexShrink: 0, border: '2px solid var(--brand-line)',
                              }} />
                            : <div className={BG[i % 4]} style={{
                                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}><ImageOff size={16} color="rgba(61,37,64,0.3)" /></div>
                          }
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--brand-ink)', fontSize: 14 }}>{p.name}</div>
                            {p.subtitle && <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>{p.subtitle}</div>}
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-pink">{p.category || '—'}</span></td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--brand-ink)' }}>{money(p.price)}</div>
                        {p.old_price > 0 && (
                          <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', textDecoration: 'line-through' }}>
                            {money(p.old_price)}
                          </div>
                        )}
                      </td>
                      <td>
                        {p.stock > 0
                          ? <span style={{ fontWeight: 800, color: p.stock <= 5 ? 'var(--brand-gold)' : 'var(--brand-ink)' }}>{num(p.stock)}</span>
                          : <span className="badge badge-danger">نفذ</span>}
                      </td>
                      <td><span className={`badge ${badgeClass(ACTIVE_BADGE, p.status)}`}>{p.status_label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(p)} style={iconBtn}>
                            <Edit2 size={13} color="var(--brand-ink-soft)" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={dangerBtn}>
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

      {/* ══════════ MODAL ══════════ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 'var(--radius-brand)',
              width: '100%', maxWidth: 680, maxHeight: '92vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '22px 28px 16px', borderBottom: '2px solid var(--brand-line)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 18 }}>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={() => setShowModal(false)} style={{
                  background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)',
                  borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={18} color="var(--brand-ink-soft)" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: 'auto', padding: '20px 28px', flex: 1 }}>
              {formError && <FormError message={formError} />}

              <SectionLabel>العناوين</SectionLabel>
              <div className="form-group">
                <label className="form-label">العنوان الرئيسي *</label>
                <input className="form-control" placeholder="مثال: هاتف Samsung Galaxy S24 Ultra"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">العنوان الفرعي</label>
                <input className="form-control" placeholder="مثال: هواتف ذكية — يظهر أسفل الاسم بخط صغير"
                  value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
              </div>

              <SectionLabel>التسعير والقسم</SectionLabel>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">السعر الحالي (ج.م)</label>
                  <input className="form-control" type="number" min="0" placeholder="0"
                    value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">السعر قبل الخصم (ج.م)</label>
                  <input className="form-control" type="number" min="0" placeholder="اتركه فارغاً إن لم يوجد خصم"
                    value={form.old_price} onChange={e => set('old_price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">الكمية في المخزون</label>
                  <input className="form-control" type="number" min="0" placeholder="0"
                    value={form.stock} onChange={e => set('stock', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">القسم *</label>
                  <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                    <option value="" disabled>اختر القسم</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">الحالة</label>
                  <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                    {PRODUCT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {savings > 0 && (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>شارة الخصم:</span>
                  <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '3px 12px', fontWeight: 800, fontSize: 13 }}>
                    وفّري {num(savings)} ج.م
                  </span>
                </div>
              )}

              <SectionLabel>تفاصيل المنتج</SectionLabel>
              <div className="form-group">
                <label className="form-label">الوصف</label>
                <textarea className="form-control" rows={4} placeholder="اكتب وصفاً تفصيلياً يساعد العميل على فهم المنتج..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">المواصفات الفنية</label>
                <textarea className="form-control" rows={8} placeholder={'الخامة: خزف / سيراميك\nاللون: وردي فاتح\nالتصميم: جسم دائري مستدير مع قاعدة مستقرة ومقبض جانبي\nالزخرفة: ورود صغيرة متعددة الألوان\nالتشطيب: سطح مرقّط بتأثيرات لونية\nالاستخدام: تقديم القهوة والشاي والمشروبات الساخنة\nالطابع التصميمي: يدوي، ريفي وعصري\nالشكل: انسيابي ومستدير مع مقبض مريح'}
                  value={form.specifications} onChange={e => set('specifications', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 5 }}>
                  💡 اكتب كل مواصفة في سطر منفصل بصيغة «العنوان: القيمة»
                </div>
              </div>

              <SectionLabel>صور المنتج</SectionLabel>
              <ImageUploader
                label="الصور — الأولى هي الصورة الرئيسية"
                folder="products"
                multiple
                max={7}
                value={form.images}
                onChange={images => set('images', images)}
              />
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 28px', borderTop: '2px solid var(--brand-line)',
              display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0, background: '#fff',
            }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.category_id}>
                {saving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
                  : (editing ? 'حفظ التعديلات' : 'إضافة المنتج')}
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

export function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 15,
      color: 'var(--brand-ink)', marginBottom: 14, marginTop: 4,
      paddingBottom: 10, borderBottom: '1.5px solid var(--brand-line)',
    }}>
      <span style={{ width: 4, height: 16, background: 'var(--brand-pink)', borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
      {children}
    </div>
  )
}
