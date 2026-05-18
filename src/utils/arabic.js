const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const toArabicDigits = (n) =>
  String(n)
    .padStart(2, '0')
    .split('')
    .map((d) => ARABIC_DIGITS[+d] ?? d)
    .join('');

/** "★★★★★" for an n-star rating out of 5 (filled + empty). */
export const starsStr = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
