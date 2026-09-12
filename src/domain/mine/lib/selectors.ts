import type { Excavation } from '@/domain/excavation'
import type { Horizon } from '@/domain/horizon'
import type { MineNode } from '@/domain/node'
import type { Section } from '@/domain/section'

import type { Mine } from '../model/mine'

export const getHorizonById = (mine: Mine, id: number): Horizon | undefined =>
  mine.horizons.get(id)

export const getExcavationById = (
  mine: Mine,
  id: number
): Excavation | undefined => mine.excavations.get(id)

export const getSectionById = (mine: Mine, id: number): Section | undefined =>
  mine.sections.get(id)

export const getNodeById = (mine: Mine, id: number): MineNode | undefined =>
  mine.nodes.get(id)

/** Resolves indexed relationships in source order, skipping missing entities. */
export const getExcavationSections = (
  mine: Mine,
  excavationId: number
): readonly Section[] => {
  const excavation = mine.excavations.get(excavationId)
  if (!excavation) return []

  const sections: Section[] = []

  for (const id of excavation.sectionIds) {
    const section = mine.sections.get(id)
    if (section) sections.push(section)
  }

  return sections
}

/** Resolves indexed relationships in source order, skipping missing entities. */
export const getHorizonExcavations = (
  mine: Mine,
  horizonId: number
): readonly Excavation[] => {
  const horizon = mine.horizons.get(horizonId)
  if (!horizon) return []

  const excavations: Excavation[] = []

  for (const id of horizon.excavationIds) {
    const excavation = mine.excavations.get(id)
    if (excavation) excavations.push(excavation)
  }

  return excavations
}

/** Resolves indexed relationships in source order, skipping missing entities. */
export const getHorizonSections = (
  mine: Mine,
  horizonId: number
): readonly Section[] => {
  const horizon = mine.horizons.get(horizonId)
  if (!horizon) return []

  const sections: Section[] = []

  for (const id of horizon.sectionIds) {
    const section = mine.sections.get(id)
    if (section) sections.push(section)
  }

  return sections
}
