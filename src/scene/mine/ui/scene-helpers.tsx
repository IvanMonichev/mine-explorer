import { GizmoHelper, GizmoViewcube } from '@react-three/drei'
import { observer } from 'mobx-react-lite'
import { Vector3 } from 'three'

import type { ViewerStore } from '@/store/viewer'

import type { MineSceneData } from '../model/mine-scene-data'

const CUBE_FACES = ['Справа', 'Слева', 'Сверху', 'Снизу', 'Спереди', 'Сзади']

interface SceneHelpersProps {
  data: MineSceneData
  viewerStore: ViewerStore
}

export const SceneHelpers = observer(
  ({ data, viewerStore }: SceneHelpersProps) => {
    const center = data.bounds.getCenter(new Vector3())
    const size = data.bounds.getSize(new Vector3())
    const gridSize = Math.max(size.x, size.z, 1) * 1.25

    return (
      <>
        {viewerStore.showGrid && (
          <gridHelper
            args={[gridSize, 20, '#aeb8c4', '#d4dae2']}
            material-depthWrite={false}
            material-opacity={0.65}
            material-transparent
            position={[center.x, center.y, center.z]}
            raycast={() => {}}
          />
        )}
        {viewerStore.showOrientation && (
          <GizmoHelper alignment='bottom-right' margin={[72, 72]}>
            <GizmoViewcube
              color='#f8fafc'
              faces={CUBE_FACES}
              font='16px Arial, sans-serif'
              hoverColor='#dbe4ee'
              onClick={(event) => {
                event.stopPropagation()
                if (event.delta > 3) return null

                const direction = event.object.position.lengthSq()
                  ? event.object.position
                  : event.face?.normal
                if (direction) {
                  viewerStore.requestCameraDirection({
                    x: direction.x,
                    y: direction.y,
                    z: direction.z
                  })
                }
                return null
              }}
              strokeColor='#94a3b8'
              textColor='#334155'
            />
          </GizmoHelper>
        )}
      </>
    )
  }
)
