import type { ReactNode } from 'react'

import { Typography } from 'antd'

import styles from './info-layout.module.css'

const { Paragraph } = Typography

interface InfoLayoutProps {
  children?: ReactNode
  conditions: readonly {
    condition: boolean
    text: string
  }[]
}

export const InfoLayout = ({ children, conditions }: InfoLayoutProps) => {
  const info = conditions.find(({ condition }) => condition)

  if (!info) return children

  return (
    <div className={styles['info-layout']}>
      <div className={styles['content']}>
        <Paragraph className={styles['text']} type='secondary'>
          {info.text}
        </Paragraph>
      </div>
    </div>
  )
}
