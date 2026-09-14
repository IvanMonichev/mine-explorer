import {
  BuildOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  NodeIndexOutlined
} from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'

import { getCategoryColor } from '@/shared/utils/get-category-color'
import { useRootStore } from '@/store/root'

import type { MineTreeNode } from '../model/mine-tree-node'

import styles from './tree-panel.module.css'

interface TreeNodeTitleProps {
  node: MineTreeNode
}

export const TreeNodeTitle = observer(({ node }: TreeNodeTitleProps) => {
  const { viewerStore } = useRootStore()
  const isHorizon = node.entity.type === 'horizon'
  const isParentHidden =
    !isHorizon && !viewerStore.isHorizonVisible(node.horizonId)
  const isVisible = isHorizon
    ? viewerStore.isHorizonVisible(node.entity.id)
    : viewerStore.isExcavationVisible(node.entity.id, node.horizonId)
  const visibilityLabel = `${isVisible ? 'Скрыть' : 'Показать'} ${isHorizon ? 'горизонт' : 'выработку'} «${node.title}»`

  return (
    <span className={styles['node-title']}>
      <span
        className={[styles['node-label'], !isVisible && styles['node-hidden']]
          .filter(Boolean)
          .join(' ')}
        title={node.title}
      >
        {isHorizon ? (
          <BuildOutlined
            aria-hidden
            style={{
              color: isVisible ? getCategoryColor(node.horizonId) : undefined
            }}
          />
        ) : (
          <NodeIndexOutlined
            aria-hidden
            style={{
              color: isVisible ? getCategoryColor(node.horizonId) : undefined
            }}
          />
        )}
        <span className={styles['node-name']}>{node.title}</span>
      </span>
      <span
        aria-label={`Секций: ${node.sectionCount}`}
        className={styles['section-count']}
        title={`Секций: ${node.sectionCount}`}
      >
        {node.sectionCount}
      </span>
      <Tooltip
        getPopupContainer={(trigger) =>
          trigger.closest<HTMLElement>(':fullscreen') ?? document.body
        }
        title={isParentHidden ? 'Сначала покажите горизонт' : visibilityLabel}
      >
        <span
          className={styles['visibility-control']}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Button
            aria-label={visibilityLabel}
            aria-pressed={!isVisible}
            className={styles['visibility-button']}
            disabled={isParentHidden}
            icon={
              isVisible ? (
                <EyeOutlined aria-hidden />
              ) : (
                <EyeInvisibleOutlined aria-hidden />
              )
            }
            onClick={() => {
              if (isHorizon) viewerStore.toggleHorizon(node.entity.id)
              else viewerStore.toggleExcavation(node.entity.id)
            }}
            size='small'
            type='text'
          />
        </span>
      </Tooltip>
    </span>
  )
})
