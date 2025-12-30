import type { RequestDevice, RequestItem, RequestStatus } from '@/services/requests'
import type { Project } from '@/stores/projectsStore'

export type { RequestStatus, RequestDevice }
export type Request = RequestItem

export type PeriodKey = '7d' | '30d' | '90d' | 'all'

export type ProjectMenuItem = { key: string; type: 'all' | 'header' | 'project'; label: string }

export const periodOptions: { key: PeriodKey; label: string; days: number | null }[] = [
  { key: '30d', label: 'За последние 30 дней', days: 30 },
  { key: '7d', label: 'За последние 7 дней', days: 7 },
  { key: '90d', label: 'За последние 90 дней', days: 90 },
  { key: 'all', label: 'За всё время', days: null }
]

export const REQUESTS_GRID_CLASS =
  'grid w-full min-w-0 grid-cols-[72px_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)]'

export const STATUS_META: Record<
  RequestStatus,
  { label: string; pill: string; row: string; menuPill: string }
> = {
  new: {
    label: 'Новая заявка',
    pill: 'bg-[#CFEAD6] text-[#1F6B3A]',
    row: 'border-[#2FB26A] bg-[#F2FFF6]',
    menuPill: 'bg-[#CFEAD6] text-[#1F6B3A]'
  },
  processed: {
    label: 'Обработан',
    pill: 'bg-[#F4CD52] text-black',
    row: 'border-default-200 bg-white',
    menuPill: 'bg-[#F4CD52] text-black'
  },
  not_processed: {
    label: 'Не обработан',
    pill: 'bg-[#F3D1D1] text-[#D31515]',
    row: 'border-[#FF3A3A] bg-[#FFF3F3]',
    menuPill: 'bg-[#F3D1D1] text-[#D31515]'
  },
  used: {
    label: 'Воспользовался',
    pill: 'bg-[#CFEAD6] text-[#1F6B3A]',
    row: 'border-default-200 bg-white',
    menuPill: 'bg-[#CFEAD6] text-[#1F6B3A]'
  }
}

export function formatTimeAndDate(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString('ru-RU')
  return `${time} / ${date}`
}

export function hostnameFromUrl(url: string) {
  try {
    const normalized =
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
    return new URL(normalized).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export type ProjectMenuModel = {
  projectById: Map<string, Project>
  projectMenuItems: ProjectMenuItem[]
  disabledKeys: Set<string>
}

export function buildProjectMenuModel(projects: Project[]): ProjectMenuModel {
  const projectById = new Map<string, Project>()
  for (const p of projects) projectById.set(p.id, p)

  const groups = new Map<string, Project[]>()
  for (const p of projects) {
    const key = hostnameFromUrl(p.websiteUrl)
    const prev = groups.get(key)
    if (prev) prev.push(p)
    else groups.set(key, [p])
  }

  const projectMenuItems: ProjectMenuItem[] = [{ key: 'all', type: 'all', label: 'Все проекты' }]
  for (const [host, ps] of Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], 'ru')
  )) {
    projectMenuItems.push({ key: `header:${host}`, type: 'header', label: `Проект - ${host}` })
    for (const p of ps) projectMenuItems.push({ key: p.id, type: 'project', label: p.name })
  }

  const disabledKeys = new Set(projectMenuItems.filter(i => i.type === 'header').map(i => i.key))

  return { projectById, projectMenuItems, disabledKeys }
}

export function getSelectedProjectLabel(
  selectedProjectId: string,
  projectById: Map<string, Project>
) {
  if (selectedProjectId === 'all') return 'Все проекты'
  return projectById.get(selectedProjectId)?.name ?? 'Проект'
}

export function buildRequestsCsv(requests: Request[], projectNameById: (id: string) => string) {
  const header = [
    'number',
    'created_at',
    'project',
    'phone',
    'email',
    'full_name',
    'prizes',
    'status',
    'device'
  ]

  const rows = requests.map(r => [
    r.number,
    r.createdAt,
    projectNameById(r.projectId),
    r.contact.phone ?? '',
    r.contact.email ?? '',
    r.fullName ?? '',
    r.prizes.join(' | '),
    STATUS_META[r.status].label,
    r.device
  ])

  const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`
  return [header, ...rows].map(row => row.map(v => csvEscape(String(v))).join(',')).join('\n')
}
