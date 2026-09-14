import type { ReactNode } from 'react'

import { Spin, Typography } from 'antd'

import styles from './load-layout.module.css'

const { Text } = Typography

interface LoadLayoutProps {
  children?: ReactNode
  isLoading: boolean
  message?: string
}

export const LoadLayout = ({
  children,
  isLoading,
  message = 'Загрузка…'
}: LoadLayoutProps) => {
  if (!isLoading) return children

  return (
    <div aria-busy='true' className={styles['load-layout']} role='status'>
      <div className={styles['content']}>
        <Spin size='large' />
        <Text type='secondary'>{message}</Text>
      </div>
    </div>
  )
}
