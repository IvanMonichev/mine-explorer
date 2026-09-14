import { observer } from 'mobx-react-lite'
import type { CylinderGeometry } from 'three'

import { getCategoryColor } from '@/shared/utils/get-category-color'
import { useRootStore } from '@/store/root'

import type { HorizonBatch } from '../model/types'

import { SectionInstances } from './section-instances'

interface HorizonInstancesProps {
  batch: HorizonBatch
  geometry: CylinderGeometry
}

const HorizonMaterial = observer(({ horizonId }: { horizonId: number }) => {
  const { viewerStore } = useRootStore()
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
})

export const HorizonInstances = observer(
  ({ batch, geometry }: HorizonInstancesProps) => {
    const { viewerStore } = useRootStore()
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
        <HorizonMaterial horizonId={batch.horizonId} />
      </SectionInstances>
    )
  }
)
