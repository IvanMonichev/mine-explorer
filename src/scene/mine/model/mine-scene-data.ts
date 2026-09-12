import type { Box3 } from 'three'

import type { Section } from '@/domain/section'
import type { Position3D } from '@/shared/types/position-3d'

export interface HorizonBatch {
  horizonId: number
  sections: Section[]
  matrices: Float32Array
}

export interface MineSceneData {
  origin: Position3D
  bounds: Box3
  batches: HorizonBatch[]
}
