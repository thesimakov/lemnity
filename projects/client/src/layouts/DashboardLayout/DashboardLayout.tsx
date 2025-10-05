import NavigationSidebar from './NavigationSidebar'
import MainContent from './MainContent'
import ChatPanel from './ChatPanel'
import { useSidebarStore } from '@/stores/sidebarStore'
import type { PropsWithChildren, ReactElement } from 'react'

const DashboardLayout = ({ children }: PropsWithChildren): ReactElement => {
  const { isVisible } = useSidebarStore()

  return (
    <div className="flex flex-1 min-h-0 mx-5 gap-[15px]">
      <div
        className={`transition-all duration-300 ease-in-out ${isVisible ? 'w-60' : 'w-0 overflow-hidden'}`}
      >
        <NavigationSidebar />
      </div>
      <MainContent>{children}</MainContent>
      <ChatPanel />
    </div>
  )
}

export default DashboardLayout
