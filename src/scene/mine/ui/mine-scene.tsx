import { useEffect, useMemo } from 'react'

import { Canvas } from '@react-three/fiber'
import { CylinderGeometry } from 'three'

import type { Mine } from '@/domain/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import type { ViewerStore } from '@/store/viewer'

import { buildSceneData } from '../lib/build-scene-data'
import {
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_SETTINGS,
  MINE_SCENE_BACKGROUND_COLOR,
  MINE_SCENE_CANVAS_SETTINGS,
  SECTION_RADIAL_SEGMENTS
} from '../model/constants'

import { HorizonInstances } from './horizon-instances'
import { MineCamera } from './mine-camera'
import styles from './mine-scene.module.css'
import { SceneErrorBoundary } from './scene-error-boundary'
import { SceneHelpers } from './scene-helpers'
import { SelectionInstances } from './selection-instances'

interface MineSceneProps {
  mine: Mine
  viewerStore: ViewerStore
}

export const MineScene = ({ mine, viewerStore }: MineSceneProps) => {
  const data = useMemo(() => buildSceneData(mine), [mine])
  const geometry = useMemo(
    () => new CylinderGeometry(1, 1, 1, SECTION_RADIAL_SEGMENTS),
    []
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <SceneErrorBoundary>
      <div className={styles['mine-scene']}>
        <Canvas
          {...MINE_SCENE_CANVAS_SETTINGS}
          aria-label='3D-схема шахты'
          fallback={
            <InfoLayout
              conditions={[
                { condition: true, text: 'WebGL недоступен в браузере' }
              ]}
            />
          }
          onCreated={({ gl }) => {
            gl.domElement.tabIndex = 0
            gl.domElement.setAttribute(
              'aria-label',
              '3D-схема шахты. WASD — движение, Q/E — вниз/вверх, Shift — ускорение'
            )
          }}
          onPointerMissed={() => viewerStore.select(null)}
        >
          <color args={[MINE_SCENE_BACKGROUND_COLOR]} attach='background' />
          <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
          <directionalLight {...DIRECTIONAL_LIGHT_SETTINGS} />
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
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}
