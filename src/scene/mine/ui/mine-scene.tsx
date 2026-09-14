import { useEffect, useMemo } from 'react'

import { Canvas } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { CylinderGeometry } from 'three'

import { InfoLayout } from '@/shared/components/info-layout'
import { useRootStore } from '@/store/root'

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

export const MineScene = observer(() => {
  const { mineStore, viewerStore } = useRootStore()
  const mine = mineStore.mine
  const data = useMemo(() => (mine ? buildSceneData(mine) : null), [mine])
  const geometry = useMemo(
    () => new CylinderGeometry(1, 1, 1, SECTION_RADIAL_SEGMENTS),
    []
  )

  // Освобождаем ресурсы общей геометрии секций при её замене или удалении сцены.
  useEffect(() => () => geometry.dispose(), [geometry])

  if (!mine || !data) return null

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
            />
          ))}
          <SelectionInstances
            geometry={geometry}
            mine={mine}
            origin={data.origin}
          />
          <MineCamera data={data} mine={mine} />
          <SceneHelpers data={data} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
})
