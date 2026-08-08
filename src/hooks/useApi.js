import { useCallback, useEffect, useState } from 'react'

/**
 * Runs a service function and exposes {data, meta, loading, error, reload}.
 *
 * `deps` behaves like a useEffect dependency list — change a filter and the
 * request re-runs. A stale response is discarded when deps change mid-flight.
 */
export function useApi(fetcher, deps = [], { skip = false } = {}) {
  const [data, setData]       = useState(null)
  const [meta, setMeta]       = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError]     = useState(null)
  const [nonce, setNonce]     = useState(0)

  const reload = useCallback(() => setNonce(n => n + 1), [])

  useEffect(() => {
    if (skip) { setLoading(false); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then(res => {
        if (cancelled) return
        setData(res?.data ?? null)
        setMeta(res?.meta ?? null)
      })
      .catch(err => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, skip])

  return { data, meta, loading, error, reload, setData }
}
