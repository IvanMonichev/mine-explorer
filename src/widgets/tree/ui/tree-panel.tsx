import { Tag, Tree } from 'antd'

import { Panel } from '@/shared/components/panel'

import styles from './tree-panel.module.css'

const emptyTreeData = [
  {
    disabled: true,
    key: 'empty',
    title: 'Горизонты не загружены'
  }
]

export const TreePanel = () => (
  <Panel
    className={styles['viewer-tree-panel']}
    extra={<Tag>Горизонт → Выработка</Tag>}
    title='Структура шахты'
  >
    <Tree
      blockNode
      className={styles['viewer-tree']}
      defaultExpandAll
      selectable={false}
      treeData={emptyTreeData}
    />
  </Panel>
)
