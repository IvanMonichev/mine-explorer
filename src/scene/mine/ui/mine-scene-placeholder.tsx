import type { ReactNode } from 'react'

import styles from './mine-scene-placeholder.module.css'

interface MineScenePlaceholderProps {
  children: ReactNode
}

export const MineScenePlaceholder = ({
  children
}: MineScenePlaceholderProps) => (
  <section className={styles['scene-shell']}>{children}</section>
)
