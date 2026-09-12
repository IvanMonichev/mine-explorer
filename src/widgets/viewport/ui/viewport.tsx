import type { ReactNode, Ref } from 'react'

import styles from './viewport.module.css'

interface ViewportProps {
  children: ReactNode
  toolbar: ReactNode
  ref?: Ref<HTMLElement>
}

export const Viewport = ({ children, toolbar, ref }: ViewportProps) => (
  <section className={styles['viewport']} ref={ref}>
    {toolbar}
    <div className={styles['viewport-content']}>{children}</div>
  </section>
)
