import type { Mine } from '@/domain/mine'
import { getHorizonExcavations } from '@/domain/mine'

import type { MineTreeNode } from '../model/mine-tree-node'

export const buildTreeData = (mine: Mine): MineTreeNode[] =>
  Array.from(mine.horizons.values(), (horizon) => ({
    key: `horizon:${horizon.id}`,
    title: horizon.name,
    entity: { type: 'horizon', id: horizon.id },
    horizonId: horizon.id,
    sectionCount: horizon.sectionIds.length,
    children: getHorizonExcavations(mine, horizon.id).map((excavation) => ({
      key: `excavation:${excavation.id}`,
      title: excavation.name,
      entity: { type: 'excavation', id: excavation.id },
      horizonId: horizon.id,
      sectionCount: excavation.sectionIds.length,
      isLeaf: true
    }))
  }))
