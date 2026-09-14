import { useEffect, useRef } from 'react'

import { useThree } from '@react-three/fiber'

const MOVEMENT_CODES = new Set(['KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE'])
const SHIFT_CODES = new Set(['ShiftLeft', 'ShiftRight'])

export const useCameraKeyboard = (onMoveStart: () => void) => {
  const pressedKeys = useRef(new Set<string>())
  const { gl, invalidate } = useThree()

  // Подключаем управление камерой с клавиатуры, пока сцена в фокусе.
  // Сбрасываем зажатые клавиши при потере фокуса и удаляем обработчики при очистке.
  useEffect(() => {
    const canvas = gl.domElement
    const keys = pressedKeys.current
    const reset = () => keys.clear()
    const focus = () => canvas.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) {
        reset()
        return
      }
      if (document.activeElement !== canvas) return
      const isMovement = MOVEMENT_CODES.has(event.code)
      if (!isMovement && !SHIFT_CODES.has(event.code)) return

      // Shift мог быть зажат до того, как сцена получила фокус.
      if (event.shiftKey) keys.add('Shift')
      else keys.delete('Shift')
      if (isMovement) {
        event.preventDefault()
        if (!keys.has(event.code)) onMoveStart()
        keys.add(event.code)
        invalidate()
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.code)
      if (!event.shiftKey) keys.delete('Shift')
    }
    const onVisibilityChange = () => {
      if (document.hidden) reset()
    }

    canvas.addEventListener('pointerdown', focus)
    canvas.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('blur', reset)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      reset()
      canvas.removeEventListener('pointerdown', focus)
      canvas.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('blur', reset)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [gl, invalidate, onMoveStart])

  return pressedKeys
}
