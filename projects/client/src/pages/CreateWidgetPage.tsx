import type { ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const CreateWidgetPage = (): ReactElement => {
  const { projectId } = useParams()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Новый виджет для проекта {projectId}</h1>
      <div className="rounded-xl border border-gray-200 p-6 text-gray-500">
        Форма создания виджета появится тут.
      </div>
    </div>
  )
}

export default CreateWidgetPage
