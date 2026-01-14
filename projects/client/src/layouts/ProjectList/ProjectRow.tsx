import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import CustomSwitch from '@/components/CustomSwitch'
import MetricCard from './MetricCard'
import SvgIcon from '@/components/SvgIcon'
import iconProjectEmblem from '@/assets/icons/project-emblem.svg'
import { useProjectsStore } from '@/stores/projectsStore'
import './ProjectRow.css'
import { useNavigate } from 'react-router-dom'
import { cn } from '@heroui/theme'

interface ProjectRowProps {
  id: string
  name: string
  enabled: boolean
  visitors: { value: number; desktop: number; mobile: number }
  impressions: { value: number; desktop: number; mobile: number }
  conversions: { value: number; desktop: number; mobile: number }
  activityPercent: number
}

const ProjectRow = ({
  id,
  name,
  enabled,
  visitors,
  impressions,
  activityPercent
}: ProjectRowProps) => {
  const projects = useProjectsStore(s => s.projects)
  const toggleProjectEnabled = useProjectsStore(s => s.toggleProjectEnabled)
  const navigate = useNavigate()
  const handleSwitchChange = (value: boolean) => {
    const project = projects.find(p => p.id === id)
    if (project) toggleProjectEnabled(project.id, value)
  }

  return (
    <div
      key={id}
      className={`rounded-lg bg-white shadow-sm border border-gray-200 p-4 ${!enabled ? 'parent' : ''}`}
    >
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-4 flex items-center gap-4">
          <div className="flex self-start">
            <SvgIcon className="text-[#9747FF]" size={'36px'} src={iconProjectEmblem} />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-semibold">{name}</div>
            <div className="text-xs text-gray-500">Виджеты / Геймификация</div>
            <div className="flex flex-row items-center justify-start gap-4 mt-2.5">
              <div className="relative z-10 child">
                <CustomSwitch
                  size="sm"
                  selectedColor="group-data-[selected=true]:!bg-[#5951E5]"
                  isSelected={enabled}
                  onValueChange={handleSwitchChange}
                />
              </div>
              <div className="w-px h-5 bg-gray-300" />
              <Dropdown>
                <DropdownTrigger>
                  <Button isDisabled={!enabled} size="sm" variant="flat">
                    Виджеты
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Действия проекта">
                  <DropdownItem
                    key="open"
                    onPress={() => {
                      navigate(`/projects/${id}/widgets`)
                    }}
                  >
                    Добавить виджет
                  </DropdownItem>
                  <DropdownItem
                    key="widgets"
                    onPress={() => {
                      navigate(`/projects/${id}/widgets`)
                    }}
                  >
                    Изменить виджет
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    onPress={() => {
                      alert('Код для вставки')
                    }}
                  >
                    Код для вставки
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className={cn('col-span-8 grid grid-cols-4', enabled && 'relative')}>
          {enabled && (
            <div className="w-full h-full bg-white/85 absolute z-20 flex flex-col items-center justify-center">
              <p className="text-3xl font-light">Скоро будет доступно!</p>
            </div>
          )}

          <MetricCard
            value={visitors.desktop + visitors.mobile}
            desktop={visitors.desktop}
            mobile={visitors.mobile}
          />
          <MetricCard
            value={impressions.desktop + impressions.mobile}
            desktop={impressions.desktop}
            mobile={impressions.mobile}
          />
          <MetricCard
            value={
              (Math.round((1000 * visitors.desktop) / impressions.desktop) / 10 +
                Math.round((1000 * visitors.mobile) / impressions.mobile) / 10) /
                2 || 0
            }
            desktop={Math.round((1000 * visitors.desktop) / impressions.desktop) / 10 || 0}
            mobile={Math.round((1000 * visitors.mobile) / impressions.mobile) / 10 || 0}
            isPercent={true}
          />
          <MetricCard
            value={activityPercent}
            pillColor="bg-green-100 text-green-700"
            isPercent={true}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectRow
