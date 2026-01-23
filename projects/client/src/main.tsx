import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { HeroUIProvider } from '@heroui/system'
import useAuthStore from '@stores/authStore.ts'
import { useEffect } from 'react'
import { useProjectsStore } from '@/stores/projectsStore'
import YandexMetrika from './common/utils/yandexMetrika.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Root = () => {
  const bootstrap = useAuthStore(s => s.bootstrap)
  const sessionStatus = useAuthStore(s => s.sessionStatus)
  const ensureProjectsLoaded = useProjectsStore(s => s.ensureLoaded)
  const queryClient = new QueryClient()

  useEffect(() => {
    bootstrap().catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      ensureProjectsLoaded().catch(() => undefined)
    }
  }, [sessionStatus, ensureProjectsLoaded])

  return (
    <StrictMode>
      <HeroUIProvider>
        <BrowserRouter>
          <YandexMetrika />
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </HeroUIProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
