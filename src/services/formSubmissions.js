import { get, put, del, cleanParams } from './http'

export const listSubmissions  = (params) => get('/form-submissions', { params: cleanParams(params) })
export const submissionStats  = ()       => get('/form-submissions/stats')
export const showSubmission   = (id)     => get(`/form-submissions/${id}`)
export const updateSubmissionStatus = (id, status) => put(`/form-submissions/${id}/status`, { status })
export const deleteSubmission = (id)     => del(`/form-submissions/${id}`)
