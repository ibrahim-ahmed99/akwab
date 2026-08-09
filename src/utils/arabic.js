const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const toArabicDigits = (n) =>
  String(n)
    .padStart(2, '0')
    .split('')
    .map((d) => ARABIC_DIGITS[+d] ?? d)
    .join('');

/** Digits only — no zero padding. Used for prices and counters. */
export const digits = (n, lang = 'ar') =>
  lang === 'ar'
    ? String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[+d])
    : String(n);

/**
 * Formats a numeric price from the API.
 *
 * The API sends plain numbers, so nothing here has to parse a formatted string
 * back into a value the way the old static data forced.
 */
export const formatPrice = (value, lang = 'ar') => {
  const amount = Number(value ?? 0);
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
  const grouped = rounded.toLocaleString('en-US');

  return lang === 'ar' ? `${digits(grouped)} ج.م` : `${grouped} EGP`;
};
