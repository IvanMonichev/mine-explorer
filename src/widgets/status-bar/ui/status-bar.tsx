import { Layout, Space, Tag } from 'antd'

import styles from './status-bar.module.css'

const { Footer } = Layout

interface StatusBarProps {
  hasSelectedFile: boolean
}

export const StatusBar = ({ hasSelectedFile }: StatusBarProps) => (
  <Footer className={styles['status-bar']}>
    <Space aria-label='Статистика шахты' role='status' size={8} wrap>
      <Tag
        className={
          hasSelectedFile ? styles['selected-tag'] : styles['status-tag']
        }
      >
        {hasSelectedFile ? 'Файл выбран' : 'Нет схемы'}
      </Tag>
      <Tag className={styles['status-tag']}>Горизонты: 0</Tag>
      <Tag className={styles['status-tag']}>Выработки: 0</Tag>
      <Tag className={styles['status-tag']}>Сечения: 0</Tag>
    </Space>
  </Footer>
)
