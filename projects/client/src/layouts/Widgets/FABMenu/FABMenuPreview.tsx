import type { PreviewMode } from '@/stores/widgetPreviewStore'
import FabMenuWidget from './FabMenuWidget'

type FABMenuPreviewProps = {
  mode: PreviewMode
}

const FABMenuPreview = ({ mode }: FABMenuPreviewProps) => {
  return (
    <div className="flex h-full flex-col gap-4">
      <div
        className={`flex flex-1 rounded-[32px] border border-indigo-100 bg-gradient-to-br from-[#F5F6FF] to-[#EEF2FF] p-6 ${
          mode === 'mobile' ? 'max-w-[360px] self-center w-full' : ''
        }`}
      >
        <div className="relative flex h-full w-full flex-col rounded-[28px] bg-white p-8 shadow-inner shadow-indigo-50">
          <div className="flex flex-col gap-3 text-indigo-200 absolute top-0 left-0">
            <span className="h-6 w-2/3 rounded-full bg-current" />
            <span className="h-3 w-11/12 rounded-full bg-current/70" />
            <span className="h-3 w-8/12 rounded-full bg-current/60" />
            <span className="h-3 w-7/12 rounded-full bg-current/60" />
          </div>

          <FabMenuWidget
            anchorBaseClassName="absolute bottom-8"
            anchorOffsetClassName={{ left: 'left-8', right: 'right-8' }}
            listClassName="max-w-[280px]"
            triggerClassName="h-16 w-16"
          />
        </div>
      </div>
    </div>
  )
}

export default FABMenuPreview
