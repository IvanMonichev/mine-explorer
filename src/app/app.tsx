import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

import '@/assets/styles/index.css'
import { MineViewerPage } from '@/pages/mine-viewer'

import { appTheme } from './config/theme'
import { StoreProvider } from './providers/store-provider'

export const App = () => (
  <ConfigProvider locale={ruRU} theme={appTheme}>
    <StoreProvider>
      <MineViewerPage />
    </StoreProvider>
  </ConfigProvider>
)
