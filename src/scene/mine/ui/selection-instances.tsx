import { observer } from 'mobx-react-lite'
import type { CylinderGeometry } from 'three'

import type { Mine } from '@/domain/mine'
import type { Position3D } from '@/shared/types/position-3d'
import type { ViewerStore } from '@/store/viewer'

import {
  buildSectionMatrices,
  getSelectedSections
} from '../lib/build-scene-data'

import { SectionInstances } from './section-instances'

interface SelectionInstancesProps {
  geometry: CylinderGeometry
  mine: Mine
  origin: Position3D
  viewerStore: ViewerStore
}

export const SelectionInstances = observer(
  ({ geometry, mine, origin, viewerStore }: SelectionInstancesProps) => {
    const sections = getSelectedSections(
      mine,
      viewerStore.selectedEntity
    ).filter((section) =>
      viewerStore.isExcavationVisible(section.excavationId, section.horizonId)
    )
    if (!sections.length) return null

    const matrices = buildSectionMatrices(mine, sections, origin)

    return (
      <>
        <SectionInstances
          geometry={geometry}
          matrices={matrices}
          radiusScale={1.35}
          renderOrder={1}
        >
          <meshBasicMaterial
            color='#ffffff'
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
            transparent
          />
        </SectionInstances>
        <SectionInstances
          geometry={geometry}
          matrices={matrices}
          radiusScale={1.1}
          renderOrder={2}
        >
          <meshBasicMaterial
            color='#111827'
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
            transparent
          />
        </SectionInstances>
      </>
    )
  }
)
