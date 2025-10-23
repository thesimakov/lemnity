// Generic deep path utilities (object-focused; arrays are left intact unless explicitly targeted)

export type PathSegment = string | number

export const splitPath = (path: string): PathSegment[] =>
  path.split('.').map(key => (key.match(/^\d+$/) ? Number(key) : key))

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

// WeakMap cache for merged objects per current reference
const __mergeCache: WeakMap<object, unknown> = new WeakMap()

export function setDeep<T>(source: T, path: PathSegment[], nextValue: unknown): T {
  if (path.length === 0) return nextValue as T
  const [head, ...tail] = path

  if (Array.isArray(source)) {
    const idx = typeof head === 'number' ? head : Number(head)
    const clone = source.slice() as unknown[]
    const prev = clone[idx]
    const updated = setDeep(prev as unknown, tail, nextValue)
    clone[idx] = updated
    return clone as unknown as T
  }

  const obj = (source ?? {}) as Record<string, unknown>
  const key = String(head)
  const prev = obj[key]
  const container = isObject(prev) || Array.isArray(prev) ? prev : {}
  const updatedChild = setDeep(container as unknown, tail, nextValue)
  return { ...(obj as object), [key]: updatedChild } as T
}

export function mergeDeep<T>(source: T, path: PathSegment[], partial: Record<string, unknown>): T {
  const target = getDeep(source, path)
  const merged = { ...(isObject(target) ? target : {}), ...partial }
  return setDeep(source, path, merged)
}

export function getDeep<T>(source: T, path: PathSegment[]): unknown {
  let cur: unknown = source as unknown
  for (const seg of path) {
    if (cur == null) return undefined
    if (Array.isArray(cur)) {
      const idx = typeof seg === 'number' ? seg : Number(seg)
      cur = (cur as unknown[])[idx]
    } else {
      const obj = cur as Record<string, unknown>
      cur = obj[String(seg)]
    }
  }
  return cur
}

// Effective defaults helpers
export function withDefaults<T extends object>(current: T | undefined, defaults: T): T {
  if (!current) return defaults
  // Shallow merge but preserve referential equality when no changes
  let changed = false
  const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) }
  for (const [k, v] of Object.entries(current as Record<string, unknown>)) {
    if (result[k] !== v) changed = true
    result[k] = v
  }
  return changed ? (result as T) : defaults
}

export function withDefaultsPath<T extends object>(root: unknown, path: string, defaults: T): T {
  const current = getDeep(root, splitPath(path)) as T | undefined
  if (!current) return defaults
  // Cache merged result per current reference to keep snapshot stable between calls
  const cached = __mergeCache.get(current as unknown as object) as T | undefined
  if (cached) return cached
  const merged = withDefaults(current, defaults)
  __mergeCache.set(current as unknown as object, merged)
  return merged
}

// Generic deep merge for objects (arrays are replaced)
export function mergeObjectsDeep<T extends object, U extends object>(base: T, over: U): T & U {
  if (!base) return over as T & U
  if (!over) return base as T & U
  if (Array.isArray(base) || Array.isArray(over)) return over as T & U
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  const entries = Object.entries(over as Record<string, unknown>)
  for (const [k, v] of entries) {
    const prev = result[k]
    if (isObject(prev) && isObject(v)) {
      result[k] = mergeObjectsDeep(
        prev as Record<string, unknown>,
        v as Record<string, unknown>
      ) as unknown
    } else {
      result[k] = v
    }
  }
  return result as T & U
}
