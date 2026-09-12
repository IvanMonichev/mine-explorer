import { makeAutoObservable, observableRef } from 'mobx'

import type { Mine } from '@/domain/mine'

export class MineStore {
  mine: Mine | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this, { mine: observableRef }, { autoBind: true })
  }

  startLoading() {
    this.isLoading = true
    this.error = null
  }

  setMine(mine: Mine) {
    this.mine = mine
    this.isLoading = false
    this.error = null
  }

  setError(message: string) {
    this.error = message
    this.isLoading = false
  }

  clear() {
    this.mine = null
    this.isLoading = false
    this.error = null
  }
}
