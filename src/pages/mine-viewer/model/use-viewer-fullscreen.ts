import { useEffect, useRef, useState } from 'react'

export const useViewerFullscreen = () => {
  const viewerRef = useRef<HTMLElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    const viewer = viewerRef.current
    if (!viewer || isPending) return

    setError(null)
    setIsPending(true)

    try {
      if (document.fullscreenElement === viewer) {
        await document.exitFullscreen()
      } else {
        await viewer.requestFullscreen()
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
    viewerRef,
    isFullscreen,
    isPending,
    isSupported: document.fullscreenEnabled,
    error,
    toggleFullscreen
  }
}
