import type { ComponentRef, Key } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Alert, Input, Tree } from 'antd'
import { observer } from 'mobx-react-lite'

import type { Mine, SelectedEntityRef } from '@/domain/mine'
import { InfoLayout } from '@/shared/components/info-layout'
import { LoadLayout } from '@/shared/components/load-layout'
import { Panel } from '@/shared/components/panel'
import { useRootStore } from '@/store/root'

import { buildTreeData } from '../lib/build-tree-data'
import { filterTreeData } from '../lib/filter-tree-data'
import type { MineTreeNode } from '../model/mine-tree-node'

import { TreeNodeTitle } from './tree-node-title'
import styles from './tree-panel.module.css'

const TREE_ITEM_HEIGHT = 28

interface MineTreeProps {
  mine: Mine
  search: string
  expandedKeys: Key[]
  onExpand: (keys: Key[]) => void
}

const MineTree = observer(
  ({ mine, search, expandedKeys, onExpand }: MineTreeProps) => {
    const { viewerStore } = useRootStore()
    const containerRef = useRef<HTMLDivElement>(null)
    const treeRef = useRef<ComponentRef<typeof Tree>>(null)
    const anchoredSelectionRef = useRef<SelectedEntityRef | null>(null)
    const [height, setHeight] = useState(1)
    const treeData = useMemo(() => buildTreeData(mine), [mine])
    const filteredTreeData = useMemo(
      () => filterTreeData(treeData, search),
      [treeData, search]
    )
    const selected = viewerStore.selectedEntity

    // Подстраиваем высоту виртуализированного дерева под контейнер
    // и отключаем наблюдение за размером при удалении компонента.
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const resizeObserver = new ResizeObserver(([entry]) => {
        setHeight(Math.max(1, entry.contentRect.height))
      })
      resizeObserver.observe(container)

      return () => resizeObserver.disconnect()
    }, [])

    // Один раз прокручиваем дерево к центру выбранного узла, когда он доступен
    // с учётом фильтра, раскрытых горизонтов и высоты контейнера.
    useEffect(() => {
      if (!selected) {
        anchoredSelectionRef.current = null
        return
      }
      if (height <= 1 || anchoredSelectionRef.current === selected) return

      const key = `${selected.type}:${selected.id}`
      const parent = filteredTreeData.find(
        (horizon) =>
          horizon.key === key ||
          horizon.children?.some((node) => node.key === key)
      )
      if (!parent || (parent.key !== key && !expandedKeys.includes(parent.key)))
        return

      const frame = requestAnimationFrame(() => {
        const tree = treeRef.current
        if (!tree) return

        tree.scrollTo({
          key,
          align: 'top',
          offset: Math.max(0, (height - TREE_ITEM_HEIGHT) / 2)
        })
        anchoredSelectionRef.current = selected
      })
      return () => cancelAnimationFrame(frame)
    }, [expandedKeys, filteredTreeData, height, selected])

    return (
      <div className={styles['tree-container']} ref={containerRef}>
        <InfoLayout
          conditions={[
            {
              condition: filteredTreeData.length === 0,
              text: 'Ничего не найдено'
            }
          ]}
        >
          <Tree<MineTreeNode>
            aria-label='Горизонты и выработки'
            blockNode
            className={styles['viewer-tree']}
            expandedKeys={expandedKeys}
            height={height}
            itemHeight={TREE_ITEM_HEIGHT}
            motion={null}
            onExpand={onExpand}
            onSelect={(_, { node, selected }) => {
              viewerStore.select(selected ? node.entity : null)
            }}
            ref={treeRef}
            selectedKeys={selected ? [`${selected.type}:${selected.id}`] : []}
            titleRender={(node) => <TreeNodeTitle node={node} />}
            treeData={filteredTreeData}
          />
        </InfoLayout>
      </div>
    )
  }
)

export const TreePanel = observer(() => {
  const { mineStore, viewerStore } = useRootStore()
  const [search, setSearch] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const mine = mineStore.mine
  const selected = viewerStore.selectedEntity

  // Показываем выбранную выработку в дереве: раскрываем её горизонт
  // и сбрасываем поиск, если он скрывает выбранный узел.
  useEffect(() => {
    if (!mine || selected?.type !== 'excavation') return

    const excavation = mine.excavations.get(selected.id)
    if (!excavation) return

    const horizon = mine.horizons.get(excavation.horizonId)
    const key = `horizon:${excavation.horizonId}`
    setExpandedKeys((keys) => (keys.includes(key) ? keys : [...keys, key]))
    setSearch((value) => {
      const query = value.trim().toLowerCase()
      return excavation.name.toLowerCase().includes(query) ||
        horizon?.name.toLowerCase().includes(query)
        ? value
        : ''
    })
  }, [mine, selected])

  return (
    <Panel className={styles['viewer-tree-panel']}>
      <h2 className={styles['tree-heading']}>Структура шахты</h2>
      <div className={styles['tree-search']}>
        <Input
          allowClear
          aria-label='Поиск по дереву'
          disabled={!mineStore.mine?.horizons.size || mineStore.isLoading}
          onChange={(event) => {
            const value = event.target.value
            setSearch(value)
            setExpandedKeys(
              value.trim()
                ? Array.from(
                    mineStore.mine?.horizons.keys() ?? [],
                    (id) => `horizon:${id}`
                  )
                : []
            )
          }}
          placeholder='Поиск по названию'
          prefix={<SearchOutlined aria-hidden />}
          size='small'
          value={search}
        />
      </div>
      {mineStore.error && (
        <Alert
          className={styles['load-error']}
          showIcon
          title={mineStore.error}
          type='error'
        />
      )}
      <LoadLayout isLoading={mineStore.isLoading} message='Загрузка схемы…'>
        <InfoLayout
          conditions={[
            {
              condition: !mineStore.mine,
              text: 'Схема шахты не загружена'
            },
            {
              condition: mineStore.mine?.horizons.size === 0,
              text: 'В схеме нет горизонтов'
            }
          ]}
        >
          {mineStore.mine && (
            <MineTree
              expandedKeys={expandedKeys}
              mine={mineStore.mine}
              onExpand={setExpandedKeys}
              search={search}
            />
          )}
        </InfoLayout>
      </LoadLayout>
    </Panel>
  )
})
