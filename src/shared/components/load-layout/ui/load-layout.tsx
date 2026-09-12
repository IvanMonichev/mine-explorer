import { Spin, Typography } from 'antd'

import styles from './load-layout.module.css'

const { Text } = Typography

interface LoadLayoutProps {
  message?: string
}

export const LoadLayout = ({ message = 'Загрузка…' }: LoadLayoutProps) => (
  <div aria-busy='true' className={styles['load-layout']} role='status'>
    <div className={styles['content']}>
      <Spin size='large' />
      <Text type='secondary'>{message}</Text>
    </div>
  </div>
)
