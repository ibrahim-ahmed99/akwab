import { get, put, patch } from './http'

/* ─── Contact cards ─── */
export const getContactInfo    = ()     => get('/contact-info')
export const updateContactInfo = (body) => put('/contact-info', body)

/* ─── Home sections (hero | features | badge | cta) ─── */
export const listHomeSections     = ()               => get('/home-sections')
export const showHomeSection      = (section)        => get(`/home-sections/${section}`)
export const updateHomeSection    = (section, data)  => put(`/home-sections/${section}`, { data })
export const setHomeSectionActive = (section, active) => patch(`/home-sections/${section}/active`, { active })

/* ─── Form page content ─── */
export const getFormContent    = ()     => get('/form-content')
export const updateFormContent = (body) => put('/form-content', body)

/* ─── About page ─── */
export const getAbout    = ()     => get('/about')
export const updateAbout = (body) => put('/about', body)

/* ─── Governorates (cities) ─── */
export const listGovernorates = () => get('/governorates')
