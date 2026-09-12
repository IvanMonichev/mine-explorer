import type { ReactNode } from 'react'
import { Component } from 'react'

import { InfoLayout } from '@/shared/components/info-layout'

// React требует класс для границы ошибок рендера, включая создание WebGL-контекста.
export class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return (
      <InfoLayout
        conditions={[
          {
            condition: this.state.failed,
            text: 'Не удалось запустить 3D-сцену. Проверьте поддержку WebGL в браузере.'
          }
        ]}
      >
        {this.props.children}
      </InfoLayout>
    )
  }
}
