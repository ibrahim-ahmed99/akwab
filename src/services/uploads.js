import { post, del } from './http'

/** Allowed folders — mirrors config('admins.uploads.folders') on the API. */
export const FOLDERS = ['products', 'categories', 'home', 'about', 'form']

/**
 * Uploads one file and returns {path, url, folder}. `path` is the bare filename,
 * which is what products.images[] / categories.image / form card images expect.
 */
export const uploadFile = (file, folder) => {
  const body = new FormData()
  body.append('folder', folder)
  body.append('file', file)
  return post('/uploads', body)
}

export const uploadFiles = (files, folder) => {
  const body = new FormData()
  body.append('folder', folder)
  Array.from(files).forEach(f => body.append('files[]', f))
  return post('/uploads', body)
}

export const deleteFile = (path, folder) => del('/uploads', { data: { path, folder } })
