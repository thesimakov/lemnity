import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import Header from '@/layouts/Header/Header'
import type { ReactElement } from 'react'

const DashboardPage = (): ReactElement => {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <DashboardLayout />
    </div>
  )
}

export default DashboardPage
