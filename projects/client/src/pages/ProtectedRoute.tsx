import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '@stores/authStore.ts'

const ProtectedRoute = ({ children }: { children: ReactElement }): ReactElement => {
  const status = useAuthStore(s => s.sessionStatus)

  if (status === 'authenticated') return children
  if (status === 'unknown') {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500 text-sm">
        Загрузка…
      </div>
    )
  }
  return <Navigate to="/login" replace />
}

export default ProtectedRoute
