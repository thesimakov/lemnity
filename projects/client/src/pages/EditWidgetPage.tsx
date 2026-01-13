import Header from '@/layouts/Header/Header'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import { useParams } from 'react-router-dom'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { createPortal } from 'react-dom'
import { useProjectsStore } from '@/stores/projectsStore'
import SvgIcon from '@/components/SvgIcon'
import iconEye from '@/assets/icons/eye.svg'
import FieldsSettingsTab from '@/layouts/WidgetSettings/FieldsSettingsTab/FieldsSettingsTab'
import './EditWidgetPage.css'
import DisplaySettingsTab from '@/layouts/WidgetSettings/DisplaySettingsTab/DisplaySettingsTab'
import IntegrationTab from '@/layouts/WidgetSettings/IntegrationTab/IntegrationTab'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { buildDefaults } from '@/stores/widgetSettings/defaults'
import WidgetPreview from '@/layouts/WidgetPreview/WidgetPreview'
import PreviewModal from '@/layouts/Widgets/Common/PreviewModal'
import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'
import { usesStandardSurface } from '@/stores/widgetSettings/widgetDefinitions'
import { getWidgetDefinition } from '@/layouts/Widgets/registry'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import { simulateWheelSpinResultFromSectors } from '@/layouts/Widgets/WheelOfFortune/actionHandlers'
import type { WheelOfFortuneWidgetSettings } from '@/stores/widgetSettings/types'

type TabKey = 'fields' | 'display' | 'integration'
type TabDescriptor = { key: TabKey; label: string; visible: boolean }
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
  const [tab, setTab] = useState<TabKey>('fields')
  const [saving, setSaving] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isInlinePreviewOpen, setIsInlinePreviewOpen] = useState(false)
  // legacy local spin state removed; use preview store instead
  const initialized = useWidgetSettingsStore(s => s.initialized)
  const widgetType = widget?.type
  const widgetConfig = widget?.config
  const widgetDefinition = widgetType ? getWidgetDefinition(widgetType) : null

  // Initialize widget settings store once per widgetId
  useEffect(() => {
    if (!widgetId || !widgetType) return
    const store = useWidgetSettingsStore.getState()
    const shouldReinit =
      !store.settings || store.settings.id !== widgetId || store.settings.widgetType !== widgetType
    if (shouldReinit) {
      const base = store.settings ?? buildDefaults(widgetId, widgetType)
      const initialSettings = widgetConfig
        ? ({ ...base, ...widgetConfig } as typeof base)
        : undefined
      store.init(widgetId, widgetType, projectId, initialSettings)
    }

    return () => {
      // cleanup draft state in memory when leaving page
      useWidgetSettingsStore.getState().reset()
    }
  }, [projectId, widgetId, widgetType, widgetConfig])

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

  const previewLauncher = widgetDefinition?.preview?.launcher ?? 'modal'
  const InlinePreviewComponent = widgetDefinition?.preview?.inline

  const handlePreview = () => {
    if (previewLauncher === 'inline' && InlinePreviewComponent) {
      setIsInlinePreviewOpen(true)
      return
    }
    setIsPreviewModalOpen(true)
    setPreviewScreen('main')
  }

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false)
  }

  const handleCloseInlinePreview = () => {
    setIsInlinePreviewOpen(false)
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
      // Re-init settings with server config
      const base = useWidgetSettingsStore.getState().settings ?? buildDefaults(widgetId, widgetType)
      const next = updated.config ? ({ ...base, ...updated.config } as typeof base) : undefined
      useWidgetSettingsStore.getState().init(widgetId, widgetType, projectId, next)
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
    const runtime = usePreviewRuntimeStore.getState()
    const settings = useWidgetSettingsStore.getState().settings
    const wheelSettings: WheelOfFortuneWidgetSettings | null =
      settings?.widget?.type === WidgetTypeEnum.WHEEL_OF_FORTUNE
        ? (settings.widget as WheelOfFortuneWidgetSettings)
        : null

    const previewResult = wheelSettings?.sectors?.items?.length
      ? simulateWheelSpinResultFromSectors(wheelSettings.sectors.items)
      : null
    const isWin = Boolean(previewResult?.isWin ?? true)

    if (previewResult) {
      runtime.setValue('wheel.winningSectorId', previewResult.sectorId)
      runtime.setValue('wheel.result', previewResult)
      runtime.setValue('wheel.status', 'spinning')
    }

    runtime.emit('wheel.spin')

    setTimeout(() => {
      setPreviewScreen(isWin ? 'prize' : 'main')
      runtime.setValue('wheel.status', 'idle')
    }, 5000)
  }, [setPreviewScreen])

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

  const showDisplayTab =
    !widgetType ||
    usesStandardSurface(widgetType, 'display') ||
    Boolean(widgetDefinition?.settings.surfaces?.display)
  const showIntegrationTab =
    !widgetType ||
    usesStandardSurface(widgetType, 'integration') ||
    Boolean(widgetDefinition?.settings.surfaces?.integration)

  const visibleTabs = useMemo<TabDescriptor[]>(() => {
    const tabs: TabDescriptor[] = [
      { key: 'fields', label: 'Настройки полей', visible: true },
      { key: 'display', label: 'Отображение', visible: showDisplayTab },
      { key: 'integration', label: 'Интеграция', visible: showIntegrationTab }
    ]
    return tabs.filter(tab => tab.visible)
  }, [showDisplayTab, showIntegrationTab])

  useEffect(() => {
    if (!visibleTabs.length) return
    if (!visibleTabs.some(t => t.key === tab)) {
      setTab(visibleTabs[0].key)
    }
  }, [tab, visibleTabs])

  if (!initialized) return null

  const tabsBar = (
    <div className="w-full bg-[#F5F6F8] border border-[#E6E6E6] rounded-xl px-3 py-2 gap-2 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-2">
        {visibleTabs.map(item => (
          <Button
            key={item.key}
            size="md"
            variant="flat"
            className={`h-[30px] rounded-md text-black ${
              tab === item.key ? 'bg-[#DBE1FF]' : 'bg-white border border-[#E4E4E4]'
            }`}
            onPress={() => setTab(item.key)}
          >
            {item.label}
          </Button>
        ))}
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
              {tab === 'fields' && <FieldsSettingsTab />}
              {tab === 'display' && showDisplayTab && <DisplaySettingsTab />}
              {tab === 'integration' && showIntegrationTab && <IntegrationTab />}
              <div ref={bottomRef} aria-hidden="true" className="sentinelBot"></div>
            </div>
          </div>
        </DashboardLayout>
      </div>

      {previewLauncher === 'inline' && InlinePreviewComponent ? (
        <InlinePreviewPortal
          isOpen={isInlinePreviewOpen}
          onClose={handleCloseInlinePreview}
          Component={InlinePreviewComponent}
        />
      ) : (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreview}
          screen={previewScreen}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}

export default memo(EditWidgetPage)

type InlinePreviewPortalProps = {
  isOpen: boolean
  onClose: () => void
  Component: ComponentType<{ onClose: () => void }>
}

const InlinePreviewPortal = ({ isOpen, onClose, Component }: InlinePreviewPortalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null
  return createPortal(<Component onClose={onClose} />, document.body)
}
