import { get, put } from './http'

/* ─── Shipping prices per governorate ─── */
export const getShippingRates    = ()       => get('/shipping')
export const updateShippingRates = (values) => put('/shipping', { values })
