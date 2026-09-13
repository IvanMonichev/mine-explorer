import { useLayoutEffect, useRef } from 'react'

import { addAfterEffect, useFrame, useThree } from '@react-three/fiber'

import type { ViewerStore } from '@/store/viewer'

export const SceneMetrics = ({ viewerStore }: { viewerStore: ViewerStore }) => {
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)
  const renderedFrame = useRef(false)

  useLayoutEffect(() => {
    const previousAutoReset = gl.info.autoReset
    // Суммируем основную сцену и отдельный проход куба ориентации.
    gl.info.autoReset = false

    const unsubscribe = addAfterEffect(() => {
      if (!renderedFrame.current) return
      renderedFrame.current = false

      const { triangles, points } = gl.info.render
      viewerStore.setRenderMetrics({ triangles, points })
    })
    invalidate()

    return () => {
      unsubscribe()
      renderedFrame.current = false
      gl.info.autoReset = previousAutoReset
      viewerStore.setRenderMetrics(null)
    }
  }, [gl, invalidate, viewerStore])

  useFrame(() => {
    gl.info.reset()
    renderedFrame.current = true
  }, -100)

  return null
}
