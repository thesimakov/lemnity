import type { IntegrationUpdater } from './types'

export type IntegrationActions = {
  setScriptSnippet: (s: string) => void
}

export type IntegrationSlice = {
  integrationSettingsUpdater: IntegrationUpdater
} & IntegrationActions

export const createIntegrationSlice = (
  updateIntegration: IntegrationUpdater
): IntegrationSlice => ({
  integrationSettingsUpdater: updateIntegration,
  setScriptSnippet: snippet => updateIntegration(i => ({ ...i, scriptSnippet: snippet }))
})
