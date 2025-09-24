import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import WidgetsPage from './pages/WidgetsPage.tsx'
import CreateCardPage from './pages/CreateCardPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import MaintenancePage from './pages/MaintenancePage.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import CenteredLayout from './layouts/CenteredLayout.tsx'
import FullWidthLayout from './layouts/FullWidthLayout.tsx'
import PublicRoute from './pages/PublicRoute.tsx'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
          <FullWidthLayout>
            <HomePage />
          </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <FullWidthLayout>
              <LoginPage />
            </FullWidthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <DashboardPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/widgets"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <WidgetsPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cards/create"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <CreateCardPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <DashboardPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <CenteredLayout>
            <MaintenancePage />
          </CenteredLayout>
        }
      />
      <Route
        path="*"
        element={
          <FullWidthLayout>
            <NotFoundPage />
          </FullWidthLayout>
        }
      />
    </Routes>
  )
}

export default App
