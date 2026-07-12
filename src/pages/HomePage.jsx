import { useState } from 'react'
import {
  Monitor, LayoutGrid, BadgeCheck, Layers,
  Edit2, X, CheckCircle2, Link, Type, AlignLeft, Tag
} from 'lucide-react'

const SECTIONS_DEF = [
  {
    id: 'hero', active: true,
    icon: Monitor, iconBg: 'p-bg-1', iconColor: '#E0478A',
    title: 'البانر الرئيسي',
    description: 'القسم العلوي للصفحة — العنوان الرئيسي والفرعي وزرار الرابط',
    updatedAgo: 'منذ يومين',
    fields: [
      { key: 'title',    label: 'العنوان الرئيسي', type: 'text', placeholder: 'مثال: مرحباً بك في Akwab Store', icon: Type },
      { key: 'subtitle', label: 'العنوان الفرعي',   type: 'text', placeholder: 'مثال: أفضل تجربة تسوق في مصر',   icon: AlignLeft },
      { key: 'link',     label: 'الرابط (Link)',     type: 'url',  placeholder: 'https://akwab.com/shop',        icon: Link },
    ],
    data: {
      title: 'مرحباً بك في Akwab Store',
      subtitle: 'أفضل تجربة تسوق أونلاين في مصر — جودة عالية وأسعار لا تقاوم',
      link: 'https://akwab.com/shop',
    },
  },
  {
    id: 'features', active: true,
    icon: LayoutGrid, iconBg: 'p-bg-2', iconColor: '#89B8D8',
    title: 'كروت المميزات',
    description: 'أربعة كروت تعرض مميزات المتجر — عنوان ووصف لكل كارت',
    updatedAgo: 'منذ 5 أيام',
    fields: [
      { key: 'card1_title', label: 'الكارت الأول — العنوان',  type: 'text', placeholder: 'شحن سريع',       icon: Type },
      { key: 'card1_desc',  label: 'الكارت الأول — الوصف',   type: 'text', placeholder: 'توصيل 3-5 أيام', icon: AlignLeft },
      { key: 'card2_title', label: 'الكارت الثاني — العنوان', type: 'text', placeholder: 'جودة مضمونة',    icon: Type },
      { key: 'card2_desc',  label: 'الكارت الثاني — الوصف',  type: 'text', placeholder: 'منتجات أصلية',   icon: AlignLeft },
      { key: 'card3_title', label: 'الكارت الثالث — العنوان', type: 'text', placeholder: 'أسعار تنافسية',  icon: Type },
      { key: 'card3_desc',  label: 'الكارت الثالث — الوصف',  type: 'text', placeholder: 'أرخص السوق',     icon: AlignLeft },
      { key: 'card4_title', label: 'الكارت الرابع — العنوان', type: 'text', placeholder: 'دعم فوري',       icon: Type },
      { key: 'card4_desc',  label: 'الكارت الرابع — الوصف',  type: 'text', placeholder: 'خدمة 24/7',      icon: AlignLeft },
    ],
    data: {
      card1_title: 'شحن سريع',       card1_desc: 'توصيل في 3-5 أيام لأي مكان في مصر',
      card2_title: 'جودة مضمونة',    card2_desc: 'منتجات أصلية 100% مع ضمان الرضا',
      card3_title: 'أسعار تنافسية',  card3_desc: 'أفضل الأسعار مع عروض وخصومات يومية',
      card4_title: 'دعم فوري',        card4_desc: 'فريق دعم متاح 24/7 لمساعدتك',
    },
  },
  {
    id: 'badge', active: false,
    icon: BadgeCheck, iconBg: 'p-bg-3', iconColor: '#C8A84B',
    title: 'قسم البادج',
    description: 'شارة (Badge) + عنوان رئيسي وفرعي وزرار رابط',
    updatedAgo: 'منذ أسبوع',
    fields: [
      { key: 'badge',    label: 'البادج (نص الشارة)',   type: 'text', placeholder: 'عروض حصرية 🔥',             icon: Tag },
      { key: 'title',    label: 'العنوان الرئيسي',      type: 'text', placeholder: 'تسوّق أحدث المنتجات',       icon: Type },
      { key: 'subtitle', label: 'العنوان الفرعي',        type: 'text', placeholder: 'آلاف المنتجات بأفضل الأسعار', icon: AlignLeft },
      { key: 'link',     label: 'الرابط (Link)',          type: 'url',  placeholder: 'https://akwab.com/offers', icon: Link },
    ],
    data: {
      badge: 'عروض حصرية 🔥',
      title: 'تسوّق أحدث المنتجات',
      subtitle: 'اكتشف آلاف المنتجات المختارة بعناية بأفضل الأسعار',
      link: 'https://akwab.com/offers',
    },
  },
  {
    id: 'cta', active: true,
    icon: Layers, iconBg: 'p-bg-4', iconColor: '#6B4E6E',
    title: 'قسم الدعوة للتسجيل',
    description: 'عنوان + وصف + نص الزر + رابطه',
    updatedAgo: 'منذ 3 أيام',
    fields: [
      { key: 'title',      label: 'العنوان الرئيسي',  type: 'text', placeholder: 'انضم إلى مجتمع Akwab',         icon: Type },
      { key: 'subtitle',   label: 'العنوان الفرعي',    type: 'text', placeholder: 'سجّل الآن واحصل على خصم 15%', icon: AlignLeft },
      { key: 'buttonText', label: 'نص الزر',            type: 'text', placeholder: 'سجّل مجاناً',                 icon: Type },
      { key: 'link',       label: 'رابط الزر (Link)',   type: 'url',  placeholder: 'https://akwab.com/register',  icon: Link },
    ],
    data: {
      title: 'انضم إلى مجتمع Akwab',
      subtitle: 'سجّل الآن واحصل على خصم 15% على أول طلب لك',
      buttonText: 'سجّل مجاناً',
      link: 'https://akwab.com/register',
    },
  },
]

