import type { ReactNode } from 'react'

import { Typography } from 'antd'

import styles from './info-layout.module.css'

const { Paragraph, Title } = Typography

interface InfoLayoutProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}

export const InfoLayout = ({
  title,
  description,
  icon,
  action
}: InfoLayoutProps) => (
  <div className={styles['info-layout']}>
    <div className={styles['content']}>
      {icon && <div className={styles['icon']}>{icon}</div>}
      {title && (
        <Title className={styles['title']} level={2}>
          {title}
        </Title>
      )}
      {description && (
        <Paragraph className={styles['description']} type='secondary'>
          {description}
        </Paragraph>
      )}
      {action && <div className={styles['action']}>{action}</div>}
    </div>
  </div>
)
