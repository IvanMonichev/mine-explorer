import type { TreeDataNode } from 'antd'

import type { SelectedEntityRef } from '@/domain/mine'

export interface MineTreeNode extends TreeDataNode {
  key: string
  title: string
  entity: Extract<SelectedEntityRef, { type: 'horizon' | 'excavation' }>
  horizonId: number
  sectionCount: number
  children?: MineTreeNode[]
}
