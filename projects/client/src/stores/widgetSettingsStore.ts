import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PersistStorage, StorageValue } from 'zustand/middleware'
import { buildDefaults, STATIC_DEFAULTS } from './widgetSettings/defaults'
import { normalize, trimInactiveBranches, canonicalize } from './widgetSettings/normalize'
import {
  validateWidgetSettingsCanonical,
  validateWidgetSettingsCurrent
} from './widgetSettings/schema'
import type { Issue } from './widgetSettings/schema'
import type { FormSlice } from './widgetSettings/formSlice'
import { createFormSlice } from './widgetSettings/formSlice'
import type { DisplaySlice } from './widgetSettings/displaySlice'
import { createDisplaySlice } from './widgetSettings/displaySlice'
import type { IntegrationSlice } from './widgetSettings/integrationSlice'
import { createIntegrationSlice } from './widgetSettings/integrationSlice'
import type {
  WidgetSettings,
  WidgetSettingsState,
  FormUpdater,
  DisplayUpdater,
  IntegrationUpdater
} from './widgetSettings/types'

// Re-export public types for existing import paths
export type {
  ButtonPosition,
  StartShowing,
  IconType,
  HideIcon,
  DayKey,
  FrequencyMode,
  FrequencyUnit,
  ContactField,
  MessageKey,
  SectorItem,
  FormSettings,
  DisplaySettings,
  IntegrationSettings
} from './widgetSettings/types'

type CoreActions = {
  init: (id: string, initial?: Partial<WidgetSettings>) => void
  snapshot: () => WidgetSettings | null
  snapshotNormalized: () => WidgetSettings | null
  validateNow: () => { ok: boolean; issues: Issue[] }
  getErrors: (prefix?: string) => Issue[]
  prepareForSave: () => { ok: true; data: WidgetSettings } | { ok: false; issues: Issue[] }
}

type ValidationState = {
  validationVisible: boolean
  setValidationVisible: (visible: boolean) => void
  reset: () => void
}
export type WidgetSettingsStore = WidgetSettingsState &
  CoreActions &
  ValidationState &
  FormSlice &
  DisplaySlice &
  IntegrationSlice

// Persist by widget id: store a map { [widgetId]: { state, version } } under one key
const PERSIST_NAME = 'widget-settings'
let activeWidgetId = ''

