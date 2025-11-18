import Header from '@/layouts/Header/Header'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import { useParams } from 'react-router-dom'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useProjectsStore } from '@/stores/projectsStore'
import SvgIcon from '@/components/SvgIcon'
import iconEye from '@/assets/icons/eye.svg'
import FormSettingsTab from '@/layouts/WidgetSettings/FormSettingsTab/FormSettingsTab'
import './EditWidgetPage.css'
import DisplaySettingsTab from '@/layouts/WidgetSettings/DisplaySettingsTab/DisplaySettingsTab'
import IntegrationTab from '@/layouts/WidgetSettings/IntegrationTab/IntegrationTab'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { fromCanonical } from '@/stores/widgetSettings/normalize'
import { buildDefaults } from '@/stores/widgetSettings/defaults'
import WidgetPreview from '@/layouts/WidgetPreview/WidgetPreview'
import PreviewModal from '@/layouts/Widgets/Common/PreviewModal'
import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'
// use store action to keep state in sync after update

const EditWidgetPage = () => {
  const [previewScreen, setPreviewScreen] = useState<'main' | 'prize' | 'panel'>('main')
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const topRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { projectId } = useParams()
  const { widgetId } = useParams()

  const project = useProjectsStore(s => s.projects.find(p => p.id === projectId))
  const projectName = project?.name || ''
  const widget = project?.widgets.find(w => w.id === widgetId)
  const [tab, setTab] = useState<'fields' | 'appearance' | 'integration'>('fields')
  const [saving, setSaving] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  // legacy local spin state removed; use preview store instead
  const initialized = useWidgetSettingsStore(s => s.initialized)
  const widgetType = widget?.type
  const widgetConfig = widget?.config

  // Initialize widget settings store once per widgetId
  useEffect(() => {
    if (!widgetId || !widgetType) return
    const store = useWidgetSettingsStore.getState()
    const shouldReinit =
      !store.settings || store.settings.id !== widgetId || store.settings.widgetType !== widgetType
    if (shouldReinit) {
      const base = store.settings ?? buildDefaults(widgetId, widgetType)
      const initialSettings = widgetConfig ? fromCanonical(widgetConfig, base) : undefined
      store.init(widgetId, widgetType, initialSettings)
    }

    return () => {
      // cleanup draft state in memory when leaving page
      useWidgetSettingsStore.getState().reset()
    }
  }, [widgetId, widgetType, widgetConfig])

  useEffect(() => {
    const root = scrollRef.current
    const target = topRef.current
    const bottomTarget = bottomRef.current
    if (!root || !target || !bottomTarget) return

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.target === target) {
            // show top shadow when top sentinel is NOT visible
            root.classList.toggle('hasTopShadow', !entry.isIntersecting)
          }
          if (entry.target === bottomTarget) {
            // show bottom shadow when bottom sentinel is NOT visible
            root.classList.toggle('hasBottomShadow', !entry.isIntersecting)
          }
        }
      },
      { root, threshold: 0 }
    )

    io.observe(target)
    io.observe(bottomTarget)
    return () => io.disconnect()
  }, [])

  const handlePreview = () => {
    setIsPreviewModalOpen(true)
    setPreviewScreen('main')
  }

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false)
  }

  const handleSave = async () => {
    useWidgetSettingsStore.getState().setValidationVisible(true)
    const res = useWidgetSettingsStore.getState().prepareForSave()

    if (!res.ok) {
      console.warn(res.issues)
      alert('Исправьте ошибки перед сохранением')
      return
    }

    if (!widgetId) {
      alert('Нет widgetId')
      return
    }

    if (!widgetType) {
      alert('Нет widgetType')
      return
    }

    try {
      if (!projectId) {
        alert('Нет projectId')
        return
      }
      setSaving(true)
      const updated = await useProjectsStore
        .getState()
        .saveWidgetConfig(projectId, widgetId, res.data)
      // Re-init settings with canonical server config (convert to UI shape)
      const base = useWidgetSettingsStore.getState().settings ?? buildDefaults(widgetId, widgetType)
      const next = updated.config ? fromCanonical(updated.config, base) : undefined
      useWidgetSettingsStore.getState().init(widgetId, widgetType, next)
      alert('Сохранено')
      useWidgetSettingsStore.getState().setValidationVisible(false)
    } catch (e) {
      console.error(e)
      alert('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = useCallback(() => {
    usePreviewRuntimeStore.getState().emit('wheel.spin')
    setTimeout(() => {
      setPreviewScreen('prize')
    }, 5000)
  }, [setPreviewScreen])
  if (!initialized) return null

  const breadcrumbs = (
    <Breadcrumbs size="lg" itemClasses={{ item: 'text-[#5951E5]', separator: 'text-[#5951E5]' }}>
      <BreadcrumbItem href="/">Проекты</BreadcrumbItem>
      <BreadcrumbItem href={`/projects/${projectId}`}>{projectName}</BreadcrumbItem>
      <BreadcrumbItem>{widget?.name}</BreadcrumbItem>
    </Breadcrumbs>
  )

  const rightPanel = (
    <div className="w-full h-full flex flex-col p-3">
      <WidgetPreview />
    </div>
  )

  const FloppyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 3h12l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 3v6h8V3H7zm9 10H8v8h8v-8z" />
    </svg>
  )

  const tabsBar = (
    <div className="w-full bg-[#F5F6F8] border border-[#E6E6E6] rounded-xl px-3 py-2 gap-2 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          size="md"
          variant="flat"
          className={`h-[30px] rounded-md text-black ${tab === 'fields' ? 'bg-[#DBE1FF]' : 'bg-white border border-[#E4E4E4]'}`}
          onPress={() => setTab('fields')}
        >
          Настройки полей
        </Button>
        <Button
          size="md"
          variant="flat"
          className={`h-[30px] rounded-md text-black ${tab === 'appearance' ? 'bg-[#DBE1FF]' : 'bg-white border border-[#E4E4E4]'}`}
          onPress={() => setTab('appearance')}
        >
          Отображение
        </Button>
        <Button
          size="md"
          variant="flat"
          className={`h-[30px] rounded-md text-black ${tab === 'integration' ? 'bg-[#DBE1FF]' : 'bg-white border border-[#E4E4E4]'}`}
          onPress={() => setTab('integration')}
        >
          Интеграция
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="h-[30px] rounded-md text-black bg-[#69C8F4] px-5"
          onPress={handlePreview}
          startContent={<SvgIcon src={iconEye} size={20} className="text-black" />}
        >
          Просмотр
        </Button>
        <Button
          className="h-[30px] rounded-md bg-[#FFBF1A] text-black px-5"
          onPress={handleSave}
          isDisabled={saving}
          startContent={<FloppyIcon />}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="h-full flex flex-col">
        <Header />
        <DashboardLayout rightPanel={rightPanel} rightPanelWidthClassName="w-[500px]">
          <div className="flex flex-col gap-[15px] py-[5px] h-full min-h-0">
            {breadcrumbs}
            {tabsBar}
            <div
              ref={scrollRef}
              className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto pr-1 scrollShadow rounded-md overflow-hidden"
            >
              <div ref={topRef} aria-hidden="true" className="sentinelTop"></div>
              {tab === 'fields' && <FormSettingsTab />}
              {tab === 'appearance' && <DisplaySettingsTab />}
              {tab === 'integration' && <IntegrationTab />}
              <div ref={bottomRef} aria-hidden="true" className="sentinelBot"></div>
            </div>
          </div>
        </DashboardLayout>
      </div>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        screen={previewScreen}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default memo(EditWidgetPage)
