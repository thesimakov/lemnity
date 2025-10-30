export const CURRENT_VERSION = 3

export type Migration = (input: unknown) => unknown

// Register migrations from older versions to the next
const MIGRATIONS: Record<number, Migration> = {
  // 1 -> 2: rename form.contacts.initials -> form.contacts.name
  1: input => {
    try {
      const data = typeof structuredClone === 'function' ? structuredClone(input) : (JSON.parse(JSON.stringify(input)) as unknown)
      type ContactsShape = { initials?: unknown; name?: unknown }
      type FormShape = { contacts?: ContactsShape }
      type SettingsShape = { form?: FormShape }

      const root = data as SettingsShape
      const contacts = root.form?.contacts
      if (contacts && typeof contacts === 'object') {
        if (typeof contacts.initials !== 'undefined' && typeof contacts.name === 'undefined') {
          contacts.name = contacts.initials
          delete contacts.initials
        }
      }
      return root as unknown
    } catch {
      return input
    }
  },
  // 2 -> 3: add backgroundColor to form.formTexts.button if missing
  2: input => {
    try {
      const data = typeof structuredClone === 'function' ? structuredClone(input) : (JSON.parse(JSON.stringify(input)) as unknown)
      type ButtonShape = { text?: unknown; color?: unknown; backgroundColor?: unknown }
      type FormTextsShape = { button?: ButtonShape }
      type FormShape = { formTexts?: FormTextsShape }
      type SettingsShape = { form?: FormShape }

      const root = data as SettingsShape
      const button = root.form?.formTexts?.button
      if (button && typeof button === 'object') {
        if (typeof button.backgroundColor === 'undefined') {
          button.backgroundColor = '#0F52E6' // Default from defaults.ts
        }
      }
      return root as unknown
    } catch {
      return input
    }
  }
}

export function migrateToCurrent(input: unknown, fromVersion?: number): { data: unknown; version: number } {
  // If version is unknown, assume 1 (initial version) to run all migrations safely
  let version = typeof fromVersion === 'number' ? fromVersion : 1
  let data = input
  while (version < CURRENT_VERSION) {
    const migrate = MIGRATIONS[version]
    if (!migrate) break
    data = migrate(data)
    version += 1
  }
  return { data, version: CURRENT_VERSION }
}


