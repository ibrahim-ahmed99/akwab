import { get, post, put, del, cleanParams } from './http'

export const listCategories  = (params)     => get('/categories', { params: cleanParams(params) })
export const showCategory    = (id)         => get(`/categories/${id}`)
export const createCategory  = (body)       => post('/categories', body)
export const updateCategory  = (id, body)   => put(`/categories/${id}`, body)
export const deleteCategory  = (id)         => del(`/categories/${id}`)
