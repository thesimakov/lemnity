import { canonicalizeWidgetConfig } from './canonicalize.js'

export const CURRENT_VERSION = 0

/**
 * Пример добавления миграции при изменении схемы:
 *
 * type Migration = (input: unknown) => unknown
 * const MIGRATIONS: Record<number, Migration> = {
 *   0: raw => {
 *     const copy = canonicalizeWidgetConfig(raw)
 *     // 1) правим структуру под новую схему
 *     //    пример: copy.fields?.template?.legacyFlag && delete copy.fields.template.legacyFlag
 *     // 2) снова прогоняем через canonicalizeWidgetConfig, чтобы привести результат к актуальному виду
 *     return canonicalizeWidgetConfig(copy)
 *   }
 * }
 *
 * Затем:
 * - увеличить CURRENT_VERSION (например, до 1)
 * - внутри migrateToCurrent пройти циклом по MIGRATIONS пока версия < CURRENT_VERSION
 * - каждую миграцию писать так, чтобы она была идемпотентной и не падала на неожиданных данных
 */
export function migrateToCurrent(
  input: unknown,
  _fromVersion?: number
): { data: unknown; version: number } {
  const data = canonicalizeWidgetConfig(input)
  return { data, version: CURRENT_VERSION }
}

