import { useState } from 'react'
import { Save, Globe, Phone, Mail, MapPin, Users, Target, Eye, Star } from 'lucide-react'

const teamMembers = [
  { name: 'محمد أحمد',  role: 'المؤسس والرئيس التنفيذي', emoji: '👨‍💼', bio: 'خبرة أكثر من 15 عاماً في التجارة الإلكترونية',            gradient: 'linear-gradient(135deg,#E0478A,#C8A84B)' },
  { name: 'سارة علي',   role: 'مدير المبيعات',           emoji: '👩‍💼', bio: 'متخصصة في تطوير استراتيجيات المبيعات وخدمة العملاء',        gradient: 'linear-gradient(135deg,#89B8D8,#3D2540)' },
  { name: 'أحمد حسن',  role: 'مدير التقنية',            emoji: '👨‍💻', bio: 'مهندس برمجيات بخبرة 10 سنوات في تطوير التطبيقات',          gradient: 'linear-gradient(135deg,#C8A84B,#E0478A)' },
  { name: 'فاطمة محمود',role: 'مدير التسويق',           emoji: '👩‍🎨', bio: 'خبيرة تسويق رقمي ومحتوى إبداعي ومتخصصة في بناء العلامات', gradient: 'linear-gradient(135deg,#6B4E6E,#89B8D8)' },
]

const brandValues = [
  { icon: '🤝', title: 'الثقة والشفافية',  desc: 'نؤمن بأن الثقة هي أساس أي علاقة تجارية ناجحة', bg: 'p-bg-1' },
  { icon: '🚀', title: 'الابتكار المستمر', desc: 'نسعى دائماً لتقديم أفضل التجارب وأحدث الحلول',  bg: 'p-bg-2' },
  { icon: '💎', title: 'الجودة أولاً',     desc: 'لا نتنازل عن الجودة تحت أي ظرف من الظروف',     bg: 'p-bg-3' },
  { icon: '❤️', title: 'العميل في القلب',  desc: 'رضا عملائنا هو هدفنا الأول وأولويتنا الدائمة', bg: 'p-bg-4' },
]

const highlights = [
  { value: '5,820+', label: 'عميل راضٍ', icon: '😊', bg: 'p-bg-1', color: '#E0478A' },
  { value: '284',    label: 'منتج متاح', icon: '📦', bg: 'p-bg-2', color: '#89B8D8' },
  { value: '8',      label: 'قسم',       icon: '🗂️', bg: 'p-bg-3', color: '#C8A84B' },
  { value: '3+',     label: 'سنة خبرة', icon: '⭐', bg: 'p-bg-4', color: '#6B4E6E' },
]

