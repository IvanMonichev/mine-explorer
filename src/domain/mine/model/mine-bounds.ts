import type { Position3D } from '@/shared/types/position-3d'

/** Axis-aligned bounds of the mine's nodes in source coordinates. */
export interface MineBounds {
  readonly min: Position3D
  readonly max: Position3D
}
