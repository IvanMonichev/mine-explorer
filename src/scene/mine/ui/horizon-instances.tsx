import { observer } from 'mobx-react-lite'
import type { CylinderGeometry } from 'three'

import { getCategoryColor } from '@/shared/utils/get-category-color'
import type { ViewerStore } from '@/store/viewer'

import type { HorizonBatch } from '../model/types'

import { SectionInstances } from './section-instances'

interface HorizonInstancesProps {
  batch: HorizonBatch
  geometry: CylinderGeometry
  viewerStore: ViewerStore
}

const HorizonMaterial = observer(
  ({
    horizonId,
    viewerStore
  }: {
    horizonId: number
    viewerStore: ViewerStore
  }) => {
    const hasSelection = viewerStore.selectedEntity !== null

    return (
      <meshLambertMaterial
        color={getCategoryColor(horizonId)}
        depthWrite={!hasSelection}
        opacity={hasSelection ? 0.25 : 1}
        toneMapped={false}
        transparent={hasSelection}
      />
    )
  }
)

export const HorizonInstances = observer(
  ({ batch, geometry, viewerStore }: HorizonInstancesProps) => {
    const visibleIndices = batch.sections.flatMap((section, index) =>
      viewerStore.isExcavationVisible(section.excavationId, batch.horizonId)
        ? [index]
        : []
    )

    return (
      <SectionInstances
        geometry={geometry}
        indices={visibleIndices}
        matrices={batch.matrices}
        onSelect={(index) => {
          viewerStore.select({
            type: 'excavation',
            id: batch.sections[index].excavationId
          })
        }}
      >
        <HorizonMaterial
          horizonId={batch.horizonId}
          viewerStore={viewerStore}
        />
      </SectionInstances>
    )
  }
)
