import Header from '@/layouts/Header/Header'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import { useProjectsStore } from '@/stores/projectsStore'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import RequestsTableHeader from './components/RequestsTableHeader'
import RequestRow from './components/RequestRow'
import RequestsToolbar from './layouts/RequestsToolbar'
import {
  buildProjectMenuModel,
  buildRequestsCsv,
  getSelectedProjectLabel,
  periodOptions,
  type PeriodKey,
  type Request,
  type RequestStatus
} from './requests.model'
import * as requestsService from '@/services/requests'

const RequestsPage = (): ReactElement => {
  const projects = useProjectsStore(s => s.projects)
  const ensureProjectsLoaded = useProjectsStore(s => s.ensureLoaded)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const [periodKey, setPeriodKey] = useState<PeriodKey>('30d')

  const isMountedRef = useRef(true)
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [requestsError, setRequestsError] = useState<string | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    void ensureProjectsLoaded()
    return () => {
      isMountedRef.current = false
    }
  }, [ensureProjectsLoaded])

  const loadRequests = useCallback(async () => {
    setIsLoadingRequests(true)
    setRequestsError(null)
    try {
      const res = await requestsService.listRequests({
        period: periodKey,
        projectId: selectedProjectId === 'all' ? undefined : selectedProjectId
      })
      if (!isMountedRef.current) return
      setRequests(res.requests)
    } catch {
      if (!isMountedRef.current) return
      setRequestsError('Не удалось загрузить заявки')
    } finally {
      if (isMountedRef.current) setIsLoadingRequests(false)
    }
  }, [periodKey, selectedProjectId])

  useEffect(() => {
    void loadRequests()
  }, [loadRequests])

  const { projectById, projectMenuItems, disabledKeys } = useMemo(
    () => buildProjectMenuModel(projects),
    [projects]
  )

  const selectedProjectLabel = useMemo(
    () => getSelectedProjectLabel(selectedProjectId, projectById),
    [projectById, selectedProjectId]
  )

  const filteredRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [requests]
  )

  const handleStatusChange = useCallback(
    (id: string, next: RequestStatus) => {
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: next } : r)))
      void requestsService
        .updateRequestStatus(id, next)
        .then(updated => {
          if (!isMountedRef.current) return
          setRequests(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)))
        })
        .catch(() => {
          if (!isMountedRef.current) return
          void loadRequests()
        })
    },
    [loadRequests]
  )

  const handleDelete = useCallback(
    (id: string) => {
      setRequests(prev => prev.filter(r => r.id !== id))
      void requestsService.deleteRequest(id).catch(() => void loadRequests())
    },
    [loadRequests]
  )

  const downloadCsv = useCallback(() => {
    const csv = buildRequestsCsv(
      filteredRequests,
      projectId => projectById.get(projectId)?.name ?? projectId
    )
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'requests.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [filteredRequests, projectById])

  return (
    <div className="h-full flex flex-col">
      <Header />
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <RequestsToolbar
            selectedProjectLabel={selectedProjectLabel}
            projectMenuItems={projectMenuItems}
            disabledKeys={disabledKeys}
            onProjectChange={setSelectedProjectId}
            periodKey={periodKey}
            onPeriodChange={setPeriodKey}
            onDownload={downloadCsv}
            periodOptions={periodOptions}
          />

          <div className="flex flex-col gap-3 min-h-0">
            <RequestsTableHeader />
            <div className="flex flex-col gap-3 min-h-0">
              {requestsError && (
                <div className="rounded-lg border border-danger-200 bg-danger-50 p-6 text-[14px] text-danger-700">
                  {requestsError}
                </div>
              )}
              {isLoadingRequests && (
                <div className="rounded-lg border border-default-200 bg-default-50 p-6 text-[14px] text-default-700">
                  Загрузка заявок…
                </div>
              )}
              {filteredRequests.map(r => (
                <div key={r.id} className="overflow-x-auto">
                  <RequestRow
                    request={r}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
              {!isLoadingRequests && !requestsError && !filteredRequests.length && (
                <div className="rounded-lg border border-default-200 bg-default-50 p-6 text-[14px] text-default-700">
                  По выбранным фильтрам заявок нет
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}

export default memo(RequestsPage)
