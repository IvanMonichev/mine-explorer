import type { ReactNode } from 'react'
import { useLayoutEffect, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import type { CylinderGeometry } from 'three'
import { DynamicDrawUsage, InstancedMesh, Matrix4, Vector3 } from 'three'

interface SectionInstancesProps {
  geometry: CylinderGeometry
  matrices: Float32Array
  indices?: readonly number[]
  radiusScale?: number
  renderOrder?: number
  onSelect?: (sectionIndex: number) => void
  children: ReactNode
}

export const SectionInstances = ({
  geometry,
  matrices,
  indices,
  radiusScale = 1,
  renderOrder = 0,
  onSelect,
  children
}: SectionInstancesProps) => {
  const meshRef = useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  const capacity = matrices.length / 16

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const matrix = new Matrix4()
    const scale = new Vector3(radiusScale, 1, radiusScale)
    mesh.count = indices?.length ?? capacity

    // Видимые секции занимают начало буфера; count исключает скрытые из рендера и выбора.
    for (let index = 0; index < mesh.count; index += 1) {
      matrix.fromArray(matrices, (indices?.[index] ?? index) * 16)
      if (radiusScale !== 1) matrix.scale(scale)
      mesh.setMatrixAt(index, matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
    invalidate()
  }, [capacity, geometry, indices, invalidate, matrices, radiusScale])

  return (
    <instancedMesh
      args={[geometry, undefined, capacity]}
      count={0}
      instanceMatrix-usage={DynamicDrawUsage}
      onClick={(event) => {
        if (!onSelect || event.instanceId === undefined || event.delta > 3)
          return

        event.stopPropagation()
        onSelect(indices?.[event.instanceId] ?? event.instanceId)
      }}
      raycast={onSelect ? InstancedMesh.prototype.raycast : () => {}}
      ref={meshRef}
      renderOrder={renderOrder}
    >
      {children}
    </instancedMesh>
  )
}
