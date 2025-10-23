export const CURRENT_VERSION = 1

export type Migration = (input: unknown) => unknown

// Register migrations from older versions to the next
const MIGRATIONS: Record<number, Migration> = {
  // 0 -> 1 example
  // 0: (input) => input,
}

export function migrateToCurrent(input: unknown, fromVersion?: number): { data: unknown; version: number } {
  let version = typeof fromVersion === 'number' ? fromVersion : CURRENT_VERSION
  let data = input
  while (version < CURRENT_VERSION) {
    const migrate = MIGRATIONS[version]
    if (!migrate) break
    data = migrate(data)
    version += 1
  }
  return { data, version: CURRENT_VERSION }
}


