import type { ReactNode } from 'react'

import { Typography } from 'antd'

import styles from './panel.module.css'

const { Text } = Typography

interface PanelProps {
  children: ReactNode
  title?: ReactNode
  extra?: ReactNode
  className?: string
}

export const Panel = ({ children, title, extra, className }: PanelProps) => (
  <section className={[styles['panel'], className].filter(Boolean).join(' ')}>
    {(title || extra) && (
      <div className={styles['panel-heading']}>
        {title && <Text strong>{title}</Text>}
        {extra}
      </div>
    )}
    {children}
  </section>
)
