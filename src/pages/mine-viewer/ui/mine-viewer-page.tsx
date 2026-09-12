import { useState } from 'react'

import { Divider, Layout } from 'antd'

import { MineScenePlaceholder } from '@/scene/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import { LoadModal } from '@/widgets/load'
import { SelectionPanel } from '@/widgets/selection'
import { StatusBar } from '@/widgets/status-bar'
import { Toolbar } from '@/widgets/toolbar'
import { TreePanel } from '@/widgets/tree'

import styles from './mine-viewer-page.module.css'

const { Content, Sider } = Layout

export const MineViewerPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
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

      <Layout className={styles['viewer-body']}>
        <Sider className={styles['viewer-sidebar']} theme='light' width={360}>
          <TreePanel />
          <Divider className={styles['viewer-divider']} />
          <SelectionPanel />
        </Sider>

        <Content className={styles['viewer-content']}>
          <MineScenePlaceholder>
            <InfoLayout
              description={
                hasSelectedFile
                  ? 'Файл готов к обработке'
                  : 'Схема шахты не загружена'
              }
              title='3D-сцена'
            />
          </MineScenePlaceholder>
        </Content>
      </Layout>

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
