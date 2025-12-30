import { http } from '@common/api/http'
import { API } from '@common/api/endpoints'

export type RequestStatus = 'new' | 'processed' | 'not_processed' | 'used'
export type RequestDevice = 'desktop' | 'mobile_ios' | 'mobile_android'

export type RequestContact = {
  phone?: string
  email?: string
}

export type RequestItem = {
  id: string
  number: string
  createdAt: string
  projectId: string
  widgetId: string
  fullName?: string
  contact: RequestContact
  prizes: string[]
  status: RequestStatus
  device: RequestDevice
}

export type ListRequestsParams = {
  projectId?: string
  period?: '7d' | '30d' | '90d' | 'all'
  status?: RequestStatus
  skip?: number
  take?: number
}

export type RequestsResponse = {
  requests: RequestItem[]
  total: number
}

export async function listRequests(params: ListRequestsParams) {
  const res = await http.get<RequestsResponse>(API.REQUESTS.LIST, { params })
  return res.data
}

export async function getNewRequestsCount() {
  const res = await listRequests({ status: 'new', period: 'all', take: 1, skip: 0 })
  return res.total
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const res = await http.patch<RequestItem>(API.REQUESTS.REQUEST(id), { status })
  return res.data
}

export async function deleteRequest(id: string) {
  const res = await http.delete<{ id: string }>(API.REQUESTS.REQUEST(id))
  return res.data
}
