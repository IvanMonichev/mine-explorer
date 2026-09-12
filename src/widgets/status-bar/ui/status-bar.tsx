import { Layout, Space, Tag } from 'antd'
import { observer } from 'mobx-react-lite'

import type { MineStore } from '@/store/mine'

import styles from './status-bar.module.css'

const { Footer } = Layout

interface StatusBarProps {
  mineStore: MineStore
}

export const StatusBar = observer(({ mineStore }: StatusBarProps) => (
  <Footer className={styles['status-bar']}>
    <Space aria-label='Статистика шахты' role='status' size={8} wrap>
      <Tag
        className={
          mineStore.mine ? styles['selected-tag'] : styles['status-tag']
        }
      >
        {mineStore.isLoading
          ? 'Загрузка…'
          : mineStore.error
            ? 'Ошибка загрузки'
            : mineStore.mine
              ? 'Схема загружена'
              : 'Нет схемы'}
      </Tag>
      <Tag className={styles['status-tag']}>
        Горизонты: {mineStore.mine?.horizons.size ?? 0}
      </Tag>
      <Tag className={styles['status-tag']}>
        Выработки: {mineStore.mine?.excavations.size ?? 0}
      </Tag>
      <Tag className={styles['status-tag']}>
        Секции: {mineStore.mine?.sections.size ?? 0}
      </Tag>
    </Space>
  </Footer>
))
