import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '@stores/authStore'

const PublicRoute = ({ children }: { children: ReactElement }): ReactElement => {
  const status = useAuthStore(s => s.sessionStatus)
  if (status === 'authenticated') return <Navigate to="/" replace />

  return children
}

export default PublicRoute
