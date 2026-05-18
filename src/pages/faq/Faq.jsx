import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHead } from '../../components/SectionHead.jsx';

const CATEGORIES = [
  {
    id: 'shipping',
    label: 'الشحن والتوصيل',
    icon: '🚚',
    items: [
      {
        q: 'كم يستغرق وصول الطلب؟',
        a: 'يصل طلبك خلال ٣–٥ أيام عمل لجميع محافظات مصر..',
      },
      {
        q: 'كم تبلغ تكلفة الشحن؟',
        a: 'رسوم الشحن  تختلف حسب المحافظات. الشحن مجاني للطلبات التي تتجاوز 1500 ج.م وفي حالة الغاء الطلب بعد شحنه يتحمل العميل تكلفة الشحن.',
      },
      {
        q: 'هل تشحنون لكل محافظات مصر؟',
        a: 'نعم! نصل لجميع المحافظات الـ٢٧ عبر شركات الشحن الموثوقة.',
      },
      {
        q: 'كيف أتابع شحنتي؟',
        a: 'بعد شحن طلبك ستصلك رسالة واتساب برقم التتبع ورابط تتبع الشحنة مباشرةً.',
      },
    ],
  },
  {
    id: 'payment',
    label: 'الدفع',
    icon: '💳',
    items: [
      {
        q: 'ما هي طرق الدفع المتاحة؟',
        a: 'نقبل الدفع عند الاستلام (كاش)، InstaPay، وVodafone Cash.',
      },
      {
        q: 'هل الدفع آمن؟',
        a: 'بالتأكيد. معلوماتك محمية تماماً ولا نحتفظ بأي بيانات مالية.',
      },
      {
        q: 'متى يُخصم المبلغ عند الدفع الإلكتروني؟',
        a: 'يُطلب منك إرسال إيصال التحويل على واتساب لتأكيد الطلب، ويُشحن الطلب بعد التأكيد خلال ٢٤ ساعة.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'الإرجاع والاستبدال',
    icon: '🔄',
    items: [
      {
        q: 'ما هي سياسة الإرجاع؟',
        a: 'نقبل الإرجاع خلال 24 ساعه  من استلام الطلب إذا كان المنتج معيباً أو مختلفاً عما طلبتِ.',
      },
      {
        q: 'كيف أبدأ طلب إرجاع؟',
        a: 'تواصلي معنا على واتساب بصورة المنتج ورقم الطلب، وسنرتب الاستبدال أو الاسترداد في أقرب وقت.',
      },
      {
        q: 'هل يمكن إرجاع المنتجات المخصصة؟',
        a: 'للأسف المنتجات ذات التصميم المخصص (بالاسم أو الخط الشخصي) لا تُقبل للإرجاع إلا في حالة وجود عيب مصنعي.',
      },
    ],
  },
  {
    id: 'custom',
    label: 'الطلبات المخصصة',
    icon: '✍️',
    items: [
      {
        q: 'هل يمكنني طلب تصميم بنفسي؟',
        a: 'بالتأكيد! تواصلي معنا على واتساب بفكرتك وسنرسل لك عرض السعر والمدة الزمنية.',
      },
      {
        q: 'كم يستغرق تنفيذ الطلب المخصص؟',
        a: 'عادةً 5–7 يوم عمل حسب التصميم والكمية. نُبلّغك بالموعد الدقيق بعد تأكيد الطلب.',
      },
      {
        q: 'هل تقبلون طلبات الشركات والفعاليات؟',
        a: 'نعم! لدينا أسعار خاصة بالكميات وهدايا الشركات. تواصلي معنا للتفاصيل.',
      },
    ],
  },
  {
    id: 'product',
    label: 'المنتجات',
    icon: '🏺',
    items: [
      {
        q: 'هل المنتجات آمنة للاستخدام مع الميكروويف؟',
        a: 'جميع منتجات الخزف والبورسلين آمنة للميكروويف وغسالة الأطباق. منتجات الزجاج آمنة للميكروويف فقط.',
      },
      {
        q: 'كيف أعتني بالكوب للحفاظ عليه؟',
        a: 'يُنصح بغسله باليد بماء فاتر وصابون خفيف. تجنّبي الصدمات الحرارية (من الحار للبارد مباشرةً).',
      },
      {
        q: 'هل الألوان كما في الصور تماماً؟',
        a: 'نحرص على دقة الألوان قدر الإمكان، لكن قد تختلف قليلاً بسبب اختلاف شاشات الأجهزة وطبيعة الصناعة اليدوية التي تجعل كل قطعة فريدة.',
      },
    ],
  },
];

export default function Faq() {
  const [activeCat, setActiveCat] = useState('shipping');
  const [openIdx, setOpenIdx] = useState(null);

  const current = CATEGORIES.find(c => c.id === activeCat);

  const toggle = (i) => setOpenIdx(prev => (prev === i ? null : i));

  return (
    <>
      {/* Header */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 60%,#d8e8f3 100%)' }}
      >
        <span className="absolute top-8 left-20 text-4xl opacity-20 select-none">✿</span>
        <span className="absolute bottom-6 right-16 text-3xl opacity-20 select-none">🌸</span>
        <div className="akwab-container relative z-10">
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">
            مركز المساعدة
          </p>
          <h1 className="text-[clamp(32px,4.5vw,56px)] mb-4">الأسئلة الشائعة</h1>
          <p className="text-brand-ink-soft text-[17px] max-w-xl mx-auto">
            كل ما تحتاجين معرفته في مكان واحد. لم تجدي إجابتك؟ راسلينا مباشرةً.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="akwab-container max-w-4xl">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(cat.id); setOpenIdx(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat.id
                    ? 'bg-brand-pink text-white shadow-brand-md'
                    : 'bg-white text-brand-ink border border-brand-line hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink-softer'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {current?.items.map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-brand shadow-brand-sm overflow-hidden transition-all ${
                  openIdx === i ? 'shadow-brand-md' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="font-semibold text-base">{item.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    openIdx === i
                      ? 'bg-brand-pink text-white rotate-45'
                      : 'bg-brand-cream text-brand-ink-soft'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-60' : 'max-h-0'}`}>
                  <p className="px-5 pb-5 text-brand-ink-soft text-sm leading-relaxed border-t border-brand-line pt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div
            className="mt-14 rounded-brand p-8 text-center"
            style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 100%)' }}
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl mb-3 font-amiri">لم تجدي إجابتك؟</h3>
            <p className="text-brand-ink-soft text-sm mb-6 max-w-sm mx-auto">
              فريقنا جاهز للمساعدة — راسلينا على واتساب أو أرسلي لنا رسالة.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/201013958495"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whats justify-center"
              >
                واتساب
              </a>
              <Link to="/contact" className="btn btn-outline justify-center">
                راسلينا
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
