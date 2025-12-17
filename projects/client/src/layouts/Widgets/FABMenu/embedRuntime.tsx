// React import not needed with automatic JSX runtime
import FabMenuWidget from './FabMenuWidget'

export const FABMenuEmbedRuntime = () => (
  <div className="fixed bottom-6 right-6 pointer-events-auto">
    <FabMenuWidget
      anchorBaseClassName="relative"
      anchorOffsetClassName={{ left: 'left-0', right: 'right-0' }}
      listClassName="max-w-[280px]"
      triggerClassName="h-16 w-16"
    />
  </div>
)
