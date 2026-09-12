import type { Position3D } from '@/shared/types/position-3d'

export interface MineNode {
  readonly id: number
  readonly guid: string
  /** Coordinates in the source scheme's coordinate system. */
  readonly position: Position3D
}
