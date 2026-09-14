import {
  AimOutlined,
  CompassOutlined,
  ExpandOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  TableOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'

import { useRootStore } from '@/store/root'

import styles from './viewport-toolbar.module.css'

interface ViewportToolbarProps {
  isFullscreen: boolean
  isPending: boolean
  isFullscreenSupported: boolean
  onToggleFullscreen: () => void
}

export const ViewportToolbar = observer(
  ({
    isFullscreen,
    isPending,
    isFullscreenSupported,
    onToggleFullscreen
  }: ViewportToolbarProps) => {
    const { mineStore, viewerStore } = useRootStore()
    const canRenderMine =
      Boolean(mineStore.mine?.sections.size) && !mineStore.isLoading
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
                disabled={!canRenderMine || !selectedEntity?.sectionIds.length}
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
              disabled={!canRenderMine}
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
              disabled={!canRenderMine}
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
              disabled={!canRenderMine}
              icon={<ExpandOutlined aria-hidden />}
              onClick={() => viewerStore.requestFocus(null)}
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
        <Tooltip
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
          placement='bottomLeft'
          title={
            <>
              W: вперёд
              <br />
              S: назад
              <br />
              A: влево
              <br />
              D: вправо
              <br />
              Q: вниз
              <br />
              E: вверх
              <br />
              Shift + клавиша движения: ускорение
              <br />
              ЛКМ + движение мыши: поворот камеры
            </>
          }
        >
          <Button
            aria-label='Управление камерой'
            icon={<QuestionCircleOutlined aria-hidden />}
            size='small'
            type='text'
          />
        </Tooltip>
      </div>
    )
  }
)
