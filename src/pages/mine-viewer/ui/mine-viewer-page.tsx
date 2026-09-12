import { useState } from 'react'

import { Alert, Divider, Layout, Splitter } from 'antd'

import { InfoLayout } from '@/shared/components/info-layout'
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

export const MineViewerPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [sidebarWidth] = useState(readSidebarWidth)
  const {
    viewportRef,
    isFullscreen,
    isPending: isFullscreenPending,
    isSupported: isFullscreenSupported,
    error: fullscreenError,
    toggleFullscreen
  } = useViewportFullscreen()
  const hasSelectedFile = selectedFile !== null

  const openLoadModal = () => {
    setIsLoadModalOpen(true)
  }

  return (
    <Layout className={styles['viewer-layout']}>
      <Toolbar
        onClear={() => {
          setSelectedFile(null)
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
          <aside>
            <TreePanel />
            <Divider className={styles['viewer-divider']} />
            <SelectionPanel />
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
              {fullscreenError && (
                <Alert showIcon title={fullscreenError} type='error' />
              )}
              <InfoLayout
                description={
                  hasSelectedFile
                    ? 'Файл готов к обработке'
                    : 'Схема шахты не загружена'
                }
                title='3D-сцена'
              />
            </Viewport>
          </Content>
        </Splitter.Panel>
      </Splitter>

      <StatusBar hasSelectedFile={hasSelectedFile} />

      <LoadModal
        onCancel={() => {
          setIsLoadModalOpen(false)
        }}
        onLoad={(file) => {
          setSelectedFile(file)
          setIsLoadModalOpen(false)
        }}
        open={isLoadModalOpen}
      />
    </Layout>
  )
}
