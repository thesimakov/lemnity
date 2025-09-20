import NavigationSidebar from './NavigationSidebar'
import MainContent from './MainContent'
import ChatPanel from './ChatPanel'

const DashboardLayout = () => {
  return (
    <div className="flex flex-1 min-h-0 mx-5 gap-[15px]">
      <NavigationSidebar />
      <MainContent />
      <ChatPanel />
    </div>
  )
}

export default DashboardLayout
