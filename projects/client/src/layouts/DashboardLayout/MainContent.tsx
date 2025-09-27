import Stats from '../Stats/Stats'
import './MainContent.css'
import bannerNewYearTemplate from '../../assets/banners/new-year-template.png'
import AddProjectsBlock from '../AddProjectsBlock/AddProjectsBlock'
import ProjectList from '../ProjectList/ProjectList'
import { useProjectsStore } from '@/stores/projectsStore'
import useUserStore from '@/stores/userStore'

const MainContent = () => {
  const projects = useProjectsStore(s => s.projects)
  const user = useUserStore(s => s.user)

  return (
    <main className="flex-1 min-h-0 flex flex-col gap-[10px] py-[10px] px-[19px] main-content-bg">
      <div className="flex flex-col gap-[1px]">
        <span className="text-xl font-roboto">Здравствуйте, {user?.name}</span>
        {/* <span className="text-sm text-gray-500">Маркетолок компании "Вкусняшки"</span> */}
      </div>
      <hr className="border-[#C0C0C0]" />
      <div className="flex flex-row justify-between">
        <div className="mr-2.5">
          <Stats />
        </div>
        <div className=" h-full">
          <img src={bannerNewYearTemplate} alt="New Year Template" className="w-full h-auto" />
        </div>
      </div>
      <hr className="border-[#C0C0C0]" />
      {projects.length ? <ProjectList /> : <AddProjectsBlock />}
    </main>
  )
}

export default MainContent
