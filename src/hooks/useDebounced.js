import { useEffect, useState } from 'react'

/** Delays a value so typing in a search box doesn't fire a request per keystroke. */
export function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
