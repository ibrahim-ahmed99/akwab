import { useState } from 'react'
import { Truck, Save, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import StateBlock from '../components/StateBlock'
import FormError from '../components/FormError'
import { getShippingRates, updateShippingRates } from '../services/shipping'
import { money, num } from '../services/format'

export default function Shipping() {
  // Only edited values live here (keyed by city_id) — everything else falls
  // back to the API value, so a reload after save naturally clears the form.
  const [draft, setDraft]   = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const [saved, setSaved]   = useState(false)

  const rates  = useApi(() => getShippingRates(), [])
  const cities = rates.data ?? []

  const valueOf = (c) => draft[c.city_id] ?? String(c.value)

  const isInvalid = (v) => v === '' || Number.isNaN(Number(v)) || Number(v) < 0
  const hasInvalid = cities.some(c => isInvalid(valueOf(c)))
  const isDirty = cities.some(c =>
    draft[c.city_id] !== undefined && Number(draft[c.city_id]) !== Number(c.value),
  )

  const setValue = (cityId, value) => {
    setSaved(false)
    setDraft(prev => ({ ...prev, [cityId]: value }))
  }

  const reset = () => {
    setDraft({})
    setError(null)
  }

  const save = async () => {
    if (saving || hasInvalid) return
    setSaving(true)
    setError(null)
    try {
      const values = Object.fromEntries(cities.map(c => [c.city_id, Number(valueOf(c))]))
      await updateShippingRates(values)
      setDraft({})
      setSaved(true)
      rates.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>أسعار الشحن</h1>
          <p>سعر التوصيل لكل محافظة</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && !isDirty && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 700, color: 'var(--brand-gold, #C8A84B)',
            }}>
              <CheckCircle2 size={15} /> تم الحفظ
            </span>
          )}
          {isDirty && (
            <button className="btn btn-outline" onClick={reset} disabled={saving}>
              <RotateCcw size={14} /> تراجع
            </button>
          )}
          <button className="btn btn-primary" onClick={save} disabled={saving || !isDirty || hasInvalid}>
            {saving
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
              : <><Save size={14} /> حفظ الأسعار</>}
          </button>
        </div>
      </div>

      {error && <FormError message={error} />}

      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="p-bg-1" style={{
            width: 38, height: 38, borderRadius: 'var(--radius-brand-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E0478A',
          }}>
            <Truck size={18} />
          </div>
          المحافظات
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-ink-soft)', marginRight: 'auto' }}>
            {num(cities.length)} محافظة
          </span>
        </div>

        <StateBlock
          loading={rates.loading} error={rates.error} onRetry={rates.reload}
          isEmpty={!cities.length} emptyLabel="لا توجد محافظات"
        >
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>المحافظة</th>
                  <th>السعر الحالي</th>
                  <th style={{ width: 220 }}>سعر الشحن (ج.م)</th>
                </tr>
              </thead>
              <tbody>
                {cities.map(c => {
                  const value   = valueOf(c)
                  const edited  = draft[c.city_id] !== undefined && Number(draft[c.city_id]) !== Number(c.value)
                  const invalid = isInvalid(value)

                  return (
                    <tr key={c.city_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700 }}>{c.city_name}</span>
                          {!c.is_active && (
                            <span className="badge" style={{
                              background: 'var(--brand-line)', color: 'var(--brand-ink-soft)',
                            }}>غير مفعلة</span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--brand-ink-soft)', whiteSpace: 'nowrap' }}>
                        {money(c.value)}
                      </td>
                      <td>
                        <input
                          type="number" min="0" step="0.5" dir="ltr"
                          className="form-control"
                          style={{
                            maxWidth: 180, padding: '8px 12px', fontSize: 14, fontWeight: 700,
                            textAlign: 'left',
                            borderColor: invalid
                              ? 'var(--error)'
                              : edited ? 'var(--brand-pink)' : undefined,
                          }}
                          value={value}
                          onChange={e => setValue(c.city_id, e.target.value)}
                          disabled={saving}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </StateBlock>
      </div>
    </div>
  )
}
