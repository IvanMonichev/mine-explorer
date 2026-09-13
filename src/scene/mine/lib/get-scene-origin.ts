import type { MineBounds } from '@/domain/mine'
import type { Position3D } from '@/shared/types/position-3d'

export const getSceneOrigin = (bounds: MineBounds | undefined): Position3D => {
  if (!bounds) return { x: 0, y: 0, z: 0 }

  return {
    x: (bounds.min.x + bounds.max.x) / 2,
    y: (bounds.min.y + bounds.max.y) / 2,
    z: (bounds.min.z + bounds.max.z) / 2
  }
}
