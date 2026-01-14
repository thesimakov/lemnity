import { useRef, useEffect, useMemo, useState, type FC } from 'react'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { useProjectsStore, type Project } from '@/stores/projectsStore'
import ProjectRow from './ProjectRow'
import ProjectListHeader from './ProjectListHeader'
import SvgIcon from '@/components/SvgIcon'
import addIcon from '@/assets/icons/add.svg'
import './ProjectList.css'
import { cn } from '@heroui/theme'

type ProjectsFilterType = 'all' | 'active' | 'nonactive'
type ProhjectsFilterItem = { key: ProjectsFilterType; label: string }[]

const ProjectList: FC<{ onCreateClick?: () => void }> = ({ onCreateClick }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const topRef = useRef<HTMLDivElement | null>(null)
  const projects = useProjectsStore(s => s.projects)
  const [filter, setFilter] = useState<ProjectsFilterType>('all')

  const sortByDateDesceningPredicate = (a: Project, b: Project) => {
    const projectATimestamp = new Date(a.createdAt).getTime()
    const projectBTimestamp = new Date(b.createdAt).getTime()
    return projectBTimestamp - projectATimestamp
  }

  const filteredProjects = useMemo(() => {
    switch (filter) {
      case 'all':
        return projects.sort(sortByDateDesceningPredicate)

      case 'active':
        return projects
          .filter(value => {
            return value.enabled
          })
          .sort(sortByDateDesceningPredicate)

      case 'nonactive':
        return projects
          .filter(value => {
            return !value.enabled
          })
          .sort(sortByDateDesceningPredicate)
    }
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
              const key = Array.from(keys)[0] as ProjectsFilterType
              setFilter(key ?? 'all')
            }}
            classNames={{
              label: 'text-2xl pr-0 mr-5.25',
              trigger: cn(
                'border border-[#E8E8E8] rounded-[6px] outline-none bg-white',
                'px-3.5 shadow-none w-47 h-10 shrink-0'
              ),
              value: 'text-[16px]',
              popoverContent: 'border-0 rounded-[6px] p-1.5'
            }}
            items={
              [
                { key: 'all', label: 'Все проекты' },
                { key: 'active', label: 'Только активные' },
                { key: 'nonactive', label: 'Черновики' }
              ] as ProhjectsFilterItem
            }
          >
            {item => (
              <SelectItem
                key={item.key}
                classNames={{
                  selectedIcon: 'hidden',
                  title: 'text-[16px]',
                  base: cn(
                    'h-8.75 min-w-fit mt-2 first:mt-0 px-4 rounded-[5px]',
                    'border border-[#E8E8E8] transition-all duration-200',
                    'data-[selectable=true]:focus:bg-white',
                    'data-[selected=true]:border-[#915DC0]',
                    'data-[hover=true]:bg-white',
                    'data-[hover=true]:border-[#915DC0]'
                  )
                }}
              >
                {item.label}
              </SelectItem>
            )}
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
