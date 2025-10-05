import { http } from '@common/api/http'
import { API } from '@common/api/endpoints'
import type {
  ProjectsResponse,
  CreateProjectResponse,
  CreateProjectDto,
  GetProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  UpdateProjectDto
} from '@lemnity/api-sdk'

export async function listProjects() {
  const res = await http.get<ProjectsResponse>(API.PROJECTS.LIST)
  return res.data.projects
}

export async function createProject(payload: CreateProjectDto) {
  const res = await http.post<CreateProjectResponse>(API.PROJECTS.CREATE, payload)
  return res.data
}

export async function getProject(id: string) {
  const res = await http.get<GetProjectResponse>(API.PROJECTS.PROJECT(id))
  return res.data
}

export async function updateProject(id: string, project: UpdateProjectDto) {
  const res = await http.patch<UpdateProjectResponse>(API.PROJECTS.PROJECT(id), project)
  return res.data
}

export async function deleteProject(id: string) {
  const res = await http.delete<DeleteProjectResponse>(API.PROJECTS.PROJECT(id))
  return res.data
}
