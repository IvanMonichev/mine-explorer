import {
  DeleteOutlined,
  FolderOpenOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import { Button, Tooltip, Typography } from 'antd'

import styles from './toolbar.module.css'

const { Text } = Typography

interface ToolbarProps {
  selectedFile: File | null
  isLoading: boolean
  canClear: boolean
  onOpenLoadModal: () => void
  onOpenAboutModal: () => void
  onClear: () => void
}

export const Toolbar = ({
  selectedFile,
  isLoading,
  canClear,
  onOpenLoadModal,
  onOpenAboutModal,
  onClear
}: ToolbarProps) => (
  <div
    aria-label='Панель инструментов'
    className={styles['toolbar']}
    role='toolbar'
  >
    <Tooltip title='Загрузить схему XML'>
      <Button
        aria-label='Загрузить схему XML'
        icon={<FolderOpenOutlined aria-hidden />}
        loading={isLoading}
        onClick={onOpenLoadModal}
        type='primary'
      />
    </Tooltip>
    <Tooltip title='Очистить'>
      <span>
        <Button
          aria-label='Очистить'
          disabled={!canClear}
          icon={<DeleteOutlined aria-hidden />}
          onClick={onClear}
        />
      </span>
    </Tooltip>
    <Tooltip title='О приложении'>
      <Button
        aria-label='О приложении'
        className={styles['about-button']}
        icon={<QuestionCircleOutlined aria-hidden />}
        onClick={onOpenAboutModal}
        type='text'
      />
    </Tooltip>
  </div>
)
