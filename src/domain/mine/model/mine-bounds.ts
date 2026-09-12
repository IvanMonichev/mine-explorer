import type { Position3D } from '@/shared/types/position-3d'

/** Границы шахты по осям координат, вычисленные по исходным позициям узлов. */
export interface MineBounds {
  readonly min: Position3D
  readonly max: Position3D
}
