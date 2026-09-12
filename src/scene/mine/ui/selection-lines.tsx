import { Line } from '@react-three/drei'
import { observer } from 'mobx-react-lite'

import type { Mine } from '@/domain/mine'
import type { Position3D } from '@/shared/types/position-3d'
import type { ViewerStore } from '@/store/viewer'

import {
  buildSectionPositions,
  getSelectedSections
} from '../lib/build-scene-data'

interface SelectionLinesProps {
  mine: Mine
  origin: Position3D
  viewerStore: ViewerStore
}

export const SelectionLines = observer(
  ({ mine, origin, viewerStore }: SelectionLinesProps) => {
    const sections = getSelectedSections(
      mine,
      viewerStore.selectedEntity
    ).filter((section) =>
      viewerStore.isExcavationVisible(section.excavationId, section.horizonId)
    )
    if (!sections.length) return null

    const positions = buildSectionPositions(mine, sections, origin)
    const points: [number, number, number][] = []

    for (let index = 0; index < positions.length; index += 3) {
      points.push([
        positions[index],
        positions[index + 1],
        positions[index + 2]
      ])
    }

    return (
      <>
        <Line
          color='#ffffff'
          depthTest={false}
          depthWrite={false}
          lineWidth={6}
          points={points}
          raycast={() => {}}
          renderOrder={1}
          segments
          toneMapped={false}
        />
        <Line
          color='#111827'
          depthTest={false}
          depthWrite={false}
          lineWidth={3}
          points={points}
          raycast={() => {}}
          renderOrder={2}
          segments
          toneMapped={false}
        />
      </>
    )
  }
)
