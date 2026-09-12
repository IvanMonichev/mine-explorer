import { useLayoutEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { BufferGeometry, DynamicDrawUsage } from 'three'

import { getCategoryColor } from '@/shared/utils/get-category-color'
import type { ViewerStore } from '@/store/viewer'

import type { HorizonBatch } from '../model/mine-scene-data'

interface HorizonLinesProps {
  batch: HorizonBatch
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
      <lineBasicMaterial
        color={getCategoryColor(horizonId)}
        depthWrite={!hasSelection}
        opacity={hasSelection ? 0.25 : 1}
        toneMapped={false}
        transparent={hasSelection}
      />
    )
  }
)

export const HorizonLines = observer(
  ({ batch, viewerStore }: HorizonLinesProps) => {
    const geometryRef = useRef<BufferGeometry>(null)
    const invalidate = useThree((state) => state.invalidate)
    const indices = useMemo(
      () => new Uint32Array(batch.sections.length * 2),
      [batch]
    )
    const visibleSections = batch.sections.flatMap((section, index) =>
      viewerStore.isExcavationVisible(section.excavationId, batch.horizonId)
        ? [{ section, index }]
        : []
    )

    useLayoutEffect(() => {
      const geometry = geometryRef.current
      if (!geometry?.index) return

      // Меняем только индексы видимых секций, общий буфер координат сохраняется.
      visibleSections.forEach(({ index }, offset) => {
        indices[offset * 2] = index * 2
        indices[offset * 2 + 1] = index * 2 + 1
      })
      geometry.index.needsUpdate = true
      geometry.setDrawRange(0, visibleSections.length * 2)
      invalidate()
    }, [indices, invalidate, visibleSections])

    if (!visibleSections.length) return null

    return (
      <lineSegments
        onClick={(event) => {
          if (event.index === undefined || event.delta > 3) return

          const hit = visibleSections[Math.floor(event.index / 2)]
          if (!hit) return

          event.stopPropagation()
          viewerStore.select({
            type: 'excavation',
            id: hit.section.excavationId
          })
        }}
      >
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            args={[batch.positions, 3]}
            attach='attributes-position'
          />
          <bufferAttribute
            args={[indices, 1]}
            attach='index'
            usage={DynamicDrawUsage}
          />
        </bufferGeometry>
        <HorizonMaterial
          horizonId={batch.horizonId}
          viewerStore={viewerStore}
        />
      </lineSegments>
    )
  }
)
