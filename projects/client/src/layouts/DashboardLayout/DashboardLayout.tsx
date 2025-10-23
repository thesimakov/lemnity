import NavigationSidebar from './NavigationSidebar'
import MainContent from './MainContent'
import RightPanel from './RightPanel'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import { useSidebarStore } from '@/stores/sidebarStore'
import { memo } from 'react'

type DashboardLayoutProps = PropsWithChildren<{
  rightPanel?: ReactNode
  rightPanelWidthClassName?: string
}>

const DashboardLayout = ({
  children,
  rightPanel,
  rightPanelWidthClassName
}: DashboardLayoutProps): ReactElement => {
  const { isVisible } = useSidebarStore()

  return (
    <div className="flex flex-1 min-h-0 mx-5 gap-[15px]">
      <div
        className={`transition-all duration-300 ease-in-out ${isVisible ? 'w-60' : 'w-0 overflow-hidden'}`}
      >
        <NavigationSidebar />
      </div>
      <MainContent>{children}</MainContent>
      <RightPanel widthClassName={rightPanelWidthClassName}>{rightPanel}</RightPanel>
    </div>
  )
}

export default memo(DashboardLayout)
