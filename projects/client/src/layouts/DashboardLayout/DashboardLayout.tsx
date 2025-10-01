import NavigationSidebar from './NavigationSidebar'
import MainContent from './MainContent'
import ChatPanel from './ChatPanel'
import type { PropsWithChildren, ReactElement } from 'react'

const DashboardLayout = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <div className="flex flex-1 min-h-0 mx-5 gap-[15px]">
      <NavigationSidebar />
      <MainContent>{children}</MainContent>
      <ChatPanel />
    </div>
  )
}

export default DashboardLayout
