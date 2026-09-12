import type { Mine } from '../model/mine'
import type { MineBounds } from '../model/mine-bounds'

/** Returns undefined for a mine without nodes. Does not normalize positions. */
export const getMineBounds = (mine: Mine): MineBounds | undefined => {
  if (mine.nodes.size === 0) return undefined

  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  for (const { position } of mine.nodes.values()) {
    minX = Math.min(minX, position.x)
    minY = Math.min(minY, position.y)
    minZ = Math.min(minZ, position.z)
    maxX = Math.max(maxX, position.x)
    maxY = Math.max(maxY, position.y)
    maxZ = Math.max(maxZ, position.z)
  }

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ }
  }
}
