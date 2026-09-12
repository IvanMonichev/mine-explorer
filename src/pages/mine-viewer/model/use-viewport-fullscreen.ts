import { useEffect, useRef, useState } from 'react'

export const useViewportFullscreen = () => {
  const viewportRef = useRef<HTMLElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    const viewport = viewportRef.current
    if (!viewport || isPending) return

    setError(null)
    setIsPending(true)

    try {
      if (document.fullscreenElement === viewport) {
        await document.exitFullscreen()
      } else {
        await viewport.requestFullscreen()
      }
    } catch {
      setError(
        'Не удалось переключить полноэкранный режим. Попробуйте ещё раз.'
      )
    } finally {
      setIsPending(false)
    }
  }

  return {
    viewportRef,
    isFullscreen,
    isPending,
    isSupported: document.fullscreenEnabled,
    error,
    toggleFullscreen
  }
}
