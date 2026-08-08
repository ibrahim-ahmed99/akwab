import { get, post, put, del, cleanParams } from './http'

export const listMessages   = (params) => get('/messages', { params: cleanParams(params) })
export const messageStats   = ()       => get('/messages/stats')
export const showMessage    = (id)     => get(`/messages/${id}`)
export const updateMessageStatus = (id, status) => put(`/messages/${id}/status`, { status })
/** Persists the body and flips the status to `replied` in one call. */
export const replyToMessage = (id, reply) => post(`/messages/${id}/reply`, { reply })
export const deleteMessage  = (id)     => del(`/messages/${id}`)
