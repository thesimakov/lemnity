import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import FullWidthLayout from '@/layouts/FullWidthLayout'

const ProjectLayout = (): ReactElement => {
  return (
    <FullWidthLayout>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </FullWidthLayout>
  )
}

export default ProjectLayout
