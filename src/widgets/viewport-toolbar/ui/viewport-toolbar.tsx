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
    const label = isFullscreen
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
        {[
          {
            label: 'Сетка',
            active: viewerStore.showGrid,
            icon: <TableOutlined aria-hidden />,
            onClick: viewerStore.toggleGrid
          },
          {
            label: 'Куб ориентации',
            active: viewerStore.showOrientation,
            icon: <CompassOutlined aria-hidden />,
            onClick: viewerStore.toggleOrientation
          }
        ].map(({ label, active, icon, onClick }) => (
          <Tooltip
            getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
            key={label}
            placement='bottomLeft'
            title={`${label}: ${active ? 'выключить' : 'включить'}`}
          >
            <span>
              <Button
                aria-label={label}
                aria-pressed={active}
                disabled={!onFitMine}
                icon={icon}
                onClick={onClick}
                size='small'
                type={active ? 'primary' : 'text'}
              />
            </span>
          </Tooltip>
        ))}
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
            isFullscreenSupported ? label : 'Полноэкранный режим недоступен'
          }
        >
          <span>
            <Button
              aria-label={label}
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
