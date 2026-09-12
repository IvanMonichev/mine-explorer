import { Empty } from 'antd'

import { Panel } from '@/shared/components/panel'

import styles from './selection-panel.module.css'

export const SelectionPanel = () => (
  <Panel title='Выбранный объект'>
    <Empty
      className={styles['viewer-empty']}
      description='Ничего не выбрано'
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  </Panel>
)
