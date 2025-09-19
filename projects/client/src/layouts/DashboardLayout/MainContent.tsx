import Stats from '../Stats/Stats'
import './MainContent.css'
import bannerNewYearTemplate from '../../assets/banners/new-year-template.png'
import AddProjectsBlock from '../AddProjectsBlock/AddProjectsBlock'
import ProjectList from '../ProjectList/ProjectList'
import { useProjectsStore } from '@/stores/projectsStore'

const MainContent = () => {
  const projects = useProjectsStore(s => s.projects)
  return (
    <main className="flex-1 min-h-0 flex flex-col gap-[10px] py-[18px] px-[19px] main-content-bg">
      {/* Content will be added here later */}
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
