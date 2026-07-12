import { useState, useRef } from 'react'
import { Upload, X, ImagePlus, Save, CheckCircle2 } from 'lucide-react'

/* ─── Egyptian Governorates ─── */
const GOVERNORATES = [
  'اختر المحافظة',
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية',
  'الغربية','المنوفية','القليوبية','الفيوم','بني سويف',
  'المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان',
  'البحيرة','كفر الشيخ','دمياط','بورسعيد','الإسماعيلية',
  'السويس','شمال سيناء','جنوب سيناء','مطروح','الوادي الجديد','البحر الأحمر',
]

/* ─── read file as dataURL ─── */
const readFile = (file) => new Promise(res => {
  const r = new FileReader()
  r.onload = e => res(e.target.result)
  r.readAsDataURL(file)
})

/* ─── initial state ─── */
const INIT_CARD1 = {
  title: '', subtitle: '', paragraph: '',
  images: [], link1: '', link2: '',
}
const INIT_CARD2 = {
  title: '', paragraph: '',
  name: '', phone: '', governorate: 'اختر المحافظة',
  quantity: '', notes: '',
}

/* ══════════════════════════════════════════════════════════ */
export default function FormPage() {
  const [card1, setCard1] = useState(INIT_CARD1)
  const [card2, setCard2] = useState(INIT_CARD2)
  const [saved, setSaved] = useState(false)

  const imgRef = useRef()

  const set1 = (k, v) => setCard1(p => ({ ...p, [k]: v }))
  const set2 = (k, v) => setCard2(p => ({ ...p, [k]: v }))

  /* image upload */
  const onImages = async (e) => {
    const files = Array.from(e.target.files)
    const urls  = await Promise.all(files.map(readFile))
    set1('images', [...card1.images, ...urls].slice(0, 6))
  }
  const removeImg = (i) => set1('images', card1.images.filter((_, idx) => idx !== i))

  /* save both cards at once */
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  /* field counts */
  const filled1 = [card1.title, card1.subtitle, card1.paragraph, card1.images.length ? '✓' : '', card1.link1, card1.link2].filter(v => String(v).trim()).length
  const total1  = 6
  const filled2 = [card2.title, card2.paragraph, card2.name, card2.phone, card2.governorate !== 'اختر المحافظة' ? '✓' : '', card2.quantity, card2.notes].filter(v => String(v).trim()).length
  const total2  = 7

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>النموذج</h1>
          <p>إدارة محتوى صفحة النموذج وإعداداته</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ══════════ CARD 1 ══════════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Card header */}
          <div className="p-bg-1" style={{ padding: '18px 22px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 17, color: 'var(--brand-ink)' }}>
                محتوى القسم
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>
                {filled1} / {total1} حقول مكتملة
              </div>
            </div>
            <ProgressRing value={filled1} total={total1} color="#E0478A" />
          </div>

          {/* Card body */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            <Field label="العنوان الرئيسي" required>
              <input className="form-control" placeholder="مثال: تواصل معنا" value={card1.title} onChange={e => set1('title', e.target.value)} />
            </Field>

            <Field label="العنوان الفرعي">
              <input className="form-control" placeholder="مثال: نحن هنا دائماً للمساعدة" value={card1.subtitle} onChange={e => set1('subtitle', e.target.value)} />
            </Field>

            <Field label="البراجراف">
              <textarea className="form-control" rows={4} placeholder="اكتب النص التفصيلي هنا..." value={card1.paragraph} onChange={e => set1('paragraph', e.target.value)} />
            </Field>

            {/* Images upload */}
            <Field label={`الصور (${card1.images.length}/6)`}>
              <input type="file" accept="image/*" multiple ref={imgRef} style={{ display: 'none' }} onChange={onImages} />

              {/* Thumbnails grid */}
              {card1.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
                  {card1.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid var(--brand-line)', aspectRatio: '1' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removeImg(i)} style={{
                        position: 'absolute', top: 4, left: 4,
                        background: 'rgba(61,37,64,.75)', border: 'none', borderRadius: 6,
                        width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      }}>
                        <X size={11} color="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {card1.images.length < 6 && (
                <div onClick={() => imgRef.current.click()} style={{
                  border: '2px dashed var(--brand-line)', borderRadius: 12,
                  padding: '16px', cursor: 'pointer', background: 'var(--brand-cream)',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-pink)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brand-line)'}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-pink-softer)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImagePlus size={18} color="var(--brand-pink)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--brand-ink)' }}>اضغط لرفع الصور</div>
                    <div style={{ fontSize: 11, color: 'var(--brand-ink-soft)', marginTop: 2 }}>PNG, JPG, WEBP — متعدد</div>
                  </div>
                </div>
              )}
            </Field>

            <Field label="الرابط الأول (Link 1)">
              <input className="form-control" placeholder="https://akwab.com/page" value={card1.link1} onChange={e => set1('link1', e.target.value)} style={{ direction: 'ltr', textAlign: 'left' }} />
            </Field>

            <Field label="الرابط الثاني (Link 2)">
              <input className="form-control" placeholder="https://akwab.com/other" value={card1.link2} onChange={e => set1('link2', e.target.value)} style={{ direction: 'ltr', textAlign: 'left' }} />
            </Field>
          </div>
        </div>

        {/* ══════════ CARD 2 ══════════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Card header */}
          <div className="p-bg-2" style={{ padding: '18px 22px', borderBottom: '2px solid var(--brand-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: 17, color: 'var(--brand-ink)' }}>
                بيانات النموذج
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', marginTop: 3 }}>
                {filled2} / {total2} حقول مكتملة
              </div>
            </div>
            <ProgressRing value={filled2} total={total2} color="#89B8D8" />
          </div>

          {/* Card body */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            <Field label="العنوان الرئيسي" required>
              <input className="form-control" placeholder="مثال: نموذج الطلب" value={card2.title} onChange={e => set2('title', e.target.value)} />
            </Field>

            <Field label="البراجراف">
              <textarea className="form-control" rows={3} placeholder="مثال: أكمل بياناتك وسيتواصل معك فريقنا في أقرب وقت..." value={card2.paragraph} onChange={e => set2('paragraph', e.target.value)} />
            </Field>

            <div style={{ height: '1.5px', background: 'var(--brand-line)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-ink-soft)', textTransform: 'uppercase', letterSpacing: 1 }}>
              حقول النموذج
            </div>

            <Field label="الاسم">
              <input className="form-control" placeholder="الاسم الكامل" value={card2.name} onChange={e => set2('name', e.target.value)} />
            </Field>

            <Field label="رقم الهاتف">
              <input className="form-control" type="tel" placeholder="01xxxxxxxxx" value={card2.phone} onChange={e => set2('phone', e.target.value)} />
            </Field>

            <Field label="المحافظة">
              <select className="form-control" value={card2.governorate} onChange={e => set2('governorate', e.target.value)}>
                {GOVERNORATES.map(g => (
                  <option key={g} value={g} disabled={g === 'اختر المحافظة'}>{g}</option>
                ))}
              </select>
            </Field>

            <Field label="الكمية">
              <input className="form-control" type="number" min="1" placeholder="0" value={card2.quantity} onChange={e => set2('quantity', e.target.value)} />
            </Field>

            <Field label="ملاحظات">
              <textarea className="form-control" rows={3} placeholder="أي ملاحظات أو تفاصيل إضافية..." value={card2.notes} onChange={e => set2('notes', e.target.value)} />
            </Field>
          </div>
        </div>

      </div>

      {/* ══════ زرار الحفظ الموحّد ══════ */}
      <div style={{
        marginTop: 24,
        background: '#fff',
        border: '2px solid var(--brand-line)',
        borderRadius: 'var(--radius-brand)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* progress summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: filled1 === total1 ? '#16a34a' : 'var(--brand-pink)',
            }} />
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>
              محتوى القسم:&nbsp;
              <span style={{ color: filled1 === total1 ? '#15803d' : 'var(--brand-pink)', fontWeight: 800 }}>
                {filled1}/{total1}
              </span>
            </span>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--brand-line)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: filled2 === total2 ? '#16a34a' : '#89B8D8',
            }} />
            <span style={{ fontSize: 13, color: 'var(--brand-ink-soft)', fontWeight: 600 }}>
              بيانات النموذج:&nbsp;
              <span style={{ color: filled2 === total2 ? '#15803d' : '#89B8D8', fontWeight: 800 }}>
                {filled2}/{total2}
              </span>
            </span>
          </div>
        </div>

        {/* save button */}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          style={{ minWidth: 140, justifyContent: 'center', fontSize: 15 }}
        >
          {saved
            ? <><CheckCircle2 size={16} /> تم الحفظ بنجاح</>
            : <><Save size={16} /> حفظ الكل</>
          }
        </button>
      </div>
    </div>
  )
}

/* ─── Field wrapper ─── */
function Field({ label, required, children }) {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        {label}
        {required && <span style={{ color: 'var(--brand-pink)', fontWeight: 800 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

/* ─── Progress Ring (SVG) ─── */
function ProgressRing({ value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const r   = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
      <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={4} />
        <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: color,
      }}>{pct}%</div>
    </div>
  )
}
