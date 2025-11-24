import { z } from 'zod'
import { widgetSchemas } from './widgets/index.js'

const combineSchemas = (schemas: z.ZodTypeAny[]) =>
  schemas.reduce<z.ZodTypeAny | null>((acc, schema) => {
    if (!acc) return schema
    return z.union([acc, schema])
  }, null) ?? z.never()

export const WidgetSettingsSchema = combineSchemas(widgetSchemas)

export type CanonicalWidgetSettings = z.infer<typeof WidgetSettingsSchema>
export type Issue = { path: string; message: string }

export function validate(settings: unknown): { ok: boolean; issues: Issue[] } {
  const parsed = WidgetSettingsSchema.safeParse(settings)
  if (parsed.success) return { ok: true, issues: [] }
  return { ok: false, issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }
}

// Legacy exports for backward compatibility during migration
export const validateCanonical = validate