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

    if (widgetType === WidgetTypeEnum.WHEEL_OF_FORTUNE) {
      const wheelSettings: WheelOfFortuneWidgetSettings | null =
        settings?.widget?.type === WidgetTypeEnum.WHEEL_OF_FORTUNE
          ? (settings.widget as WheelOfFortuneWidgetSettings)
          : null

      const previewResult = wheelSettings?.sectors?.items?.length
        ? simulateWheelSpinResultFromSectors(wheelSettings.sectors.items)
        : null
      // Что за ересь
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
    }

    if (widgetType === 'ACTION_TIMER') {
      runtime.emit('actionTimer.submit')
      setPreviewScreen('prize')
    }
  }, [setPreviewScreen, widgetType])

  const breadcrumbSeparator = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.26229 1.85604C3.44535 1.67299 3.74215 1.67299 3.92521 1.85604L6.73771 4.66854C6.92076 4.8516 6.92076 5.1484 6.73771 5.33146L3.92521 8.14396C3.74215 8.32701 3.44535 8.32701 3.26229 8.14396C3.07924 7.9609 3.07924 7.6641 3.26229 7.48104L5.74334 5L3.26229 2.51896C3.07924 2.3359 3.07924 2.0391 3.26229 1.85604Z"
        fill="#373737"
      />
    </svg>
  )

  const breadcrumbs = (
    <div className="h-[39px] flex flex-col justify-center">
      <Breadcrumbs
        size="lg"
        itemClasses={{ item: 'text-[#1E73BE]', separator: 'text-[#5951E5] mx-3.5' }}
        separator={breadcrumbSeparator}
      >
        <BreadcrumbItem href="/">Проекты</BreadcrumbItem>
        <BreadcrumbItem href={`/projects/${projectId}`}>{projectName}</BreadcrumbItem>
        <BreadcrumbItem classNames={{ item: 'text-[#3D3D3B]' }}>{widget?.name}</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )

  const rightPanel = (
    <div className="w-full h-full flex flex-col px-4 py-4">
      <WidgetPreview />
    </div>
  )

  const FloppyIcon = () => (
    // <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    //   <path d="M4 3h12l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 3v6h8V3H7zm9 10H8v8h8v-8z" />
    // </svg>
    <div className="text-black">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.94375 15C1.87187 15 1 14.1281 1 13.0562V2.94375C1 1.87187 1.87187 1 2.94375 1H11.1969C11.5969 1 11.975 1.15625 12.2563 1.44062L14.5594 3.74375C14.8438 4.02813 15 4.40312 15 4.80312V13.0562C14.9969 14.125 14.125 14.9969 13.0562 15H2.94375ZM2.94375 2C2.69062 2 2.45313 2.09688 2.275 2.275C2.09688 2.45313 2 2.69062 2 2.94375V13.0562C2 13.5781 2.42187 14 2.94375 14H13.0562C13.575 14 14 13.575 14 13.0531V4.80312C14 4.66875 13.9469 4.54375 13.8531 4.45L11.55 2.14687C11.4563 2.05312 11.3313 2 11.1969 2H2.94375ZM8.00625 13.5H8C6.62188 13.5 5.5 12.3781 5.5 11C5.5 9.62188 6.62188 8.5 8 8.5C9.37813 8.5 10.5 9.62188 10.5 11C10.5 11.6656 10.2406 12.2938 9.77188 12.7656C9.3 13.2375 8.67188 13.5 8.00625 13.5ZM8 9.5C7.17188 9.5 6.5 10.1719 6.5 11C6.5 11.8281 7.17188 12.5 8 12.5H8.00625C8.40625 12.5 8.78125 12.3438 9.0625 12.0594C9.34375 11.775 9.5 11.4 9.5 11C9.5 10.1719 8.82812 9.5 8 9.5ZM9.5 6.5H3.5C2.95 6.5 2.5 6.05 2.5 5.5V3.5C2.5 2.95 2.95 2.5 3.5 2.5H9.5C10.05 2.5 10.5 2.95 10.5 3.5V5.5C10.5 6.05 10.05 6.5 9.5 6.5ZM3.5 3.5V5.5H9.5V3.5H3.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
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
      { key: 'fields', label: 'Настройка виджета', visible: true },
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
    <div className="w-full bg-[#F5F6F8] border border-[#E6E6E6] rounded-[5px] p-1.5 gap-2 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-2.5">
        {visibleTabs.map(item => (
          <Button
            key={item.key}
            size="md"
            variant="flat"
            className={`h-[30px] px-2.5 rounded-[5px] text-[16px] text-black ${
              tab === item.key ? 'bg-[#DBE1FF]' : 'bg-white border border-[#E4E4E4]'
            }`}
            onPress={() => setTab(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          className="h-[30px] rounded-[5px] text-[16px] text-black bg-[#69C8F4] px-2.5"
          onPress={handlePreview}
          startContent={<SvgIcon src={iconEye} size={20} className="text-black" />}
        >
          Просмотр
        </Button>
        <Button
          className="h-[30px] rounded-[5px] bg-[#FFBF1A] text-[16px] text-black px-2.5"
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
          <div className="flex flex-col gap-2.5 h-full min-h-0">
            {breadcrumbs}
            {tabsBar}
            {/* <span className="text-[22px] leading-[26px] font-rubik">Настройка виджета</span> */}
            <div
              ref={scrollRef}
              className="flex flex-col px-[15px] py-2.5 gap-2.5 flex-1 min-h-0 overflow-auto rounded-md"
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
