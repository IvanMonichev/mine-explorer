import { DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Button, Tooltip, Typography } from 'antd'

import styles from './toolbar.module.css'

const { Text } = Typography

interface ToolbarProps {
  selectedFile: File | null
  onOpenLoadModal: () => void
  onClear: () => void
}

export const Toolbar = ({
  selectedFile,
  onOpenLoadModal,
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
        onClick={onOpenLoadModal}
        type='primary'
      />
    </Tooltip>
    <Tooltip title='Очистить'>
      <span>
        <Button
          aria-label='Очистить'
          disabled={!selectedFile}
          icon={<DeleteOutlined aria-hidden />}
          onClick={onClear}
        />
      </span>
    </Tooltip>
    <Text
      className={styles['file-name']}
      ellipsis
      title={selectedFile?.name}
      type='secondary'
    >
      {selectedFile?.name ?? 'Схема не загружена'}
    </Text>
  </div>
)
