import { useContext } from 'react'

import { RootStoreContext } from './root-store-context'

export const useRootStore = () => {
  const store = useContext(RootStoreContext)

  if (!store) {
    throw new Error('useRootStore must be used within StoreProvider')
  }

  return store
}
