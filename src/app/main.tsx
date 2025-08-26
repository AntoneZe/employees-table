import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './providers'
import { AppRoutes } from './routes'
import '@mantine/core/styles.css'
import '../index.css'

if (import.meta.env.DEV) {
  const { worker } = await import('@shared/api/msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </React.StrictMode>,
)