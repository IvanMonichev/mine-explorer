import { useEffect, useMemo } from 'react'

import { Canvas } from '@react-three/fiber'
import { CylinderGeometry } from 'three'

import type { Mine } from '@/domain/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import type { ViewerStore } from '@/store/viewer'

import { buildSceneData } from '../lib/build-scene-data'

import { HorizonInstances } from './horizon-instances'
import { MineCamera } from './mine-camera'
import styles from './mine-scene.module.css'
import { SceneErrorBoundary } from './scene-error-boundary'
import { SceneHelpers } from './scene-helpers'
import { SceneMetrics } from './scene-metrics'
import { SelectionInstances } from './selection-instances'

interface MineSceneProps {
  mine: Mine
  viewerStore: ViewerStore
}

export const MineScene = ({ mine, viewerStore }: MineSceneProps) => {
  const data = useMemo(() => buildSceneData(mine), [mine])
  const geometry = useMemo(() => new CylinderGeometry(1, 1, 1, 8), [])

  useEffect(() => () => geometry.dispose(), [geometry])

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
          <ambientLight intensity={0.8} />
          <directionalLight intensity={1.5} position={[1, 2, 3]} />
          {data.batches.map((batch) => (
            <HorizonInstances
              batch={batch}
              geometry={geometry}
              key={batch.horizonId}
              viewerStore={viewerStore}
            />
          ))}
          <SelectionInstances
            geometry={geometry}
            mine={mine}
            origin={data.origin}
            viewerStore={viewerStore}
          />
          <MineCamera data={data} mine={mine} viewerStore={viewerStore} />
          <SceneHelpers data={data} viewerStore={viewerStore} />
          <SceneMetrics viewerStore={viewerStore} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}
