import { StrictMode } from 'react'

import 'antd/dist/reset.css'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
