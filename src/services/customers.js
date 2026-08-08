import { get, put, del, cleanParams } from './http'

export const listCustomers  = (params)   => get('/customers', { params: cleanParams(params) })
export const showCustomer   = (id)       => get(`/customers/${id}`)
export const updateCustomer = (id, body) => put(`/customers/${id}`, body)
export const deleteCustomer = (id)       => del(`/customers/${id}`)
