import { Box3, Matrix4, Quaternion, Vector3 } from 'three'

import type { Mine, SelectedEntityRef } from '@/domain/mine'
import {
  getExcavationSections,
  getHorizonSections,
  getMineBounds
} from '@/domain/mine'
import type { Section } from '@/domain/section'
import type { Position3D } from '@/shared/types/position-3d'

import type { MineSceneData } from '../model/types'

import { getSceneOrigin } from './get-scene-origin'

const SECTION_THICKNESS_SCALE = 0.25

const getSectionRadius = (section: Section) =>
  (section.thickness * SECTION_THICKNESS_SCALE) / 2

export const toScenePosition = (position: Position3D, origin: Position3D) =>
  new Vector3(
    position.x - origin.x,
    position.z - origin.z,
    origin.y - position.y
  )

export const buildSectionMatrices = (
  mine: Mine,
  sections: readonly Section[],
  origin: Position3D
) => {
  const matrices = new Float32Array(sections.length * 16)
  const axis = new Vector3(0, 1, 0)
  const direction = new Vector3()
  const center = new Vector3()
  const scale = new Vector3()
  const rotation = new Quaternion()
  const matrix = new Matrix4()

  sections.forEach((section, index) => {
    const start = toScenePosition(
      mine.nodes.get(section.startNodeId)!.position,
      origin
    )
    const end = toScenePosition(
      mine.nodes.get(section.endNodeId)!.position,
      origin
    )
    const length = direction.subVectors(end, start).length()
    // Уменьшаем диаметр для отображения, сохраняя исходную толщину в модели.
    const radius = getSectionRadius(section)

    center.addVectors(start, end).multiplyScalar(0.5)
    rotation.setFromUnitVectors(
      axis,
      length > 0 ? direction.divideScalar(length) : axis
    )
    // Минимальная длина исключает необратимую матрицу при совпадении узлов.
    scale.set(radius, Math.max(length, 0.001), radius)
    matrix.compose(center, rotation, scale).toArray(matrices, index * 16)
  })

  return matrices
}

const getSectionBounds = (
  mine: Mine,
  sections: readonly Section[],
  origin: Position3D
) => {
  const bounds = new Box3()
  const sectionBounds = new Box3()

  for (const section of sections) {
    sectionBounds.makeEmpty()
    sectionBounds.expandByPoint(
      toScenePosition(mine.nodes.get(section.startNodeId)!.position, origin)
    )
    sectionBounds.expandByPoint(
      toScenePosition(mine.nodes.get(section.endNodeId)!.position, origin)
    )
    bounds.union(sectionBounds.expandByScalar(getSectionRadius(section)))
  }

  return bounds
}

export const getSelectedSections = (
  mine: Mine,
  selected: SelectedEntityRef | null
): readonly Section[] => {
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
  const origin = getSceneOrigin(sourceBounds)
  const bounds = new Box3()

  // Сдвиг до записи в Float32 сохраняет точность больших исходных координат.
  // Исходная ось Z направлена вверх; в Three.js ей соответствует ось Y.
  const batches = Array.from(mine.horizons.values()).flatMap((horizon) => {
    const sections = getHorizonSections(mine, horizon.id)
    if (!sections.length) return []

    const matrices = buildSectionMatrices(mine, sections, origin)
    bounds.union(getSectionBounds(mine, sections, origin))

    return [{ horizonId: horizon.id, sections, matrices }]
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

  return getSectionBounds(
    mine,
    getSelectedSections(mine, selected),
    data.origin
  )
}
