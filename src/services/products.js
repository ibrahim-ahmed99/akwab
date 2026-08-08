import { get, post, put, del, cleanParams } from './http'

export const listProducts   = (params)   => get('/products', { params: cleanParams(params) })
export const productStats   = ()         => get('/products/stats')
export const showProduct    = (id)       => get(`/products/${id}`)
export const createProduct  = (body)     => post('/products', body)
export const updateProduct  = (id, body) => put(`/products/${id}`, body)
export const deleteProduct  = (id)       => del(`/products/${id}`)