const mapStorage: PersistStorage<WidgetSettingsStore> = {
  getItem: (name: string): StorageValue<WidgetSettingsStore> | null => {
    const raw = localStorage.getItem(name)
    if (!raw || !activeWidgetId) return null
    try {
      const map = JSON.parse(raw) as Record<string, unknown>
      const entry = map[activeWidgetId]
      return entry ? (entry as StorageValue<WidgetSettingsStore>) : null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: StorageValue<WidgetSettingsStore>): void => {
    const raw = localStorage.getItem(name)
    let map: Record<string, unknown>
    try {
      map = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    } catch {
      map = {}
    }
    if (!activeWidgetId) return
    map[activeWidgetId] = value
    localStorage.setItem(name, JSON.stringify(map))
  },
  removeItem: (name: string): void => {
    const raw = localStorage.getItem(name)
    if (!raw || !activeWidgetId) return
    try {
      const map = JSON.parse(raw) as Record<string, unknown>
      delete (map as Record<string, unknown>)[activeWidgetId]
      localStorage.setItem(name, JSON.stringify(map))
    } catch {
      // ignore
    }
  }
}

const useWidgetSettingsStore = create<WidgetSettingsStore>()(
  devtools(
    persist(
      (set, get) => {
        const patchForm: FormUpdater = mutator =>
          set(state => ({
            ...state,
            settings: state.settings
              ? { ...state.settings, form: mutator(state.settings.form) }
              : state.settings
          }))

        const patchDisplay: DisplayUpdater = mutator =>
          set(state => ({
            ...state,
            settings: state.settings
              ? { ...state.settings, display: mutator(state.settings.display) }
              : state.settings
          }))

        const patchIntegration: IntegrationUpdater = mutator =>
          set(state => ({
            ...state,
            settings: state.settings
              ? { ...state.settings, integration: mutator(state.settings.integration) }
              : state.settings
          }))

        return {
          settings: buildDefaults(''),
          validationVisible: false,
          setValidationVisible: (visible: boolean) =>
            set(state => ({ ...state, validationVisible: visible })),
          reset: () => set({ settings: buildDefaults('') }),
          init: (id, initial) => {
            activeWidgetId = id
            // if server provided config is null/undefined, try rehydrate draft
            if (!initial) {
              try {
                const raw = localStorage.getItem(PERSIST_NAME)
                if (raw) {
                  const map = JSON.parse(raw) as Record<string, { state?: unknown } | undefined>
                  const entry = map[id]
                  const restored = (entry?.state as { settings?: unknown } | undefined)
                    ?.settings as WidgetSettings | undefined
                  if (restored) {
                    set({ settings: restored })
                    return
                  }
                }
              } catch {
                // ignore
              }
            }
            set({ settings: initial ? { ...buildDefaults(id), ...initial } : buildDefaults(id) })
          },
          snapshot: () => get().settings,
          snapshotNormalized: () => {
            const s = get().settings
            if (!s) return null
            const merged = normalize(s, STATIC_DEFAULTS)
            return trimInactiveBranches(merged)
          },
          validateNow: () => {
            const current = get().snapshot()
            if (!current)
              return { ok: false, issues: [{ path: 'settings', message: 'Не инициализировано' }] }
            return validateWidgetSettingsCurrent(current)
          },
          getErrors: (prefix?: string) => {
            const r = get().validateNow()
            const issues = r.issues || []
            if (!prefix) return issues
            return issues.filter(i => i.path.startsWith(prefix))
          },
          prepareForSave: () => {
            const n = get().snapshotNormalized()
            if (!n)
              return {
                ok: false as const,
                issues: [{ path: 'settings', message: 'Не инициализировано' }]
              }
            const canonical = canonicalize(n)
            const v = validateWidgetSettingsCanonical(canonical)
            if (!v.ok) return { ok: false as const, issues: v.issues }
            return { ok: true as const, data: canonical as unknown as typeof n }
          },
          ...createFormSlice(patchForm),
          ...createDisplaySlice(patchDisplay),
          ...createIntegrationSlice(patchIntegration)
        }
      },
      { name: PERSIST_NAME, storage: mapStorage }
    )
  )
)

export default useWidgetSettingsStore

// Slice hooks for cleaner component usage
export const useFormSettings = () => {
  const settings = useWidgetSettingsStore(s => s.settings.form)
  const setCompanyLogoEnabled = useWidgetSettingsStore(s => s.setCompanyLogoEnabled)
  const setCompanyLogoFile = useWidgetSettingsStore(s => s.setCompanyLogoFile)
  const setTemplateEnabled = useWidgetSettingsStore(s => s.setTemplateEnabled)
  const setTemplateKey = useWidgetSettingsStore(s => s.setTemplateKey)
  const setTemplateImageEnabled = useWidgetSettingsStore(s => s.setTemplateImageEnabled)
  const setTemplateImageFile = useWidgetSettingsStore(s => s.setTemplateImageFile)
  const setContentPosition = useWidgetSettingsStore(s => s.setContentPosition)
  const setColorScheme = useWidgetSettingsStore(s => s.setColorScheme)
  const setCustomColor = useWidgetSettingsStore(s => s.setCustomColor)
  const setFormTitle = useWidgetSettingsStore(s => s.setFormTitle)
  const setFormDescription = useWidgetSettingsStore(s => s.setFormDescription)
  const setFormButtonText = useWidgetSettingsStore(s => s.setFormButtonText)
  const setCountdownEnabled = useWidgetSettingsStore(s => s.setCountdownEnabled)
  const setContactField = useWidgetSettingsStore(s => s.setContactField)
  const setAgreement = useWidgetSettingsStore(s => s.setAgreement)
  const setAdsInfo = useWidgetSettingsStore(s => s.setAdsInfo)
  const setRandomize = useWidgetSettingsStore(s => s.setRandomize)
  const setSectors = useWidgetSettingsStore(s => s.setSectors)
  const updateSector = useWidgetSettingsStore(s => s.updateSector)
  const addSector = useWidgetSettingsStore(s => s.addSector)
  const deleteSector = useWidgetSettingsStore(s => s.deleteSector)
  const setMessage = useWidgetSettingsStore(s => s.setMessage)

  return {
    settings,
    setCompanyLogoEnabled,
    setCompanyLogoFile,
    setTemplateEnabled,
    setTemplateKey,
    setTemplateImageEnabled,
    setTemplateImageFile,
    setContentPosition,
    setColorScheme,
    setCustomColor,
    setFormTitle,
    setFormDescription,
    setFormButtonText,
    setCountdownEnabled,
    setContactField,
    setAgreement,
    setAdsInfo,
    setRandomize,
    setSectors,
    updateSector,
    addSector,
    deleteSector,
    setMessage
  }
}

export const useDisplaySettings = () => {
  const settings = useWidgetSettingsStore(s => s.settings.display)
  const setStartShowing = useWidgetSettingsStore(s => s.setStartShowing)
  const setTimerDelay = useWidgetSettingsStore(s => s.setTimerDelay)
  const setIconType = useWidgetSettingsStore(s => s.setIconType)
  const setIconImage = useWidgetSettingsStore(s => s.setIconImage)
  const setButtonPosition = useWidgetSettingsStore(s => s.setButtonPosition)
  const setHideIcon = useWidgetSettingsStore(s => s.setHideIcon)
  const setWeekdaysEnabled = useWidgetSettingsStore(s => s.setWeekdaysEnabled)
  const setWeekdays = useWidgetSettingsStore(s => s.setWeekdays)
  const setWeekdaysOnly = useWidgetSettingsStore(s => s.setWeekdaysOnly)
  const setShowOnExit = useWidgetSettingsStore(s => s.setShowOnExit)
  const setScrollBelow = useWidgetSettingsStore(s => s.setScrollBelow)
  const setAfterOpen = useWidgetSettingsStore(s => s.setAfterOpen)
  const setFrequency = useWidgetSettingsStore(s => s.setFrequency)
  const setDontShow = useWidgetSettingsStore(s => s.setDontShow)
  const setLimits = useWidgetSettingsStore(s => s.setLimits)
  const setButtonIcon = useWidgetSettingsStore(s => s.setButtonIcon)
  const setScheduleDate = useWidgetSettingsStore(s => s.setScheduleDate)
  const setScheduleTime = useWidgetSettingsStore(s => s.setScheduleTime)

  return {
    settings,
    setStartShowing,
    setTimerDelay,
    setIconType,
    setIconImage,
    setButtonPosition,
    setHideIcon,
    setWeekdaysEnabled,
    setWeekdays,
    setWeekdaysOnly,
    setShowOnExit,
    setScrollBelow,
    setAfterOpen,
    setFrequency,
    setDontShow,
    setLimits,
    setButtonIcon,
    setScheduleDate,
    setScheduleTime
  }
}

export const useIntegrationSettings = () => {
  const settings = useWidgetSettingsStore(s => s.settings.integration)
  const setScriptSnippet = useWidgetSettingsStore(s => s.setScriptSnippet)

  return {
    settings,
    setScriptSnippet
  }
}
