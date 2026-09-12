import { AimOutlined } from '@ant-design/icons'
import type { DescriptionsProps } from 'antd'
import { Button, Descriptions, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'

import type { MineStore } from '@/store/mine'
import type { ViewerStore } from '@/store/viewer'

import styles from './selection-panel.module.css'

interface SelectionPanelProps {
  mineStore: MineStore
  viewerStore: ViewerStore
  onFocus?: () => void
}

export const SelectionPanel = observer(
  ({ mineStore, viewerStore, onFocus }: SelectionPanelProps) => {
    const mine = mineStore.mine
    const selected = viewerStore.selectedEntity
    const horizon =
      selected?.type === 'horizon' ? mine?.horizons.get(selected.id) : undefined
    const excavation =
      selected?.type === 'excavation'
        ? mine?.excavations.get(selected.id)
        : undefined
    const entity = horizon ?? excavation

    if (!entity) return null

    const items: DescriptionsProps['items'] = [
      {
        key: 'type',
        label: 'Тип объекта',
        children: horizon ? 'Горизонт' : 'Выработка'
      },
      { key: 'id', label: 'Идентификатор', children: entity.id }
    ]

    if (horizon) {
      items.push(
        {
          key: 'altitude',
          label: 'Высотная отметка, м',
          children: horizon.altitude
        },
        {
          key: 'excavations',
          label: 'Число выработок',
          children: horizon.excavationIds.length
        }
      )
    }

    if (excavation) {
      items.push({
        key: 'horizon',
        label: 'Горизонт',
        children: mine?.horizons.get(excavation.horizonId)?.name ?? '—'
      })
    }

    const isVisible = horizon
      ? viewerStore.isHorizonVisible(horizon.id)
      : excavation
        ? viewerStore.isExcavationVisible(excavation.id, excavation.horizonId)
        : false

    items.push(
      {
        key: 'sections',
        label: 'Число секций',
        children: entity.sectionIds.length
      },
      {
        key: 'visibility',
        label: 'Отображение',
        children: isVisible ? 'Включено' : 'Выключено'
      }
    )

    return (
      <Descriptions
        aria-label={entity.name}
        bordered
        className={styles['entity-details']}
        column={1}
        extra={
          <Tooltip
            getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
            title={
              onFocus
                ? 'Сфокусировать камеру на объекте'
                : 'Фокусировка станет доступна после подключения 3D-сцены'
            }
          >
            <span className={styles['focus-control']}>
              <Button
                aria-label='Сфокусировать камеру на объекте'
                disabled={!onFocus}
                icon={<AimOutlined aria-hidden />}
                onClick={onFocus}
                size='small'
                type='text'
              />
            </span>
          </Tooltip>
        }
        items={items}
        size='small'
        title={entity.name}
      />
    )
  }
)
