import { Layout, Space, Tag } from 'antd'
import { observer } from 'mobx-react-lite'

import { useRootStore } from '@/store/root'

import styles from './status-bar.module.css'

const { Footer } = Layout
const coordinateFormat = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false
})

const CameraPosition = observer(() => {
  const { viewerStore } = useRootStore()
  const position = viewerStore.cameraPosition

  return (
    <table
      className={styles['camera-position']}
      title='Позиция камеры в координатах 3D-сцены'
    >
      <tbody>
        <tr>
          <th scope='row'>Камера:</th>
          <td className={styles['camera-axis']}>X:</td>
          <td>{position ? coordinateFormat.format(position.x) : '—'}</td>
          <td className={styles['camera-axis']}>Y:</td>
          <td>{position ? coordinateFormat.format(position.y) : '—'}</td>
          <td className={styles['camera-axis']}>Z:</td>
          <td>{position ? coordinateFormat.format(position.z) : '—'}</td>
        </tr>
      </tbody>
    </table>
  )
})

export const StatusBar = observer(() => {
  const { mineStore } = useRootStore()

  return (
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

      <CameraPosition />
    </Footer>
  )
})
