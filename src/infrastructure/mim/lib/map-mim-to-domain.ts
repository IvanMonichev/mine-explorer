import type { Excavation } from '@/domain/excavation'
import type { Horizon } from '@/domain/horizon'
import type { Mine } from '@/domain/mine'
import type { MineNode } from '@/domain/node'
import type { Section } from '@/domain/section'

import type { MimSchemeDto, MimSectionDto } from '../model/mim-dto'
import { MimLoadError } from '../model/mim-load-error'

const indexEntities = <T extends { readonly id: number }>(
  entities: readonly T[],
  entityName: string
): Map<number, T> => {
  const index = new Map<number, T>()

  for (const entity of entities) {
    if (index.has(entity.id)) {
      throw new MimLoadError(
        'duplicate-id',
        `Повторяется идентификатор ${entityName}: ${entity.id}.`
      )
    }

    index.set(entity.id, entity)
  }

  return index
}

const indexSectionOwners = (
  groups: Iterable<{
    readonly id: number
    readonly sectionIds: readonly number[]
  }>,
  sections: ReadonlyMap<number, MimSectionDto>,
  groupName: string
): Map<number, number> => {
  const owners = new Map<number, number>()

  for (const group of groups) {
    for (const sectionId of group.sectionIds) {
      if (!sections.has(sectionId)) {
        throw new MimLoadError(
          'missing-reference',
          `${groupName} ${group.id} ссылается на отсутствующую секцию ${sectionId}.`
        )
      }

      if (owners.has(sectionId)) {
        throw new MimLoadError(
          'invalid-relationship',
          `Секция ${sectionId} повторно указана в ${groupName}: ${owners.get(sectionId)} и ${group.id}.`
        )
      }

      owners.set(sectionId, group.id)
    }
  }

  return owners
}

/** Builds a complete topology or throws; does not mutate the source DTO. */
export const mapMimToDomain = (dto: MimSchemeDto, name: string): Mine => {
  const nodeDtos = indexEntities(dto.nodes, 'Node')
  const sectionDtos = indexEntities(dto.sections, 'Section')
  const excavationDtos = indexEntities(dto.excavations, 'Excavation')
  const horizonDtos = indexEntities(dto.horizons, 'Horizon')
  const sectionExcavationIds = indexSectionOwners(
    excavationDtos.values(),
    sectionDtos,
    'Excavation'
  )
  const sectionHorizonIds = indexSectionOwners(
    horizonDtos.values(),
    sectionDtos,
    'Horizon'
  )

  const nodes = new Map<number, MineNode>()
  const sections = new Map<number, Section>()
  const excavations = new Map<number, Excavation>()
  const horizons = new Map<number, Horizon>()
  const excavationHorizonIds = new Map<number, number>()
  const horizonExcavationIds = new Map<number, number[]>()

  for (const node of nodeDtos.values()) {
    nodes.set(node.id, {
      id: node.id,
      guid: node.guid,
      position: { x: node.x, y: node.y, z: node.z }
    })
  }

  for (const section of sectionDtos.values()) {
    for (const nodeId of [section.startNodeId, section.endNodeId]) {
      if (!nodes.has(nodeId)) {
        throw new MimLoadError(
          'missing-reference',
          `Секция ${section.id} ссылается на отсутствующий узел ${nodeId}.`
        )
      }
    }

    const excavationId = sectionExcavationIds.get(section.id)
    const horizonId = sectionHorizonIds.get(section.id)

    if (excavationId === undefined || horizonId === undefined) {
      throw new MimLoadError(
        'invalid-relationship',
        `Для секции ${section.id} не указан ${excavationId === undefined ? 'Excavation' : 'Horizon'}.`
      )
    }

    const previousHorizonId = excavationHorizonIds.get(excavationId)

    if (previousHorizonId !== undefined && previousHorizonId !== horizonId) {
      throw new MimLoadError(
        'invalid-relationship',
        `Выработка ${excavationId} содержит секции разных горизонтов: ${previousHorizonId} и ${horizonId}.`
      )
    }

    excavationHorizonIds.set(excavationId, horizonId)
    sections.set(section.id, {
      id: section.id,
      guid: section.guid,
      startNodeId: section.startNodeId,
      endNodeId: section.endNodeId,
      thickness: section.thickness,
      excavationId,
      horizonId
    })
  }

  for (const excavation of excavationDtos.values()) {
    const horizonId = excavationHorizonIds.get(excavation.id)

    if (horizonId === undefined) {
      throw new MimLoadError(
        'invalid-relationship',
        `У выработки ${excavation.id} нет секций: невозможно определить горизонт.`
      )
    }

    excavations.set(excavation.id, {
      id: excavation.id,
      guid: excavation.guid,
      name: excavation.name,
      objectId: excavation.objectId,
      type: excavation.excavationType,
      horizonId,
      sectionIds: [...excavation.sectionIds]
    })

    const ids = horizonExcavationIds.get(horizonId) ?? []
    ids.push(excavation.id)
    horizonExcavationIds.set(horizonId, ids)
  }

  for (const horizon of horizonDtos.values()) {
    horizons.set(horizon.id, {
      id: horizon.id,
      guid: horizon.guid,
      name: horizon.name,
      objectId: horizon.objectId,
      altitude: horizon.altitude,
      isMine: horizon.isMine,
      excavationIds: horizonExcavationIds.get(horizon.id) ?? [],
      sectionIds: [...horizon.sectionIds]
    })
  }

  return { name, nodes, sections, excavations, horizons }
}
