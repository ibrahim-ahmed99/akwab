/** Shared display helpers — Arabic-Egypt locale, EGP amounts. */

export const money = (value) =>
  `ج.م ${Number(value ?? 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 })}`

export const num = (value) => Number(value ?? 0).toLocaleString('ar-EG')

/** "منذ يومين" from an API `updated_at` string. */
export const relativeTime = (dateString) => {
  if (!dateString) return 'لم يُحدَّث بعد'

  const then = new Date(dateString.replace(' ', 'T'))
  if (Number.isNaN(then.getTime())) return dateString

  const minutes = Math.round((Date.now() - then.getTime()) / 60000)
  if (minutes < 1)    return 'الآن'
  if (minutes < 60)   return `منذ ${minutes} دقيقة`

  const hours = Math.round(minutes / 60)
  if (hours < 24)     return `منذ ${hours} ساعة`

  const days = Math.round(hours / 24)
  if (days === 1)     return 'منذ يوم'
  if (days === 2)     return 'منذ يومين'
  if (days < 30)      return `منذ ${days} أيام`

  const months = Math.round(days / 30)
  return months === 1 ? 'منذ شهر' : `منذ ${months} أشهر`
}
