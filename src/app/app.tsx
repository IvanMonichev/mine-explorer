import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

import '@/assets/styles/index.css'
import { MineViewerPage } from '@/pages/mine-viewer'

import { appTheme } from './config/theme'

export const App = () => (
  <ConfigProvider locale={ruRU} theme={appTheme}>
    <MineViewerPage />
  </ConfigProvider>
)
