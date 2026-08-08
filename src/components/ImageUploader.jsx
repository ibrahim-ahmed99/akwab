import { useRef, useState } from 'react'
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react'
import { uploadFile } from '../services/uploads'
import { CONFIG } from '../services/config'

/** Resolves a bare filename to its public URL (same shape as the API's asset()). */
export const fileUrl = (folder, name) =>
  name ? `${CONFIG.API_BASE_URL}/${folder}/${name}` : null

/**
 * Uploads to POST /uploads and hands back the *bare filename* — that is what
 * products.images[], categories.image and form card images all store.
 *
 * `value` is a filename (single) or an array of filenames (multiple).
 */
export default function ImageUploader({
  value,
  onChange,
  folder,
  multiple = false,
  max = 6,
  label,
  hint = 'PNG, JPG, WEBP — الحد الأقصى 5MB',
}) {
  const inputRef = useRef()
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState(null)

  const items = multiple ? (value ?? []) : (value ? [value] : [])

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return

    setBusy(true)
    setError(null)
    try {
      // One request per file: the single-file endpoint returns {path, url}
      // directly, which keeps the caller's array order predictable.
      const uploaded = []
      for (const file of files) {
        const res = await uploadFile(file, folder)
        uploaded.push(res.data.path)
      }
      onChange(multiple ? [...items, ...uploaded].slice(0, max) : uploaded[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const removeAt = (i) =>
    onChange(multiple ? items.filter((_, idx) => idx !== i) : null)

  const canAdd = multiple ? items.length < max : items.length === 0

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {multiple && (
            <span style={{ fontSize: 11, color: 'var(--brand-ink-soft)', fontWeight: 500, marginRight: 8 }}>
              ({items.length}/{max})
            </span>
          )}
        </label>
      )}

      <input
        type="file" accept="image/*" multiple={multiple}
        ref={inputRef} style={{ display: 'none' }} onChange={handleFiles}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: multiple ? 'repeat(3,1fr)' : '1fr',
        gap: 10,
      }}>
        {items.map((name, i) => (
          <div key={`${name}-${i}`} style={{
            position: 'relative', borderRadius: 12, overflow: 'hidden',
            border: '2px solid var(--brand-line)',
            aspectRatio: multiple ? '1' : '16 / 9',
          }}>
            <img
              src={fileUrl(folder, name)} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button" onClick={() => removeAt(i)}
              style={{
                position: 'absolute', top: 5, left: 5,
                background: 'rgba(61,37,64,0.7)', border: 'none', borderRadius: 7,
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={12} color="#fff" />
            </button>
            {multiple && i === 0 && (
              <div style={{
                position: 'absolute', bottom: 5, left: 5,
                background: 'rgba(224,71,138,0.9)', color: '#fff',
                borderRadius: 7, padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>رئيسية</div>
            )}
          </div>
        ))}

        {canAdd && (
          <div
            onClick={() => !busy && inputRef.current.click()}
            style={{
              border: '2px dashed var(--brand-line)', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: busy ? 'default' : 'pointer', background: 'var(--brand-cream)',
              aspectRatio: multiple ? '1' : '16 / 9', gap: 6, padding: 12,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-pink)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brand-line)'}
          >
            {busy ? (
              <Loader2 size={22} color="var(--brand-pink)" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {multiple ? <ImagePlus size={22} color="var(--brand-pink)" /> : <Upload size={26} color="var(--brand-pink)" />}
                <span style={{ fontSize: 12, color: 'var(--brand-ink)', fontWeight: 700 }}>
                  {multiple ? 'إضافة صورة' : 'اضغط لرفع الصورة'}
                </span>
                {!multiple && (
                  <span style={{ fontSize: 11, color: 'var(--brand-ink-soft)' }}>{hint}</span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontSize: 12, color: 'var(--error)', marginTop: 6, fontWeight: 600 }}>{error}</div>
      )}
    </div>
  )
}
