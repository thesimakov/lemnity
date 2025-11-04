import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import { Button } from '@heroui/button'
import type { PreviewMode } from '@/stores/widgetPreviewStore'

const WidgetPreviewLayout = ({ children }: { children: React.ReactNode }) => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const setMode = useWidgetPreviewStore(s => s.setMode)

  const tabClass = (id: PreviewMode): string =>
    `px-4 py-2 text-sm font-medium rounded-md transition ${
      mode === id ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'
    }`

  const tabs = () => (
    <div className="w-full flex justify-center">
      <div className="flex w-full h-11 rounded-lg bg-gray-100 p-1 gap-1">
        <Button
          variant="light"
          size="sm"
          radius="sm"
          className={`${tabClass('desktop')} flex-1 h-full font-normal`}
          onPress={() => setMode('desktop')}
        >
          Компьютер
        </Button>
        <Button
          variant="light"
          size="sm"
          radius="sm"
          className={`${tabClass('mobile')} flex-1 h-full font-normal`}
          onPress={() => setMode('mobile')}
        >
          Телефон
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-2 h-full">
      <span className="text-xl font-normal text-gray-900">Предпросмотр</span>
      {tabs()}
      {children}
    </div>
  )
}

export default WidgetPreviewLayout
