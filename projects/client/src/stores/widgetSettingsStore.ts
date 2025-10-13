import { create } from 'zustand'

const useWidgetSettingsStore = create<WidgetSettingsStore>()(set => {
  return {
    logoEnabled: true,
    templateEnabled: true,
    setLogoEnabled: (logoEnabled: boolean) => set({ logoEnabled }),
    setTemplateEnabled: (templateEnabled: boolean) => set({ templateEnabled })
  }
})

export default useWidgetSettingsStore

export type WidgetSettingsStore = {
  logoEnabled: boolean
  templateEnabled: boolean
  setLogoEnabled: (logoEnabled: boolean) => void
  setTemplateEnabled: (templateEnabled: boolean) => void
}
