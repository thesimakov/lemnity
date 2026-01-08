import { useRef, useEffect, useMemo, useState, type FC } from 'react'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { useProjectsStore } from '@/stores/projectsStore'
import ProjectRow from './ProjectRow'
import ProjectListHeader from './ProjectListHeader'
import SvgIcon from '@/components/SvgIcon'
import addIcon from '@/assets/icons/add.svg'
import './ProjectList.css'

const ProjectList: FC<{ onCreateClick?: () => void }> = ({ onCreateClick }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const topRef = useRef<HTMLDivElement | null>(null)
  const projects = useProjectsStore(s => s.projects)
  const [filter, setFilter] = useState<string>('all')

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects
    // пока фильтрация не реализована, возвращаем все проекты
    return projects
  }, [projects, filter])

  useEffect(() => {
    const root = scrollRef.current
    const target = topRef.current
    if (!root || !target) return

    const io = new IntersectionObserver(
      ([e]) => {
        root.classList.toggle('hasTopShadow', !e.isIntersecting)
      },
      { root, threshold: 0 }
    )

    io.observe(target)
    return () => io.disconnect()
  }, [])

  if (!projects.length) return null

  return (
    <section className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Select
            label="Ваши проекты"
            labelPlacement="outside-left"
            size="sm"
            selectedKeys={[filter]}
            onSelectionChange={keys => {
              const key = Array.from(keys)[0] as string
              setFilter(key ?? 'all')
            }}
            className="w-82"
            classNames={{
              label: 'text-2xl'
            }}
          >
            <SelectItem key="all">Все проекты</SelectItem>
          </Select>
        </div>
        <Button
          className="bg-[#FFB400] text-black rounded-sm"
          startContent={<SvgIcon size={'20px'} src={addIcon} />}
          color="primary"
          onPress={onCreateClick}
        >
          Создать проект
        </Button>
      </div>

      <ProjectListHeader />
      <div ref={scrollRef} className="flex-1 min-h-0 -mt-3 rounded-md scrollShadow">
        <div ref={topRef} aria-hidden="true" className="sentinel"></div>
        <div className="flex flex-col gap-3 pb-1">
          {filteredProjects.map(project => (
            <ProjectRow
              key={project.id}
              id={project.id}
              name={project.name}
              enabled={project.enabled}
              visitors={project.metrics.visitors}
              impressions={project.metrics.impressions}
              conversions={project.metrics.conversions}
              activityPercent={project.metrics.activity.value}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectList
