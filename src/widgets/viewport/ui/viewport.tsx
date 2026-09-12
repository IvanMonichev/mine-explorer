import type { ReactNode } from 'react'

import styles from './viewport.module.css'

interface ViewportProps {
  children: ReactNode
  toolbar: ReactNode
}

export const Viewport = ({ children, toolbar }: ViewportProps) => (
  <section className={styles['viewport']}>
    {toolbar}
    <div className={styles['viewport-content']}>{children}</div>
  </section>
)