export default function About() {
  const [editMode, setEditMode] = useState(false)
  const [info, setInfo] = useState({
    companyName: 'Akwab Store',
    tagline: 'وجهتك الأولى للتسوق الذكي',
    description: 'أكواب هي منصة تجارة إلكترونية متكاملة تأسست عام 2023، نهدف إلى تقديم تجربة تسوق فريدة وموثوقة للعملاء في جميع أنحاء مصر. نوفر مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية مع خدمة توصيل سريعة وآمنة.',
    vision: 'أن نكون المنصة التجارية الرقمية الأولى في مصر والشرق الأوسط بحلول عام 2030.',
    mission: 'توفير تجربة تسوق استثنائية تجمع بين الجودة والسعر المناسب وخدمة العملاء المتميزة.',
    website: 'www.akwab.com',
    email: 'info@akwab.com',
    phone: '+20 100 123 4567',
    address: 'القاهرة، شارع التحرير، المبنى 12، الطابق 3',
    founded: '2023',
    employees: '45+',
  })

  const Field = ({ label, k, type = 'input' }) => (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ fontSize: 12 }}>{label}</label>
      {type === 'textarea'
        ? <textarea className="form-control" rows={3} style={{ fontSize: 14 }} value={info[k]} onChange={e => setInfo({ ...info, [k]: e.target.value })} />
        : <input className="form-control" style={{ fontSize: 14 }} value={info[k]} onChange={e => setInfo({ ...info, [k]: e.target.value })} />
      }
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>من نحن</h1>
          <p>هوية الشركة ومعلوماتها التفصيلية</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`btn ${editMode ? 'btn-gold' : 'btn-outline'}`}
        >
          {editMode ? <><Save size={15} /> حفظ التغييرات</> : '✏️ تعديل المعلومات'}
        </button>
      </div>

      {/* Hero banner */}
      <div style={{
        background: `linear-gradient(135deg, #3D2540 0%, #6B4E6E 60%, #3D2540 100%)`,
        borderRadius: 'var(--radius-brand)',
        padding: '32px 36px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24,
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(224,71,138,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 100, width: 150, height: 150, borderRadius: '50%', background: 'rgba(200,168,75,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(137,184,216,0.10)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 22, flexShrink: 0,
          background: 'linear-gradient(135deg, #E0478A 0%, #C8A84B 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 40, color: '#fff',
          boxShadow: '0 8px 24px rgba(224,71,138,0.5)',
          position: 'relative', zIndex: 1,
        }}>A</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Amiri, serif', fontSize: 28, fontWeight: 700, color: '#FEFCF0' }}>
            {info.companyName}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(254,252,240,0.65)', marginTop: 5 }}>{info.tagline}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
            <Chip icon="🌐" text={info.website} />
            <Chip icon="📅" text={`تأسست ${info.founded}`} />
            <Chip icon="👥" text={`${info.employees} موظف`} />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {highlights.map(h => (
          <div key={h.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{h.icon}</div>
            <div style={{ fontFamily: 'Amiri, serif', fontSize: 24, fontWeight: 700, color: h.color }}>{h.value}</div>
            <div style={{ fontSize: 13, color: 'var(--brand-ink-soft)', marginTop: 4 }}>{h.label}</div>
          </div>
        ))}
      </div>

      {/* About + Contact info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* About text */}
        <div className="card">
          <div className="card-title">عن Akwab</div>
          {editMode
            ? <Field label="وصف الشركة" k="description" type="textarea" />
            : <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.9 }}>{info.description}</p>
          }

          <div className="divider" />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div className="p-bg-1" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Eye size={16} color="var(--brand-pink)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>رؤيتنا</div>
              {editMode
                ? <Field label="" k="vision" type="textarea" />
                : <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', lineHeight: 1.8 }}>{info.vision}</p>
              }
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="p-bg-2" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={16} color="var(--brand-blue)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>مهمتنا</div>
              {editMode
                ? <Field label="" k="mission" type="textarea" />
                : <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', lineHeight: 1.8 }}>{info.mission}</p>
              }
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="card">
          <div className="card-title">معلومات التواصل</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { icon: <Globe size={17} />,  label: 'الموقع',          k: 'website',   bg: 'p-bg-1', color: '#E0478A' },
              { icon: <Mail size={17} />,   label: 'البريد',          k: 'email',     bg: 'p-bg-2', color: '#89B8D8' },
              { icon: <Phone size={17} />,  label: 'الهاتف',          k: 'phone',     bg: 'p-bg-3', color: '#C8A84B' },
              { icon: <MapPin size={17} />, label: 'العنوان',         k: 'address',   bg: 'p-bg-4', color: '#6B4E6E' },
              { icon: <Users size={17} />,  label: 'عدد الموظفين',   k: 'employees', bg: 'p-bg-1', color: '#E0478A' },
            ].map(f => (
              <div key={f.k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={f.bg} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginBottom: 2 }}>{f.label}</div>
                  {editMode
                    ? <input className="form-control" style={{ padding: '7px 12px', fontSize: 13 }} value={info[f.k]} onChange={e => setInfo({ ...info, [f.k]: e.target.value })} />
                    : <div style={{ fontSize: 14, fontWeight: 700 }}>{info[f.k]}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">قيمنا</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {brandValues.map(v => (
            <div key={v.title} className={v.bg} style={{ borderRadius: 'var(--radius-brand-sm)', padding: '22px 18px', textAlign: 'center', border: '1.5px solid var(--brand-line)' }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{v.icon}</div>
              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 15, color: 'var(--brand-ink)', marginBottom: 6 }}>{v.title}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.7 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="card">
        <div className="card-title">فريق العمل</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {teamMembers.map(m => (
            <div key={m.name} style={{
              textAlign: 'center', padding: '24px 16px',
              border: '2px solid var(--brand-line)',
              borderRadius: 'var(--radius-brand)',
              background: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Avatar */}
              <div style={{
                width: 70, height: 70, borderRadius: '50%', margin: '0 auto 14px',
                background: m.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, boxShadow: 'var(--shadow-md)',
              }}>{m.emoji}</div>

              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 16, color: 'var(--brand-ink)' }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-pink)', fontWeight: 700, margin: '5px 0 8px' }}>{m.role}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.6 }}>{m.bio}</div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 12 }}>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} fill="var(--brand-gold)" color="var(--brand-gold)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(254,252,240,0.12)', borderRadius: 20,
      padding: '5px 14px', fontSize: 12, color: 'rgba(254,252,240,0.75)', fontWeight: 600,
      border: '1px solid rgba(254,252,240,0.15)',
    }}>
      <span>{icon}</span> {text}
    </div>
  )
}
