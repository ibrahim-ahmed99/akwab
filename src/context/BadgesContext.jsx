import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getBadges } from '../services/dashboard'

const BadgesContext = createContext({})

/** API keys → sidebar route paths. */
const KEY_TO_PATH = {
  contact_new:   '/contact',
  orders_active: '/orders',
  form_new:      '/form',
}

export function BadgesProvider({ children }) {
  const [badges, setBadges] = useState({})

  const refreshBadges = useCallback(() => {
    return getBadges()
      .then(res => {
        const next = {}
        for (const [key, path] of Object.entries(KEY_TO_PATH)) {
          next[path] = res.data?.[key] ?? 0
        }
        setBadges(next)
      })
      // A failed badge poll must never break the page it was triggered from.
      .catch(() => {})
  }, [])

  useEffect(() => { refreshBadges() }, [refreshBadges])

  return (
    <BadgesContext.Provider value={{ badges, refreshBadges }}>
      {children}
    </BadgesContext.Provider>
  )
}

export const useBadges = () => useContext(BadgesContext)
