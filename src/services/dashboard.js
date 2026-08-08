import { get } from './http'

export const getStats               = () => get('/dashboard/stats')
export const getSales               = (range = '12m') => get('/dashboard/sales', { params: { range } })
export const getCategoryDistribution = () => get('/dashboard/category-distribution')
export const getRecentOrders        = (limit = 5) => get('/dashboard/recent-orders', { params: { limit } })
export const getTopProducts         = (limit = 4) => get('/dashboard/top-products', { params: { limit } })
export const getBadges              = () => get('/dashboard/badges')
