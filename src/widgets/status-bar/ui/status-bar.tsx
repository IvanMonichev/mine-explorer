import { Layout, Space, Tag } from 'antd'
import { observer } from 'mobx-react-lite'

import type { MineStore } from '@/store/mine'
import type { ViewerStore } from '@/store/viewer'

import styles from './status-bar.module.css'

const { Footer } = Layout
const coordinateFormat = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false
})
const countFormat = new Intl.NumberFormat('ru-RU')

const RenderMetrics = observer(({ mineStore, viewerStore }: StatusBarProps) => {
  const metrics = viewerStore.renderMetrics

  return (
    <Space aria-label='Метрики сцены' size={8} wrap>
      <Tag
        className={styles['status-tag']}
        title='Треугольники, отрисованные за последний кадр, включая выделение и куб ориентации'
      >
        triangles:{' '}
        <span className={styles['metric-value']}>
          {metrics ? countFormat.format(metrics.triangles) : '—'}
        </span>
      </Tag>
      <Tag
        className={styles['status-tag']}
        title='Общее количество узлов в загруженной схеме'
      >
        nodes:{' '}
        <span className={styles['metric-value']}>
          {countFormat.format(mineStore.mine?.nodes.size ?? 0)}
        </span>
      </Tag>
      <Tag
        className={styles['status-tag']}
        title='Точечные примитивы Three.js, отрисованные за последний кадр'
      >
        points:{' '}
        <span className={styles['metric-value']}>
          {metrics ? countFormat.format(metrics.points) : '—'}
        </span>
      </Tag>
    </Space>
  )
})

const CameraPosition = observer(
  ({ viewerStore }: { viewerStore: ViewerStore }) => {
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
  }
)

interface StatusBarProps {
  mineStore: MineStore
  viewerStore: ViewerStore
}

export const StatusBar = observer(
  ({ mineStore, viewerStore }: StatusBarProps) => (
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
      <RenderMetrics mineStore={mineStore} viewerStore={viewerStore} />
      <CameraPosition viewerStore={viewerStore} />
    </Footer>
  )
)
