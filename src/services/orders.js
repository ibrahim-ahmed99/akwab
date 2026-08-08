import { get, put, cleanParams } from './http'

export const listOrders       = (params) => get('/orders', { params: cleanParams(params) })
export const orderStats       = ()       => get('/orders/stats')
export const showOrder        = (id)     => get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => put(`/orders/${id}/status`, { status })
