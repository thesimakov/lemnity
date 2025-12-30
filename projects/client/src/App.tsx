import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
// import WidgetsPage from './pages/WidgetsPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import FullWidthLayout from './layouts/FullWidthLayout.tsx'
import PublicRoute from './pages/PublicRoute.tsx'
import ProjectLayout from '@/layouts/ProjectLayout/ProjectLayout'
import ProjectWidgetsPage from '@/pages/ProjectWidgetsPage'
import CreateWidgetPage from '@/pages/CreateWidgetPage'
import WidgetPage from '@/pages/WidgetPage'
import EditWidgetPage from '@/pages/EditWidgetPage'
import WidgetPreviewPage from '@/pages/WidgetPreviewPage'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage'
import RequestsPage from './pages/RequestsPage/RequestsPage.tsx'
import { memo } from 'react'

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
        path="/reset-password"
        element={
          <PublicRoute>
            <FullWidthLayout>
              <ResetPasswordPage />
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
        path="/analytics"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <AnalyticsPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <FullWidthLayout>
              <RequestsPage />
            </FullWidthLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path=":projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="widgets" replace />} />
          <Route path="widgets">
            <Route index element={<ProjectWidgetsPage />} />
            <Route path="new" element={<CreateWidgetPage />} />
            <Route path=":widgetId">
              <Route index element={<WidgetPage />} />
              <Route path="edit" element={<EditWidgetPage />} />
              <Route path="preview" element={<WidgetPreviewPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      {/* Страница обслуживания может быть включена при необходимости */}
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

export default memo(App)
