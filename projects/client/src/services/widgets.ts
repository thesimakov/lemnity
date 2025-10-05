import { request } from '@common/api/httpWrapper.ts'
import { API } from '@common/api/endpoints.ts'
import type { Widget, CreateWidgetDto, UpdateWidgetDto } from '@lemnity/api-sdk'

export async function listWidgets(projectId: string): Promise<Widget[]> {
  const res = await request<Widget[]>(`${API.WIDGETS.LIST}?projectId=${projectId}`, {
    method: 'GET'
  })
  return res.data
}

export async function getWidget(id: string): Promise<Widget> {
  const res = await request<Widget>(API.WIDGETS.WIDGET(id), { method: 'GET' })
  return res.data
}

export async function createWidget(payload: CreateWidgetDto): Promise<Widget> {
  const res = await request<Widget, CreateWidgetDto>(API.WIDGETS.CREATE, {
    method: 'POST',
    data: payload
  })
  return res.data
}

export async function updateWidget(id: string, payload: UpdateWidgetDto): Promise<Widget> {
  const res = await request<Widget, UpdateWidgetDto>(API.WIDGETS.WIDGET(id), {
    method: 'PATCH',
    data: payload
  })
  return res.data
}

export async function toggleWidgetEnabled(id: string, enabled: boolean): Promise<Widget> {
  const res = await request<Widget, { enabled: boolean }>(`${API.WIDGETS.WIDGET(id)}/toggle`, {
    method: 'PATCH',
    data: { enabled }
  })
  return res.data
}

export async function deleteWidget(id: string): Promise<Widget> {
  const res = await request<Widget>(API.WIDGETS.WIDGET(id), { method: 'DELETE' })
  return res.data
}
