import { useCallback, useEffect, useRef, useState } from 'react'

import { Alert, Layout, Splitter } from 'antd'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import defaultMineUrl from '@/assets/data/mim-scheme-hUPL7S.xml?url'
import { loadMim } from '@/infrastructure/mim'
import { MineScene } from '@/scene/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import { LoadLayout } from '@/shared/components/load-layout'
import { useRootStore } from '@/store/root'
import { AboutModal } from '@/widgets/about'
import { LoadModal } from '@/widgets/load'
import { SelectionPanel } from '@/widgets/selection'
import { StatusBar } from '@/widgets/status-bar'
import { Toolbar } from '@/widgets/toolbar'
import { TreePanel } from '@/widgets/tree'
import { Viewport } from '@/widgets/viewport'
import { ViewportToolbar } from '@/widgets/viewport-toolbar'

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  readSidebarWidth,
  saveSidebarWidth
} from '../model/sidebar-width'
import { useViewerFullscreen } from '../model/use-viewer-fullscreen'

import styles from './mine-viewer-page.module.css'

const { Content } = Layout

export const MineViewerPage = observer(() => {
  const { mineStore, viewerStore } = useRootStore()
  const loadRequestId = useRef(0)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [sidebarWidth] = useState(readSidebarWidth)
  const {
    viewerRef,
    isFullscreen,
    isPending: isFullscreenPending,
    isSupported: isFullscreenSupported,
    error: fullscreenError,
    toggleFullscreen
  } = useViewerFullscreen()
  const openLoadModal = () => {
    setIsLoadModalOpen(true)
  }

  const handleClear = () => {
    loadRequestId.current += 1
    runInAction(() => {
      mineStore.clear()
      viewerStore.clear()
    })
  }

  const handleLoad = useCallback(
    async (source: File | Promise<File>) => {
      const requestId = ++loadRequestId.current
      setIsLoadModalOpen(false)
      mineStore.startLoading()

      try {
        const file = await source
        if (requestId !== loadRequestId.current) return

        const mine = await loadMim(file)
        if (requestId !== loadRequestId.current) return

        runInAction(() => {
          mineStore.setMine(mine)
          viewerStore.clear()
        })
        console.log('Схема шахты:', mine)
      } catch (error) {
        if (requestId !== loadRequestId.current) return

        mineStore.setError(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить схему шахты.'
        )
        console.error('Не удалось загрузить схему шахты:', error)
      }
    },
    [mineStore, viewerStore]
  )

  // Загружаем начальную схему при открытии страницы; при очистке отменяем запрос
  // и помечаем его результат устаревшим, чтобы он не обновил хранилище.
  useEffect(() => {
    const controller = new AbortController()

    const readDefaultFile = async () => {
      const response = await fetch(defaultMineUrl, {
        signal: controller.signal
      })
      if (!response.ok) {
        throw new Error(
          `Не удалось загрузить начальную схему: ${response.status} ${response.statusText}`
        )
      }

      return new File([await response.arrayBuffer()], 'min-scheme-hUPL7S.xml', {
        type: 'application/xml'
      })
    }

    void handleLoad(readDefaultFile())

    return () => {
      loadRequestId.current += 1
      controller.abort()
    }
  }, [handleLoad])

  return (
    <Layout className={styles['viewer-layout']}>
      <Toolbar
        onClear={handleClear}
        onOpenAboutModal={() => {
          setIsAboutModalOpen(true)
        }}
        onOpenLoadModal={openLoadModal}
      />

      <section
        aria-label='Просмотр схемы шахты'
        className={styles['viewer-workspace']}
        ref={viewerRef}
      >
        <Splitter
          className={styles['viewer-body']}
          onResizeEnd={([width]) => {
            saveSidebarWidth(width)
          }}
        >
          <Splitter.Panel
            className={styles['viewer-sidebar']}
            defaultSize={sidebarWidth}
            max={MAX_SIDEBAR_WIDTH}
            min={MIN_SIDEBAR_WIDTH}
          >
            <aside className={styles['viewer-sidebar-content']}>
              <TreePanel />
            </aside>
          </Splitter.Panel>

          <Splitter.Panel className={styles['viewer-viewport-panel']} min={360}>
            <Content className={styles['viewer-content']}>
              <Viewport
                toolbar={
                  <ViewportToolbar
                    isFullscreen={isFullscreen}
                    isFullscreenSupported={isFullscreenSupported}
                    isPending={isFullscreenPending}
                    onToggleFullscreen={toggleFullscreen}
                  />
                }
              >
                <div className={styles['viewer-selection']}>
                  <SelectionPanel />
                </div>
                {fullscreenError && (
                  <Alert showIcon title={fullscreenError} type='error' />
                )}
                <LoadLayout
                  isLoading={mineStore.isLoading}
                  message='Загрузка схемы…'
                >
                  <InfoLayout
                    conditions={[
                      {
                        condition: !mineStore.mine,
                        text: 'Схема шахты не загружена'
                      },
                      {
                        condition: mineStore.mine?.sections.size === 0,
                        text: 'В схеме нет секций для отображения'
                      }
                    ]}
                  >
                    <MineScene />
                  </InfoLayout>
                </LoadLayout>
              </Viewport>
            </Content>
          </Splitter.Panel>
        </Splitter>
      </section>

      <StatusBar />

      <AboutModal
        onCancel={() => {
          setIsAboutModalOpen(false)
        }}
        open={isAboutModalOpen}
      />

      <LoadModal
        onCancel={() => {
          setIsLoadModalOpen(false)
        }}
        onLoad={handleLoad}
        open={isLoadModalOpen}
      />
    </Layout>
  )
})
