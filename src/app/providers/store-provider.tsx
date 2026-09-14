import type { PropsWithChildren } from 'react'
import { useState } from 'react'

import { RootStore, RootStoreContext } from '@/store/root'

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() => new RootStore())

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  )
}
