import { createContext, useContext, useState } from 'react'

const BadgesContext = createContext({})

/* initial counts from the seed data in each page */
const INITIAL = {
  '/contact': 2,   // messages with status 'جديد'
  '/orders':  4,   // orders that are جاري | معلق | شحن
  '/form':    1,   // new form submission
}

export function BadgesProvider({ children }) {
  const [badges, setBadges] = useState(INITIAL)

  const setBadge = (path, count) =>
    setBadges(prev => ({ ...prev, [path]: count }))

  return (
    <BadgesContext.Provider value={{ badges, setBadge }}>
      {children}
    </BadgesContext.Provider>
  )
}

export const useBadges = () => useContext(BadgesContext)
