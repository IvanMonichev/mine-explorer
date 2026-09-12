import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

import styles from './viewport-toolbar.module.css'

interface ViewportToolbarProps {
  isFullscreen: boolean
  isPending: boolean
  isFullscreenSupported: boolean
  onToggleFullscreen: () => void
}

export const ViewportToolbar = ({
  isFullscreen,
  isPending,
  isFullscreenSupported,
  onToggleFullscreen
}: ViewportToolbarProps) => {
  const label = isFullscreen
    ? 'Выйти из полноэкранного режима'
    : 'На весь экран'

  return (
    <div
      aria-label='Инструменты сцены'
      className={styles['viewport-toolbar']}
      role='toolbar'
    >
      <Tooltip
        getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
        placement='bottomRight'
        title={isFullscreenSupported ? label : 'Полноэкранный режим недоступен'}
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
