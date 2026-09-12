import { makeAutoObservable, observableRef } from 'mobx'

import type { SelectedEntityRef } from '@/domain/mine'

export class ViewerStore {
  selectedEntity: SelectedEntityRef | null = null
  hiddenHorizonIds = new Set<number>()
  hiddenExcavationIds = new Set<number>()

  constructor() {
    makeAutoObservable(
      this,
      { selectedEntity: observableRef },
      { autoBind: true }
    )
  }

  select(entity: SelectedEntityRef | null) {
    this.selectedEntity = entity
  }

  isHorizonVisible(id: number) {
    return !this.hiddenHorizonIds.has(id)
  }

  isExcavationVisible(id: number, horizonId: number) {
    return this.isHorizonVisible(horizonId) && !this.hiddenExcavationIds.has(id)
  }

  toggleHorizon(id: number) {
    if (this.hiddenHorizonIds.has(id)) this.hiddenHorizonIds.delete(id)
    else this.hiddenHorizonIds.add(id)
  }

  toggleExcavation(id: number) {
    if (this.hiddenExcavationIds.has(id)) this.hiddenExcavationIds.delete(id)
    else this.hiddenExcavationIds.add(id)
  }

  clear() {
    this.selectedEntity = null
    this.hiddenHorizonIds.clear()
    this.hiddenExcavationIds.clear()
  }
}
