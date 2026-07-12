import { useState, useRef } from 'react'
import { Plus, Search, Edit2, Trash2, X, Star, Upload, ImagePlus } from 'lucide-react'

const BG = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']
const statusBadge = { 'متاح': 'badge-success', 'نفذ': 'badge-danger', 'منخفض': 'badge-warning' }
const CATS = ['إلكترونيات', 'ملابس', 'أثاث', 'رياضة', 'كتب', 'مطبخ', 'صحة وجمال', 'ألعاب']

const EMPTY = {
  name: '', subtitle: '', category: 'إلكترونيات', sku: '', emoji: '📦',
  price: '', oldPrice: '', stock: '', status: 'متاح',
  rating: 0, description: '', specifications: '',
  mainImage: null, subImages: [],
  addToHome: false, addToBestSellers: false,
}

const initialProducts = [
  { id: 1,  name: 'لابتوب Dell XPS 15',       subtitle: 'كمبيوترات محمولة', category: 'إلكترونيات', price: 18500, oldPrice: 21000, stock: 24, status: 'متاح',  sku: 'DL-XPS-001', emoji: '💻', rating: 4.8, description: 'لابتوب احترافي بمعالج Intel Core i9 وشاشة OLED 15.6 بوصة بدقة 4K.', specifications: 'المعالج: Intel Core i9\nالذاكرة: 32GB DDR5\nالتخزين: 1TB NVMe SSD', mainImage: null, subImages: [], addToHome: true,  addToBestSellers: true  },
  { id: 2,  name: 'هاتف iPhone 15 Pro',        subtitle: 'هواتف ذكية',       category: 'إلكترونيات', price: 25000, oldPrice: 28000, stock: 18, status: 'متاح',  sku: 'AP-IP15-002', emoji: '📱', rating: 4.9, description: 'أحدث هاتف من Apple بشريحة A17 Pro وكاميرا 48 ميجابكسل.', specifications: 'الشاشة: 6.1 بوصة Super Retina XDR\nالبطارية: 3274 mAh\nالكاميرا: 48MP Triple', mainImage: null, subImages: [], addToHome: true,  addToBestSellers: false },
  { id: 3,  name: 'سماعات Sony WH-1000XM5',   subtitle: 'سماعات',            category: 'إلكترونيات', price: 3200,  oldPrice: 0,    stock: 0,  status: 'نفذ',   sku: 'SN-WH-003',  emoji: '🎧', rating: 4.7, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
  { id: 4,  name: 'كاميرا Canon EOS R5',       subtitle: 'كاميرات',           category: 'إلكترونيات', price: 12000, oldPrice: 14500, stock: 8,  status: 'متاح',  sku: 'CN-EOS-004', emoji: '📷', rating: 4.6, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: true  },
  { id: 5,  name: 'حذاء أديداس Ultraboost',    subtitle: 'أحذية رياضية',     category: 'رياضة',      price: 2800,  oldPrice: 3500,  stock: 45, status: 'متاح',  sku: 'AD-UB-005',  emoji: '👟', rating: 4.5, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
  { id: 6,  name: 'تيشيرت قطن بريميوم',        subtitle: 'ملابس رجالية',      category: 'ملابس',      price: 350,   oldPrice: 480,   stock: 5,  status: 'منخفض', sku: 'CL-TSH-006', emoji: '👕', rating: 4.2, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
  { id: 7,  name: 'كرسي مكتب Ergonomic',       subtitle: 'كراسي مكتبية',     category: 'أثاث',       price: 5500,  oldPrice: 0,    stock: 12, status: 'متاح',  sku: 'FN-CH-007',  emoji: '🪑', rating: 4.4, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
  { id: 8,  name: 'تابلت iPad Pro 12.9',        subtitle: 'أجهزة لوحية',      category: 'إلكترونيات', price: 22000, oldPrice: 24500, stock: 15, status: 'متاح',  sku: 'AP-IPD-008', emoji: '📱', rating: 4.8, description: '', specifications: '', mainImage: null, subImages: [], addToHome: true,  addToBestSellers: false },
  { id: 9,  name: 'مضرب تنس Wilson',            subtitle: 'معدات تنس',        category: 'رياضة',      price: 1200,  oldPrice: 0,    stock: 30, status: 'متاح',  sku: 'WL-TN-009',  emoji: '🎾', rating: 4.3, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
  { id: 10, name: 'كتاب تعلم البرمجة بالعربي', subtitle: 'كتب تعليمية',      category: 'كتب',        price: 180,   oldPrice: 250,   stock: 200, status: 'متاح', sku: 'BK-PG-010',  emoji: '📚', rating: 4.6, description: '', specifications: '', mainImage: null, subImages: [], addToHome: false, addToBestSellers: false },
]

/* ─── read file as dataURL ─── */
const readFile = (file) => new Promise(res => {
  const r = new FileReader()
  r.onload = e => res(e.target.result)
  r.readAsDataURL(file)
})

/* ════════════════════════════════════════════════════════ */
export default function Products() {
  const [products, setProducts]   = useState(initialProducts)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('الكل')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)

  const mainImgRef = useRef()
  const subImgRef  = useRef()

  const cats = ['الكل', ...new Set(products.map(p => p.category))]

  const filtered = products.filter(p => {
    const matchS = p.name.includes(search) || p.sku.includes(search)
    const matchC = filterCat === 'الكل' || p.category === filterCat
    return matchS && matchC
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      name: p.name, subtitle: p.subtitle ?? '', category: p.category,
      sku: p.sku, emoji: p.emoji, price: p.price, oldPrice: p.oldPrice ?? '',
      stock: p.stock, status: p.status, rating: p.rating ?? 0,
      description: p.description ?? '', specifications: p.specifications ?? '',
      mainImage: p.mainImage ?? null, subImages: p.subImages ?? [],
      addToHome: p.addToHome ?? false, addToBestSellers: p.addToBestSellers ?? false,
    })
    setShowModal(true)
  }

  /* handle main image */
  const onMainImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = await readFile(file)
    set('mainImage', url)
  }

  /* handle sub images (append) */
  const onSubImages = async (e) => {
    const files = Array.from(e.target.files)
    const urls  = await Promise.all(files.map(readFile))
    set('subImages', [...form.subImages, ...urls].slice(0, 6))
  }

  const removeSubImg = (i) =>
    set('subImages', form.subImages.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!form.name.trim()) return
    const data = { ...form, price: +form.price || 0, oldPrice: +form.oldPrice || 0, stock: +form.stock || 0 }
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing ? { ...p, ...data } : p))
    } else {
      setProducts(prev => [...prev, { id: Date.now(), ...data }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟'))
      setProducts(prev => prev.filter(p => p.id !== id))
  }

  const savings = (+form.oldPrice > 0 && +form.price > 0) ? (+form.oldPrice - +form.price) : 0

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>المنتجات</h1>
          <p>إدارة كتالوج المنتجات والمخزون</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> إضافة منتج</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المنتجات', value: products.length,                                   bg: 'p-bg-1', color: '#E0478A' },
          { label: 'متاح',            value: products.filter(p => p.status === 'متاح').length,  bg: 'p-bg-3', color: '#C8A84B' },
          { label: 'مخزون منخفض',    value: products.filter(p => p.status === 'منخفض').length, bg: 'p-bg-2', color: '#89B8D8' },
          { label: 'نفذ من المخزون', value: products.filter(p => p.status === 'نفذ').length,   bg: 'p-bg-4', color: '#6B4E6E' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={s.bg} style={{ width: 46, height: 46, borderRadius: 'var(--radius-brand-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: s.color }}>
              {s.value}
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
              <input placeholder="ابحث باسم المنتج أو SKU..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{
              padding: '9px 16px', borderRadius: 'var(--radius-brand-sm)', border: '2px solid var(--brand-line)',
              fontFamily: 'Cairo', fontSize: 14, background: '#fff', color: 'var(--brand-ink)', cursor: 'pointer',
            }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>{filtered.length} منتج</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>القسم</th>
                <th>SKU</th>
                <th>السعر</th>
                <th>التقييم</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {p.mainImage
                        ? <img src={p.mainImage} alt={p.name} style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '2px solid var(--brand-line)' }} />
                        : <div className={BG[i % 4]} style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{p.emoji}</div>
                      }
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--brand-ink)', fontSize: 14 }}>{p.name}</div>
                        {p.subtitle && <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 1 }}>{p.subtitle}</div>}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-pink">{p.category}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-ink-soft)' }}>{p.sku}</td>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--brand-ink)' }}>ج.م {(+p.price).toLocaleString('ar')}</div>
                    {p.oldPrice > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', textDecoration: 'line-through' }}>
                        ج.م {(+p.oldPrice).toLocaleString('ar')}
                      </div>
                    )}
                  </td>
                  <td>
                    {p.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={13} fill="#C8A84B" color="#C8A84B" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#C8A84B' }}>{p.rating}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: 14, color: p.stock === 0 ? 'var(--error)' : p.stock < 10 ? '#a16207' : '#15803d' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td><span className={`badge ${statusBadge[p.status]}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Edit2 size={13} color="var(--brand-ink-soft)" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'var(--error-soft)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
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

      {/* ══════════ MODAL ══════════ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-brand)',
              width: '100%',
              maxWidth: 680,
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Header — sticky */}
            <div style={{ padding: '22px 28px 16px', borderBottom: '2px solid var(--brand-line)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 18 }}>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={18} color="var(--brand-ink-soft)" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: 'auto', padding: '20px 28px', flex: 1 }}>

              {/* ── العناوين ── */}
              <SectionLabel>العناوين</SectionLabel>
              <div className="form-group">
                <label className="form-label">العنوان الرئيسي *</label>
                <input className="form-control" placeholder="مثال: هاتف Samsung Galaxy S24 Ultra" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">العنوان الفرعي</label>
                <input className="form-control" placeholder="مثال: هواتف ذكية — يظهر أسفل الاسم بخط صغير" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
              </div>

              {/* ── التسعير والمخزون ── */}
              <SectionLabel>التسعير والمخزون</SectionLabel>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">السعر الحالي (ج.م) *</label>
                  <input className="form-control" type="number" placeholder="0" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">السعر قبل الخصم (ج.م)</label>
                  <input className="form-control" type="number" placeholder="0 = لا يوجد خصم" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">الكمية في المخزون</label>
                  <input className="form-control" type="number" placeholder="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">الحالة</label>
                  <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option>متاح</option><option>منخفض</option><option>نفذ</option>
                  </select>
                </div>
              </div>

              {/* savings preview */}
              {savings > 0 && (
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>شارة الخصم:</span>
                  <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '3px 12px', fontWeight: 800, fontSize: 13 }}>
                    وفّري {savings.toLocaleString('ar')} ج.م
                  </span>
                </div>
              )}

              {/* ── التقييم والمعلومات ── */}
              <SectionLabel>المعلومات الإضافية</SectionLabel>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">القسم</label>
                  <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">كود المنتج (SKU)</label>
                  <input className="form-control" placeholder="مثال: EL-001" value={form.sku} onChange={e => set('sku', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">الأيقونة (Emoji)</label>
                  <input className="form-control" value={form.emoji} onChange={e => set('emoji', e.target.value)} style={{ fontSize: 22 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">التقييم (من 5)</label>
                  <StarRating value={form.rating} onChange={v => set('rating', v)} />
                </div>
              </div>

              {/* ── تفاصيل المنتج ── */}
              <SectionLabel>تفاصيل المنتج</SectionLabel>
              <div className="form-group">
                <label className="form-label">الوصف / تفاصيل المنتج</label>
                <textarea className="form-control" rows={4} placeholder="اكتب وصفاً تفصيلياً يساعد العميل على فهم المنتج..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">المواصفات الفنية</label>
                <textarea className="form-control" rows={4} placeholder={`المعالج: Intel Core i9\nالذاكرة: 32GB\nالتخزين: 1TB SSD`} value={form.specifications} onChange={e => set('specifications', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 5 }}>
                  💡 اكتب كل مواصفة في سطر منفصل
                </div>
              </div>

              {/* ── الصور ── */}
              <SectionLabel>صور المنتج</SectionLabel>

              {/* Main image */}
              <div className="form-group">
                <label className="form-label">الصورة الرئيسية</label>
                <input type="file" accept="image/*" ref={mainImgRef} style={{ display: 'none' }} onChange={onMainImage} />
                <div
                  onClick={() => mainImgRef.current.click()}
                  style={{
                    border: '2px dashed var(--brand-line)',
                    borderRadius: 'var(--radius-brand-sm)',
                    padding: form.mainImage ? 0 : '28px 16px',
                    cursor: 'pointer', overflow: 'hidden',
                    background: 'var(--brand-cream)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: form.mainImage ? 0 : 110,
                    transition: 'border-color 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-pink)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brand-line)'}
                >
                  {form.mainImage ? (
                    <>
                      <img src={form.mainImage} alt="main" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                      <button
                        onClick={e => { e.stopPropagation(); set('mainImage', null) }}
                        style={{
                          position: 'absolute', top: 8, left: 8,
                          background: 'rgba(61,37,64,0.7)', border: 'none', borderRadius: 8,
                          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <X size={13} color="#fff" />
                      </button>
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(224,71,138,0.9)', color: '#fff', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                        الصورة الرئيسية
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={28} color="var(--brand-pink)" style={{ marginBottom: 8 }} />
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-ink)' }}>اضغط لرفع الصورة الرئيسية</div>
                      <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 4 }}>PNG, JPG, WEBP — الحد الأقصى 5MB</div>
                    </>
                  )}
                </div>
              </div>

              {/* Sub images */}
              <div className="form-group">
                <label className="form-label">
                  الصور الفرعية
                  <span style={{ fontSize: 11, color: 'var(--brand-ink-soft)', fontWeight: 500, marginRight: 8 }}>
                    ({form.subImages.length}/6)
                  </span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {form.subImages.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '2px solid var(--brand-line)', aspectRatio: '1' }}>
                      <img src={img} alt={`sub-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => removeSubImg(i)}
                        style={{
                          position: 'absolute', top: 5, left: 5,
                          background: 'rgba(61,37,64,0.7)', border: 'none', borderRadius: 7,
                          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <X size={12} color="#fff" />
                      </button>
                    </div>
                  ))}

                  {form.subImages.length < 6 && (
                    <div
                      onClick={() => subImgRef.current.click()}
                      style={{
                        border: '2px dashed var(--brand-line)', borderRadius: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: 'var(--brand-cream)', aspectRatio: '1',
                        gap: 6, transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-pink)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brand-line)'}
                    >
                      <ImagePlus size={22} color="var(--brand-pink)" />
                      <span style={{ fontSize: 11, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>إضافة صورة</span>
                    </div>
                  )}
                </div>

                <input type="file" accept="image/*" multiple ref={subImgRef} style={{ display: 'none' }} onChange={onSubImages} />
              </div>

              {/* ── الإعدادات ── */}
              <SectionLabel>الإعدادات</SectionLabel>

              <BrandCheckbox
                checked={form.addToHome}
                onChange={v => set('addToHome', v)}
                label="إضافة للصفحة الرئيسية"
                desc="يظهر المنتج في قسم المنتجات المميزة على الصفحة الرئيسية للمتجر"
              />

              <BrandCheckbox
                checked={form.addToBestSellers}
                onChange={v => set('addToBestSellers', v)}
                label="إضافة للأكثر مبيعاً"
                desc="يظهر المنتج ضمن قائمة الأكثر مبيعاً ويحظى بأولوية في العرض"
              />

            </div>

            {/* Footer — sticky */}
            <div style={{ padding: '16px 28px', borderTop: '2px solid var(--brand-line)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0, background: '#fff' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── small components ─── */

function SectionLabel({ children }) {
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

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '10px 14px', borderRadius: 'var(--radius-brand-sm)',
      border: '2px solid var(--brand-line)', background: '#fff', height: 46,
    }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={22}
          fill={(hover || value) >= n ? '#C8A84B' : 'transparent'}
          color={(hover || value) >= n ? '#C8A84B' : 'var(--brand-line)'}
          style={{ cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n === value ? 0 : n)}
        />
      ))}
      {value > 0 && (
        <span style={{ fontSize: 13, fontWeight: 700, color: '#C8A84B', marginRight: 4 }}>{value}.0</span>
      )}
    </div>
  )
}

function BrandCheckbox({ checked, onChange, label, desc }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '14px 16px', borderRadius: 'var(--radius-brand-sm)',
        border: `2px solid ${checked ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
        background: checked ? 'var(--brand-pink-softer)' : '#fff',
        marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
        background: checked ? 'var(--brand-pink)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-ink)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}
