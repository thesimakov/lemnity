import type { ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const WidgetPreviewPage = (): ReactElement => {
  const { widgetId } = useParams()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Предпросмотр виджета {widgetId}</h1>
      <div className="rounded-xl border border-gray-200 p-6 text-gray-500">
        Превью появится тут.
      </div>
    </div>
  )
}

export default WidgetPreviewPage
