import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import Header from '@/layouts/Header/Header'
import type { ReactElement } from 'react'
// import { useParams, useSearchParams } from 'react-router-dom'

const ProjectWidgetsPage = (): ReactElement => {
  // const { projectId } = useParams()
  // const [searchParams] = useSearchParams()

  // const type = searchParams.get('type') ?? 'all'
  // const status = searchParams.get('status') ?? 'all'

  return (
    // <div className="container mx-auto p-6">
    //   <div className="flex items-center justify-between mb-6">
    //     <h1 className="text-xl font-semibold">Виджеты проекта {projectId}</h1>
    //     {projectId ? (
    //       <Link
    //         to={`/projects/${projectId}/widgets/new`}
    //         className="px-4 py-2 rounded-lg bg-black text-white"
    //       >
    //         Создать виджет
    //       </Link>
    //     ) : null}
    //   </div>

    //   <div className="mb-4 text-sm text-gray-500">
    //     Фильтры: тип = {type}, статус = {status}
    //   </div>

    //   <div className="rounded-xl border border-gray-200 p-6 text-gray-500">
    //     Список виджетов появится тут.
    //   </div>
    // </div>
    <div className="h-full flex flex-col">
      <Header />
      <DashboardLayout>
        <div className="flex flex-col gap-[1px]"></div>
      </DashboardLayout>
    </div>
  )
}

export default ProjectWidgetsPage
