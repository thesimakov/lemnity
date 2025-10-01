import type { ReactElement } from 'react'
import { useParams, Link } from 'react-router-dom'

const WidgetPage = (): ReactElement => {
  const { projectId, widgetId } = useParams()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Виджет {widgetId}</h1>
        {projectId && widgetId ? (
          <div className="flex gap-3">
            <Link to={`/projects/${projectId}/widgets/${widgetId}/edit`} className="text-blue-600">
              Редактировать
            </Link>
            <Link
              to={`/projects/${projectId}/widgets/${widgetId}/preview`}
              className="text-blue-600"
            >
              Предпросмотр
            </Link>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 p-6 text-gray-500">
        Детали виджета появятся тут.
      </div>
    </div>
  )
}

export default WidgetPage
