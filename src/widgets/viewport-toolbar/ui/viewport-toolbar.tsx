import {
  AimOutlined,
  CompassOutlined,
  ExpandOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TableOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'

import type { MineStore } from '@/store/mine'
import type { ViewerStore } from '@/store/viewer'

import styles from './viewport-toolbar.module.css'

interface ViewportToolbarProps {
  mineStore: MineStore
  viewerStore: ViewerStore
  isFullscreen: boolean
  isPending: boolean
  isFullscreenSupported: boolean
  onToggleFullscreen: () => void
  onFitMine?: () => void
}

export const ViewportToolbar = observer(
  ({
    mineStore,
    viewerStore,
    isFullscreen,
    isPending,
    isFullscreenSupported,
    onToggleFullscreen,
    onFitMine
  }: ViewportToolbarProps) => {
    const fullscreenLabel = isFullscreen
      ? 'Выйти из полноэкранного режима'
      : 'На весь экран'
    const selected = viewerStore.selectedEntity
    const selectedEntity =
      selected?.type === 'horizon'
        ? mineStore.mine?.horizons.get(selected.id)
        : selected?.type === 'excavation'
          ? mineStore.mine?.excavations.get(selected.id)
          : undefined

    return (
      <div
        aria-label='Инструменты сцены'
        className={styles['viewport-toolbar']}
        role='toolbar'
      >
        <ConfigProvider wave={{ disabled: true }}>
          <Tooltip
            getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
            placement='bottomLeft'
            title='Сфокусировать камеру на объекте'
          >
            <span>
              <Button
                aria-label='Сфокусировать камеру на объекте'
                className={styles['focus-button']}
                disabled={!onFitMine || !selectedEntity?.sectionIds.length}
                icon={<AimOutlined aria-hidden />}
                onClick={() => viewerStore.requestFocus(selected)}
                size='small'
                type='text'
              />
            </span>
          </Tooltip>
        </ConfigProvider>
        <Tooltip
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
          placement='bottomLeft'
          title={`Сетка: ${viewerStore.showGrid ? 'выключить' : 'включить'}`}
        >
          <span>
            <Button
              aria-label='Сетка'
              aria-pressed={viewerStore.showGrid}
              disabled={!onFitMine}
              icon={<TableOutlined aria-hidden />}
              onClick={viewerStore.toggleGrid}
              size='small'
              type={viewerStore.showGrid ? 'primary' : 'text'}
            />
          </span>
        </Tooltip>
        <Tooltip
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
          placement='bottomLeft'
          title={`Куб ориентации: ${viewerStore.showOrientation ? 'выключить' : 'включить'}`}
        >
          <span>
            <Button
              aria-label='Куб ориентации'
              aria-pressed={viewerStore.showOrientation}
              disabled={!onFitMine}
              icon={<CompassOutlined aria-hidden />}
              onClick={viewerStore.toggleOrientation}
              size='small'
              type={viewerStore.showOrientation ? 'primary' : 'text'}
            />
          </span>
        </Tooltip>

        <Tooltip
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
          placement='bottomLeft'
          title='Показать всю схему'
        >
          <span>
            <Button
              aria-label='Показать всю схему'
              disabled={!onFitMine}
              icon={<ExpandOutlined aria-hidden />}
              onClick={onFitMine}
              size='small'
              type='text'
            />
          </span>
        </Tooltip>
        <Tooltip
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
          placement='bottomLeft'
          title={
            isFullscreenSupported
              ? fullscreenLabel
              : 'Полноэкранный режим недоступен'
          }
        >
          <span>
            <Button
              aria-label={fullscreenLabel}
              aria-pressed={isFullscreen}
              disabled={!isFullscreenSupported}
              icon={
                isFullscreen ? (
                  <FullscreenExitOutlined aria-hidden />
                ) : (
                  <FullscreenOutlined aria-hidden />
                )
              }
              loading={isPending}
              onClick={onToggleFullscreen}
              size='small'
              type='text'
            />
          </span>
        </Tooltip>
      </div>
    )
  }
)
