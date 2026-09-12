import { Box3, Vector3 } from 'three'

import type { Mine, SelectedEntityRef } from '@/domain/mine'
import {
  getExcavationSections,
  getHorizonSections,
  getMineBounds
} from '@/domain/mine'
import type { Section } from '@/domain/section'
import type { Position3D } from '@/shared/types/position-3d'

import type { MineSceneData } from '../model/mine-scene-data'

export const toScenePosition = (position: Position3D, origin: Position3D) =>
  new Vector3(
    position.x - origin.x,
    position.z - origin.z,
    origin.y - position.y
  )

export const buildSectionPositions = (
  mine: Mine,
  sections: readonly Section[],
  origin: Position3D
) => {
  const positions = new Float32Array(sections.length * 6)

  sections.forEach((section, index) => {
    const start = mine.nodes.get(section.startNodeId)!
    const end = mine.nodes.get(section.endNodeId)!

    toScenePosition(start.position, origin).toArray(positions, index * 6)
    toScenePosition(end.position, origin).toArray(positions, index * 6 + 3)
  })

  return positions
}

export const getSelectedSections = (
  mine: Mine,
  selected: SelectedEntityRef | null
): Section[] => {
  if (!selected) return []

  switch (selected.type) {
    case 'horizon':
      return getHorizonSections(mine, selected.id)
    case 'excavation':
      return getExcavationSections(mine, selected.id)
    case 'section': {
      const section = mine.sections.get(selected.id)
      return section ? [section] : []
    }
    case 'node':
      return []
  }
}

export const buildSceneData = (mine: Mine): MineSceneData => {
  const sourceBounds = getMineBounds(mine)
  const origin = sourceBounds
    ? {
        x: (sourceBounds.min.x + sourceBounds.max.x) / 2,
        y: (sourceBounds.min.y + sourceBounds.max.y) / 2,
        z: (sourceBounds.min.z + sourceBounds.max.z) / 2
      }
    : { x: 0, y: 0, z: 0 }
  const bounds = new Box3()

  // Сдвиг до записи в Float32 сохраняет точность больших исходных координат.
  // Исходная ось Z направлена вверх; в Three.js ей соответствует ось Y.
  const batches = Array.from(mine.horizons.values()).flatMap((horizon) => {
    const sections = getHorizonSections(mine, horizon.id)
    if (!sections.length) return []

    const positions = buildSectionPositions(mine, sections, origin)
    bounds.union(new Box3().setFromArray(positions))

    return [{ horizonId: horizon.id, sections, positions }]
  })

  return { origin, bounds, batches }
}

export const getFocusBounds = (
  mine: Mine,
  data: MineSceneData,
  selected: SelectedEntityRef | null
) => {
  if (!selected) return data.bounds

  if (selected.type === 'node') {
    const node = mine.nodes.get(selected.id)
    return node
      ? new Box3().expandByPoint(toScenePosition(node.position, data.origin))
      : new Box3()
  }

  return new Box3().setFromArray(
    buildSectionPositions(
      mine,
      getSelectedSections(mine, selected),
      data.origin
    )
  )
}
