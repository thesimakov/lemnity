import NavigationSidebar from './NavigationSidebar'
import MainContent from './MainContent'
import RightPanel from './RightPanel'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'

type DashboardLayoutProps = PropsWithChildren<{
  rightPanel?: ReactNode
  rightPanelWidthClassName?: string
}>

const DashboardLayout = ({
  children,
  rightPanel,
  rightPanelWidthClassName
}: DashboardLayoutProps): ReactElement => {
  return (
    <div className="flex flex-1 min-h-0 mx-5 gap-[15px]">
      <NavigationSidebar />
      <MainContent>{children}</MainContent>
      <RightPanel widthClassName={rightPanelWidthClassName}>{rightPanel}</RightPanel>
    </div>
  )
}

export default DashboardLayout
