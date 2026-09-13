import { makeAutoObservable, observableRef } from 'mobx'

import type { SelectedEntityRef } from '@/domain/mine'
import type { Position3D } from '@/shared/types/position-3d'

export class ViewerStore {
  selectedEntity: SelectedEntityRef | null = null
  focusRequest: { entity: SelectedEntityRef | null } | null = null
  cameraPosition: Position3D | null = null
  renderMetrics: {
    readonly triangles: number
    readonly points: number
  } | null = null
  cameraDirectionRequest: Position3D | null = null
  showGrid = false
  showOrientation = true
  hiddenHorizonIds = new Set<number>()
  hiddenExcavationIds = new Set<number>()

  constructor() {
    makeAutoObservable(
      this,
      {
        selectedEntity: observableRef,
        focusRequest: observableRef,
        cameraPosition: observableRef,
        renderMetrics: observableRef,
        cameraDirectionRequest: observableRef
      },
      { autoBind: true }
    )
  }

  select(entity: SelectedEntityRef | null) {
    this.selectedEntity = entity
  }

  requestFocus(entity: SelectedEntityRef | null) {
    this.focusRequest = { entity }
  }

  requestCameraDirection(direction: Position3D) {
    this.cameraDirectionRequest = direction
  }

  toggleGrid() {
    this.showGrid = !this.showGrid
  }

  toggleOrientation() {
    this.showOrientation = !this.showOrientation
  }

  setCameraPosition(position: Position3D | null) {
    if (
      this.cameraPosition?.x === position?.x &&
      this.cameraPosition?.y === position?.y &&
      this.cameraPosition?.z === position?.z
    )
      return

    this.cameraPosition = position
  }

  setRenderMetrics(metrics: ViewerStore['renderMetrics']) {
    if (
      this.renderMetrics?.triangles === metrics?.triangles &&
      this.renderMetrics?.points === metrics?.points
    )
      return

    this.renderMetrics = metrics
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
    this.focusRequest = null
    this.cameraPosition = null
    this.renderMetrics = null
    this.cameraDirectionRequest = null
    this.hiddenHorizonIds.clear()
    this.hiddenExcavationIds.clear()
  }
}
