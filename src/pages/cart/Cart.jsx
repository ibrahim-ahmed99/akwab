import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { toArabicDigits } from '../../utils/arabic.js';

/* ── أكواد الخصم — عدّل هنا لإضافة أو تغيير كود ── */
const COUPONS = {
  'AKWAB10':  { type: 'percent', value: 10, label: 'خصم ١٠٪'      },
  'AKWAB20':  { type: 'percent', value: 20, label: 'خصم ٢٠٪'      },
  'WELCOME':  { type: 'fixed',   value: 50, label: 'خصم ٥٠ ج.م'   },
  'VIP':      { type: 'percent', value: 30, label: 'خصم ٣٠٪'      },
};

export default function Cart() {
  const { items, remove, setQty, clear, count } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput]   = useState('');
  const [coupon,      setCoupon]        = useState(null);
  const [couponError, setCouponError]   = useState('');

  const subtotal = items.reduce((sum, i) => sum + parseArabicPrice(i.price) * i.qty, 0);

  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round(subtotal * coupon.value / 100)
      : Math.min(coupon.value, subtotal)
    : 0;

  const total = subtotal - discount;

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) {
      setCouponError('كود الخصم غير صحيح، حاولي مرة تانية');
      return;
    }
    setCoupon({ code, ...found });
    setCouponError('');
    setCouponInput('');
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponError('');
    setCouponInput('');
  }

  if (items.length === 0) {
    return (
      <div className="akwab-container py-24 text-center">
        <h1 className="text-4xl mb-4">سلتك فارغة</h1>
        <p className="text-brand-ink-soft mb-8">اكتشفي تشكيلاتنا واختاري قطعتك المفضلة.</p>
        <Link to="/shop" className="btn btn-primary">ابدئي التسوّق</Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="akwab-container max-w-4xl">
        <h1 className="text-4xl mb-2">سلة التسوّق</h1>
        <p className="text-brand-ink-soft mb-8">{toArabicDigits(count)} منتج في سلتك</p>

        {/* قائمة المنتجات */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-brand p-4 flex gap-4 items-center shadow-brand-sm">
              <div className="w-24 h-24 rounded-brand-sm overflow-hidden p-bg-1 shrink-0">
                {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg mb-1 truncate">{item.name}</h3>
                <div className="text-brand-pink font-bold">{item.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.id, item.qty - 1)}
                  className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                >−</button>
                <span className="w-8 text-center font-semibold">{toArabicDigits(item.qty)}</span>
                <button
                  onClick={() => setQty(item.id, item.qty + 1)}
                  className="w-8 h-8 rounded-full bg-brand-pink-softer text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                >+</button>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="text-brand-ink-soft hover:text-[#D64545] px-3"
                aria-label="حذف"
              >✕</button>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div className="bg-white rounded-brand p-6 mt-8 shadow-brand-sm">

          {/* حقل كود الخصم */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-brand-ink mb-2">كود الخصم</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && !coupon && applyCoupon()}
                placeholder="أدخلي الكود هنا"
                disabled={!!coupon}
                className="flex-1 px-4 py-2.5 rounded-[12px] border border-brand-line text-sm bg-brand-cream outline-none focus:border-brand-pink focus:bg-white focus:shadow-[0_0_0_3px_rgba(224,71,138,.1)] transition-all disabled:opacity-60"
              />
              {coupon ? (
                <button
                  onClick={removeCoupon}
                  className="px-4 py-2.5 rounded-[12px] border border-brand-line text-sm text-brand-ink-soft hover:border-[#D64545] hover:text-[#D64545] transition-colors"
                >
                  إزالة
                </button>
              ) : (
                <button
                  onClick={applyCoupon}
                  className="px-5 py-2.5 rounded-[12px] bg-brand-pink text-white text-sm font-semibold hover:bg-[#c93a7a] transition-colors"
                >
                  تطبيق
                </button>
              )}
            </div>

            {couponError && (
              <p className="text-[#D64545] text-xs mt-2 flex items-center gap-1">
                <span>✕</span> {couponError}
              </p>
            )}
            {coupon && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                <span>✓</span> تم تطبيق كود <span className="font-bold">{coupon.code}</span> — {coupon.label}
              </p>
            )}
          </div>

          <div className="border-t border-brand-line pt-5">
            {/* المجموع الفرعي */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-brand-ink-soft">المجموع الفرعي</span>
              <span className="font-bold">{toArabicDigits(subtotal)} ج.م</span>
            </div>

            {/* الخصم */}
            {coupon && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>{coupon.label}</span>
                <span className="font-bold">− {toArabicDigits(discount)} ج.م</span>
              </div>
            )}

            {/* الشحن */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-ink-soft">الشحن</span>
              <span className="text-brand-ink-soft">يُحسب عند الدفع</span>
            </div>

            {/* الإجمالي */}
            <div className="flex justify-between items-center pt-4 border-t border-brand-line mb-6">
              <span className="font-amiri text-xl">الإجمالي</span>
              <span className="font-amiri text-2xl text-brand-pink font-bold">{toArabicDigits(total)} ج.م</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/checkout')} className="btn btn-primary flex-1 justify-center">إتمام الطلب</button>
              <button onClick={clear} className="btn btn-outline">إفراغ السلة</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function parseArabicPrice(s) {
  if (!s) return 0;
  const map = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };
  const digits = String(s).split('').map((c) => (c in map ? map[c] : /\d/.test(c) ? c : '')).join('');
  return parseInt(digits, 10) || 0;
}
