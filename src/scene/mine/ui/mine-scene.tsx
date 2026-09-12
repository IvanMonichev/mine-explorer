import { useMemo } from 'react'

import { Canvas } from '@react-three/fiber'

import type { Mine } from '@/domain/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import type { ViewerStore } from '@/store/viewer'

import { buildSceneData } from '../lib/build-scene-data'

import { HorizonLines } from './horizon-lines'
import { MineCamera } from './mine-camera'
import styles from './mine-scene.module.css'
import { SceneErrorBoundary } from './scene-error-boundary'
import { SceneHelpers } from './scene-helpers'
import { SelectionLines } from './selection-lines'

interface MineSceneProps {
  mine: Mine
  viewerStore: ViewerStore
}

export const MineScene = ({ mine, viewerStore }: MineSceneProps) => {
  const data = useMemo(() => buildSceneData(mine), [mine])

  return (
    <SceneErrorBoundary>
      <div className={styles['mine-scene']}>
        <Canvas
          aria-label='3D-схема шахты'
          camera={{ position: [1, 0.7, 1], fov: 45 }}
          dpr={[1, 2]}
          fallback={
            <InfoLayout
              conditions={[
                { condition: true, text: 'WebGL недоступен в браузере' }
              ]}
            />
          }
          frameloop='demand'
          gl={{ antialias: true }}
          onPointerMissed={() => viewerStore.select(null)}
        >
          <color args={['#f8fafc']} attach='background' />
          {data.batches.map((batch) => (
            <HorizonLines
              batch={batch}
              key={batch.horizonId}
              viewerStore={viewerStore}
            />
          ))}
          <SelectionLines
            mine={mine}
            origin={data.origin}
            viewerStore={viewerStore}
          />
          <MineCamera data={data} mine={mine} viewerStore={viewerStore} />
          <SceneHelpers data={data} viewerStore={viewerStore} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}
