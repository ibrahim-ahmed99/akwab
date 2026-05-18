import { Link, useLocation } from 'react-router-dom';
import { toArabicDigits } from '../../utils/arabic.js';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const orderNum = state?.orderNum;

  return (
    <section className="py-24">
      <div className="akwab-container max-w-2xl text-center">

        {/* Success circle */}
        <div className="w-24 h-24 rounded-full bg-brand-pink-softer flex items-center justify-center mx-auto mb-6"
          style={{ boxShadow: '0 0 0 12px #fce8f0' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#E0478A" strokeWidth="2.5" strokeLinecap="round" className="w-11 h-11">
            <path d="m5 12 5 5 9-11" />
          </svg>
        </div>

        <h1 className="text-4xl mb-3">تم استلام طلبك!</h1>
        <p className="text-brand-ink-soft text-lg mb-6">شكراً لتسوّقك معنا في أكواب</p>

        {orderNum && (
          <div className="inline-flex items-center gap-3 bg-white rounded-brand px-6 py-3 shadow-brand-sm mb-8">
            <span className="text-brand-ink-soft text-sm">رقم الطلب</span>
            <span className="font-amiri text-2xl text-brand-pink font-bold">
              #{toArabicDigits(orderNum)}
            </span>
          </div>
        )}

        {/* Steps */}
        <div className="bg-white rounded-brand p-6 shadow-brand-sm mb-8 text-right">
          <h3 className="text-lg mb-5 text-center font-amiri">ماذا يحدث بعد ذلك؟</h3>
          <div className="space-y-4">
            <Step num="١" text="سيتواصل معكِ فريقنا خلال ٢٤ ساعة لتأكيد الطلب." />
            <Step num="٢" text="يتم تجهيز طلبك بعناية وتغليفه في علبة هدية مميزة." />
            <Step num="٣" text="يصل طلبك خلال ٣–٥ أيام عمل لكل محافظات مصر." />
          </div>
        </div>

        {/* Info card */}
        <div className="bg-brand-cream-2 rounded-brand p-5 mb-8 text-sm text-brand-ink-soft flex items-start gap-3 text-right">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C8A84B" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <span>في حال الدفع الإلكتروني، يُرجى إرسال إيصال التحويل على واتساب لإتمام الطلب.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn btn-primary justify-center">تسوّقي مجدداً</Link>
          <Link to="/" className="btn btn-outline justify-center">الرئيسية</Link>
        </div>
      </div>
    </section>
  );
}

function Step({ num, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink font-bold text-sm flex items-center justify-center shrink-0 font-cairo">
        {num}
      </div>
      <p className="text-brand-ink-soft text-sm pt-1.5">{text}</p>
    </div>
  );
}
