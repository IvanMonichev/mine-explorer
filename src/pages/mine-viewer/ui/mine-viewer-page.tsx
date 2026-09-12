import { useRef, useState } from 'react'

import { Alert, Layout, Splitter } from 'antd'
import { observer } from 'mobx-react-lite'

import { loadMim } from '@/infrastructure/mim'
import { InfoLayout } from '@/shared/components/info-layout'
import { LoadLayout } from '@/shared/components/load-layout'
import { MineStore } from '@/store/mine'
import { ViewerStore } from '@/store/viewer'
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
import { useViewportFullscreen } from '../model/use-viewport-fullscreen'

import styles from './mine-viewer-page.module.css'

const { Content } = Layout

export const MineViewerPage = observer(() => {
  const [mineStore] = useState(() => new MineStore())
  const [viewerStore] = useState(() => new ViewerStore())
  const loadRequestId = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [sidebarWidth] = useState(readSidebarWidth)
  const {
    viewportRef,
    isFullscreen,
    isPending: isFullscreenPending,
    isSupported: isFullscreenSupported,
    error: fullscreenError,
    toggleFullscreen
  } = useViewportFullscreen()
  const openLoadModal = () => {
    setIsLoadModalOpen(true)
  }

  const handleClear = () => {
    loadRequestId.current += 1
    mineStore.clear()
    viewerStore.clear()
    setSelectedFile(null)
  }

  const handleLoad = async (file: File) => {
    const requestId = ++loadRequestId.current
    setIsLoadModalOpen(false)
    mineStore.startLoading()

    try {
      const mine = await loadMim(file)
      if (requestId !== loadRequestId.current) return

      mineStore.setMine(mine)
      viewerStore.clear()
      setSelectedFile(file)
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
  }

  return (
    <Layout className={styles['viewer-layout']}>
      <Toolbar
        canClear={Boolean(
          mineStore.mine || mineStore.error || mineStore.isLoading
        )}
        isLoading={mineStore.isLoading}
        onClear={handleClear}
        onOpenAboutModal={() => {
          setIsAboutModalOpen(true)
        }}
        onOpenLoadModal={openLoadModal}
        selectedFile={selectedFile}
      />

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
            <TreePanel mineStore={mineStore} viewerStore={viewerStore} />
          </aside>
        </Splitter.Panel>

        <Splitter.Panel className={styles['viewer-viewport-panel']} min={360}>
          <Content className={styles['viewer-content']}>
            <Viewport
              ref={viewportRef}
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
                <SelectionPanel mineStore={mineStore} viewerStore={viewerStore} />
              </div>
              {fullscreenError && (
                <Alert showIcon title={fullscreenError} type='error' />
              )}
              {mineStore.isLoading ? (
                <LoadLayout message='Загрузка схемы…' />
              ) : (
                <InfoLayout
                  conditions={[
                    {
                      condition: !mineStore.mine,
                      text: 'Схема шахты не загружена'
                    },
                    {
                      condition: Boolean(mineStore.mine),
                      text: 'Схема загружена. Выберите объект в дереве.'
                    }
                  ]}
                />
              )}
            </Viewport>
          </Content>
        </Splitter.Panel>
      </Splitter>

      <StatusBar mineStore={mineStore} />

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
