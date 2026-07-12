import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Tag, X } from 'lucide-react'

const BG_CLASSES = ['p-bg-1', 'p-bg-2', 'p-bg-3', 'p-bg-4']

const initialCategories = [
  { id: 1, name: 'إلكترونيات',  description: 'أجهزة إلكترونية وكمبيوترات',      products: 84,  icon: '💻', status: 'نشط' },
  { id: 2, name: 'ملابس',       description: 'ملابس رجالية ونسائية وأطفال',      products: 62,  icon: '👕', status: 'نشط' },
  { id: 3, name: 'أثاث',        description: 'أثاث منزلي ومكتبي فاخر',          products: 45,  icon: '🛋️', status: 'نشط' },
  { id: 4, name: 'رياضة',       description: 'معدات وملابس رياضية متنوعة',       products: 38,  icon: '⚽', status: 'نشط' },
  { id: 5, name: 'كتب',         description: 'كتب تعليمية وثقافية وروايات',      products: 120, icon: '📚', status: 'نشط' },
  { id: 6, name: 'مطبخ',        description: 'أدوات ومستلزمات المطبخ',           products: 55,  icon: '🍳', status: 'متوقف' },
  { id: 7, name: 'صحة وجمال',   description: 'مستحضرات تجميل وعناية بالبشرة',   products: 90,  icon: '💄', status: 'نشط' },
  { id: 8, name: 'ألعاب',       description: 'ألعاب أطفال وتسلية عائلية',        products: 33,  icon: '🎮', status: 'متوقف' },
]

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '📦', status: 'نشط' })

  const filtered = categories.filter(c =>
    c.name.includes(search) || c.description.includes(search)
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', description: '', icon: '📦', status: 'نشط' })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, description: cat.description, icon: cat.icon, status: cat.status })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing ? { ...c, ...form } : c))
    } else {
      setCategories(prev => [...prev, { id: Date.now(), ...form, products: 0 }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟'))
      setCategories(prev => prev.filter(c => c.id !== id))
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
        <MiniStat label="إجمالي الأقسام"      value={categories.length}                               color="#E0478A" bg="p-bg-1" />
        <MiniStat label="الأقسام النشطة"      value={categories.filter(c => c.status === 'نشط').length}  color="#C8A84B" bg="p-bg-3" />
        <MiniStat label="إجمالي المنتجات"     value={categories.reduce((s, c) => s + c.products, 0)}   color="#89B8D8" bg="p-bg-2" />
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-bar">
            <Search size={15} color="var(--brand-ink-soft)" />
            <input placeholder="ابحث عن قسم..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)' }}>
            {filtered.length} قسم
          </span>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16 }}>
          {filtered.map((cat, i) => (
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
              {/* Colored top strip */}
              <div className={BG_CLASSES[i % 4]} style={{ padding: '20px 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 40 }}>{cat.icon}</span>
                <span className={`badge ${cat.status === 'نشط' ? 'badge-success' : 'badge-gray'}`}>
                  {cat.status}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 18px' }}>
                <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 16, color: 'var(--brand-ink)' }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 4, lineHeight: 1.6 }}>{cat.description}</div>

                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1.5px solid var(--brand-line)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--brand-pink)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={13} /> {cat.products} منتج
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(cat)} style={{
                      background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)',
                      borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      <Edit2 size={13} color="var(--brand-ink-soft)" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} style={{
                      background: 'var(--error-soft)', border: 'none',
                      borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      <Trash2 size={13} color="var(--error)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--brand-ink-soft)" />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">اسم القسم *</label>
              <input className="form-control" placeholder="مثال: إلكترونيات" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">الوصف</label>
              <textarea className="form-control" rows={3} placeholder="وصف مختصر للقسم" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">الأيقونة (Emoji)</label>
                <input className="form-control" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={{ fontSize: 22 }} />
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>نشط</option>
                  <option>متوقف</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? 'حفظ التعديلات' : 'إضافة القسم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color, bg }) {
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className={bg} style={{
        width: 48, height: 48, borderRadius: 'var(--radius-brand-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 20, color,
      }}>{value}</div>
      <span style={{ fontSize: 14, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{label}</span>
    </div>
  )
}
