import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  Project as ApiProject,
  CreateProjectDto,
  UpdateProjectDto
} from '@lemnity/api-sdk/models'
import * as projectsService from '@/services/projects'

export interface MetricDetails {
  value: number
  desktop: number
  mobile: number
}

export interface ProjectMetrics {
  visitors: MetricDetails
  impressions: MetricDetails
  conversions: MetricDetails
  activity: MetricDetails
}

export interface Project {
  id: string
  name: string
  websiteUrl: string
  enabled: boolean
  metrics: ProjectMetrics
  createdAt: Date
}

type ProjectsState = {
  projects: Project[]
  isLoading: boolean
  error: string | null
  hasLoaded: boolean
}
type ProjectsActions = {
  loadProjects: () => Promise<void>
  ensureLoaded: () => Promise<void>
  createProject: (title: string, websiteUrl: string, enabled?: boolean) => Promise<void>
  toggleProjectEnabled: (id: string, enabled: boolean) => Promise<void>
}
export type ProjectsStore = ProjectsState & ProjectsActions

const initialProjects: Project[] = []

function mapApiToStoreProject(p: ApiProject): Project {
  return {
    id: p.id,
    name: p.title,
    websiteUrl: p.websiteUrl,
    enabled: p.enabled,
    createdAt: new Date(p.createdAt),
    metrics: {
      visitors: { value: 0, desktop: 0, mobile: 0 },
      impressions: { value: 0, desktop: 0, mobile: 0 },
      conversions: { value: 0, desktop: 0, mobile: 0 },
      activity: { value: 0, desktop: 0, mobile: 0 }
    }
  }
}

export const useProjectsStore = create<ProjectsStore>()(
  devtools(
    (set, get) => ({
      projects: initialProjects,
      isLoading: false,
      error: null,
      hasLoaded: false,

      loadProjects: async () => {
        set({ isLoading: true, error: null }, false, 'projects/load:start')
        try {
          const projects = await projectsService.listProjects()
          const mapped = projects
            .map(mapApiToStoreProject)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          set(
            { projects: mapped, isLoading: false, hasLoaded: true },
            false,
            'projects/load:success'
          )
        } catch {
          set(
            { isLoading: false, error: 'Failed to load projects', hasLoaded: true },
            false,
            'projects/load:error'
          )
        }
      },

      ensureLoaded: async () => {
        const { hasLoaded, isLoading } = get()
        if (hasLoaded || isLoading) return
        await get().loadProjects()
      },

      createProject: async (title, websiteUrl, enabled = true) => {
        console.log('project create', title, websiteUrl, enabled)
        set({ isLoading: true, error: null }, false, 'projects/create:start')
        try {
          const payload: CreateProjectDto = { title, websiteUrl, enabled }
          const created = await projectsService.createProject(payload)
          const mapped = mapApiToStoreProject(created)
          set(
            state => ({ projects: [mapped, ...state.projects], isLoading: false }),
            false,
            'projects/create:success'
          )
        } catch (e) {
          set(
            { isLoading: false, error: 'Failed to create project' },
            false,
            'projects/create:error'
          )
          throw e // ВАЖНО: пробрасываем, чтобы модалка не закрылась
        }
      },

      toggleProjectEnabled: async (id: string, enabled: boolean) => {
        set({ error: null }, false, 'projects/toggle:start')
        try {
          const patch: UpdateProjectDto = { enabled }
          const updated = await projectsService.updateProject(id, patch)
          const mapped = mapApiToStoreProject(updated)
          set(
            state => ({ projects: state.projects.map(p => (p.id === id ? mapped : p)) }),
            false,
            'projects/toggle:success'
          )
        } catch {
          set({ error: 'Failed to update project' }, false, 'projects/toggle:error')
        }
      }
    }),
    { name: 'projectsStore' }
  )
)
