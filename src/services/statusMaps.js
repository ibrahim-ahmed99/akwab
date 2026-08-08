/**
 * Single source of truth mapping API status keys to the badge classes in
 * index.css. We always *display* `status_label` from the API and *send* the
 * english `status` key — `جاري` alone covers both `confirmed` and `processing`,
 * so keys are the only unambiguous filter value.
 */

export const ORDER_BADGE = {
  delivered:  'badge-success',
  confirmed:  'badge-info',
  processing: 'badge-info',
  pending:    'badge-warning',
  shipped:    'badge-gold',
  cancelled:  'badge-danger',
}

export const REQUEST_BADGE = {
  new:       'badge-pink',
  in_review: 'badge-warning',
  replied:   'badge-success',
}

export const CUSTOMER_BADGE = {
  vip:    'badge-gold',
  active: 'badge-success',
  new:    'badge-info',
  banned: 'badge-danger',
}

export const ACTIVE_BADGE = {
  active:   'badge-success',
  inactive: 'badge-gray',
}

export const badgeClass = (map, key) => map[key] ?? 'badge-gray'

/** Status options the request endpoints accept, with their Arabic labels. */
export const REQUEST_STATUSES = [
  { key: 'new',       label: 'جديد' },
  { key: 'in_review', label: 'قيد المراجعة' },
  { key: 'replied',   label: 'تم الرد' },
]

export const CUSTOMER_STATUSES = [
  { key: 'vip',    label: 'VIP' },
  { key: 'active', label: 'نشط' },
  { key: 'new',    label: 'جديد' },
  { key: 'banned', label: 'محظور' },
]

/** Products and categories share is_active but word it differently. */
export const PRODUCT_STATUSES = [
  { key: 'active',   label: 'متاح' },
  { key: 'inactive', label: 'غير متاح' },
]

export const CATEGORY_STATUSES = [
  { key: 'active',   label: 'نشط' },
  { key: 'inactive', label: 'متوقف' },
]