export default function HomePage() {
  const [sections, setSections]         = useState(SECTIONS_DEF)
  const [activeSection, setActiveSection] = useState(null)
  const [formData, setFormData]         = useState({})

  const openEdit = (section) => {
    setActiveSection(section)
    setFormData({ ...section.data })
  }

  const handleSave = () => {
    setSections(prev => prev.map(s =>
      s.id === activeSection.id ? { ...s, data: { ...formData }, updatedAgo: 'الآن' } : s
    ))
    setActiveSection(null)
  }

  const toggleActive = (id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>الصفحة الرئيسية</h1>
          <p>إدارة محتوى وأقسام الصفحة الرئيسية للمتجر</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--brand-ink-soft)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          {sections.filter(s => s.active).length} قسم مفعّل
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-line)', display: 'inline-block', marginRight: 6 }} />
          {sections.filter(s => !s.active).length} موقوف
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            onEdit={() => openEdit(section)}
            onToggle={() => toggleActive(section.id)}
          />
        ))}
      </div>

      {/* ══════ EDIT MODAL ══════ */}
      {activeSection && (
        <div className="modal-overlay" onClick={() => setActiveSection(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 'var(--radius-brand)',
            width: '100%', maxWidth: 600, maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)', animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 26px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div className={activeSection.iconBg} style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <activeSection.icon size={20} color={activeSection.iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 17 }}>تعديل — {activeSection.title}</h2>
                <p style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3, fontFamily: 'Cairo' }}>{activeSection.description}</p>
              </div>
              <button onClick={() => setActiveSection(null)} style={{ background: 'var(--brand-cream)', border: '1.5px solid var(--brand-line)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={17} color="var(--brand-ink-soft)" />
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '22px 26px', flex: 1 }}>
              {activeSection.fields.map((field, i) => (
                <FieldGroup key={field.key} field={field}
                  value={formData[field.key] ?? ''}
                  onChange={v => setFormData(prev => ({ ...prev, [field.key]: v }))}
                  index={i} totalFields={activeSection.fields.length} sectionId={activeSection.id}
                />
              ))}
            </div>

            <div style={{ padding: '14px 26px', borderTop: '2px solid var(--brand-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--brand-cream)', flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>
                {activeSection.fields.filter(f => (formData[f.key] ?? '').toString().trim()).length} / {activeSection.fields.length} حقول مكتملة
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setActiveSection(null)}>إلغاء</button>
                <button className="btn btn-primary" onClick={handleSave}>حفظ التعديلات</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── SectionCard ─── */
function SectionCard({ section, onEdit, onToggle }) {
  const total   = section.fields.length
  const filled  = section.fields.filter(f => (section.data[f.key] ?? '').toString().trim()).length
  const percent = Math.round((filled / total) * 100)

  return (
    <div className="card" style={{
      padding: '20px 22px', display: 'flex', flexDirection: 'column',
      opacity: section.active ? 1 : 0.65,
      transition: 'opacity 0.2s',
    }}>
      {/* Checkbox row */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 14, cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          border: `2px solid ${section.active ? 'var(--brand-pink)' : 'var(--brand-line)'}`,
          background: section.active ? 'var(--brand-pink)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {section.active && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: section.active ? 'var(--brand-pink)' : 'var(--brand-ink-soft)' }}>
          {section.active ? 'القسم مفعّل' : 'القسم موقوف'}
        </span>
        <span style={{
          marginRight: 'auto',
          background: section.active ? '#dcfce7' : 'var(--brand-cream)',
          color: section.active ? '#15803d' : 'var(--brand-ink-soft)',
          borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
        }}>
          {section.active ? 'ظاهر' : 'مخفي'}
        </span>
      </div>

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div className={section.iconBg} style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <section.icon size={20} color={section.iconColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 16, color: 'var(--brand-ink)', marginBottom: 4 }}>{section.title}</div>
          <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.6 }}>{section.description}</div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: 'var(--brand-line)', marginBottom: 14 }} />

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>{filled} / {total} حقول</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: percent === 100 ? '#15803d' : percent >= 50 ? '#C8A84B' : 'var(--error)' }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${percent}%`,
            background: percent === 100 ? 'linear-gradient(90deg,#16a34a,#15803d)' : percent >= 50 ? 'linear-gradient(90deg,#C8A84B,#a8893a)' : 'linear-gradient(90deg,#E0478A,#cc3a7a)',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>تم التحديث {section.updatedAgo}</span>
        <button onClick={onEdit} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: '#1e3a2f', color: '#fff', fontFamily: 'Cairo', fontWeight: 700, fontSize: 13, transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
          onMouseLeave={e => e.currentTarget.style.background = '#1e3a2f'}
        >
          <Edit2 size={14} /> تعديل
        </button>
      </div>
    </div>
  )
}

/* ─── FieldGroup ─── */
function FieldGroup({ field, value, onChange, sectionId, index, totalFields }) {
  const isFeatures      = sectionId === 'features'
  const showSeparator   = isFeatures && index % 2 === 0
  const cardLabels      = ['الأول', 'الثاني', 'الثالث', 'الرابع']
  const cardNum         = isFeatures ? Math.floor(index / 2) + 1 : null

  return (
    <>
      {showSeparator && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: index === 0 ? 0 : 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-pink-softer)', color: 'var(--brand-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{cardNum}</div>
          <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 14 }}>الكارت {cardLabels[cardNum - 1]}</div>
          <div style={{ flex: 1, height: '1.5px', background: 'var(--brand-line)' }} />
        </div>
      )}
      <div className="form-group" style={{ marginBottom: index === totalFields - 1 ? 0 : 16 }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <field.icon size={13} color="var(--brand-pink)" /> {field.label}
        </label>
        <input className="form-control"
          type={field.type === 'url' ? 'text' : field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={field.type === 'url' ? { direction: 'ltr', textAlign: 'left' } : {}}
        />
        {value.trim() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <CheckCircle2 size={12} color="#15803d" />
            <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>تم الملء</span>
          </div>
        )}
      </div>
    </>
  )
}
