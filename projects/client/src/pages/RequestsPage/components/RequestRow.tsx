import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { memo, useCallback } from 'react'
import iconChevronDown from '@/assets/icons/chevron-down.svg'
import iconDesktop from '@/assets/icons/desktop.svg'
import iconPhone from '@/assets/icons/phone-portrait.svg'
import iconBin from '@/assets/icons/bin.svg'
import {
  formatTimeAndDate,
  REQUESTS_GRID_CLASS,
  STATUS_META,
  type Request,
  type RequestStatus
} from '../requests.model'
import { cn } from '@common/utils/cn'
import SvgIcon from '@/components/SvgIcon'

type RequestRowProps = {
  request: Request
  onStatusChange: (id: string, next: RequestStatus) => void
  onDelete: (id: string) => void
}

const RequestRow = ({ request, onStatusChange, onDelete }: RequestRowProps) => {
  const meta = STATUS_META[request.status]

  const deviceLabel =
    request.device === 'desktop'
      ? 'С ПК'
      : request.device === 'mobile_ios'
        ? 'С телефона / iOS'
        : 'С телефона / Android'

  const deviceIcon = request.device === 'desktop' ? iconDesktop : iconPhone

  const handleAction = useCallback(
    (key: React.Key) => {
      const action = String(key)
      if (action === 'delete') {
        onDelete(request.id)
        return
      }
      if (
        action === 'new' ||
        action === 'processed' ||
        action === 'not_processed' ||
        action === 'used'
      ) {
        onStatusChange(request.id, action)
      }
    },
    [onDelete, onStatusChange, request.id]
  )

  return (
    <div
      className={cn(
        'rounded-[10px] border overflow-hidden transition-colors',
        meta.row,
        'focus-within:ring-2 focus-within:ring-[#5B55FF]/25'
      )}
    >
      <div className={cn(REQUESTS_GRID_CLASS, 'divide-x divide-[#D6D6D6]')}>
        <div className="px-4 py-4 text-base min-w-0">{request.number}</div>

        <div className="px-4 py-4 text-sm min-w-0 break-words">
          {formatTimeAndDate(request.createdAt)}
        </div>

        <div className="px-4 py-3 flex flex-col gap-2 min-w-0">
          {request.contact.phone && (
            <span className="inline-flex w-fit max-w-full items-center rounded-full bg-[#F3EFE6] px-3 py-1 text-xs break-all">
              {request.contact.phone}
            </span>
          )}
          {request.contact.email && (
            <span className="inline-flex w-fit max-w-full items-center rounded-full bg-[#F3EFE6] px-3 py-1 text-xs break-all">
              {request.contact.email}
            </span>
          )}
        </div>

        <div className="px-4 py-4 text-xs min-w-0 break-words">{request.fullName ?? ''}</div>

        <div className="px-4 py-3 flex flex-wrap flex-col items-start gap-2 min-w-0">
          {request.prizes.map(prize => (
            <span
              key={prize}
              className="h-min inline-flex rounded-full bg-[#CFEAD6] px-3 py-1 text-xs text-[#1F6B3A]"
            >
              {prize}
            </span>
          ))}
        </div>

        <div className="px-4 py-3 flex items-center min-w-0">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Button
                variant="light"
                className={cn(
                  'h-7 min-h-7 rounded-full px-2.5 gap-2',
                  meta.pill,
                  'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B55FF]/25'
                )}
                startContent={
                  <SvgIcon src={iconChevronDown} alt="" className="w-min h-3.5" size={18} />
                }
              >
                <span className="text-[12px] font-normal">{meta.label}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Статус заявки"
              onAction={handleAction}
              classNames={{
                base: 'p-3 w-[200px]'
              }}
              itemClasses={{
                base: 'px-0 py-0 data-[hover=true]:bg-transparent'
              }}
            >
              <DropdownItem key="processed">
                <div
                  className={cn(
                    'w-full h-9 rounded-full px-4 flex items-center justify-center text-[14px]',
                    STATUS_META.processed.menuPill
                  )}
                >
                  {STATUS_META.processed.label}
                </div>
              </DropdownItem>
              <DropdownItem key="not_processed">
                <div
                  className={cn(
                    'w-full h-9 rounded-full px-4 flex items-center justify-center text-[14px]',
                    STATUS_META.not_processed.menuPill
                  )}
                >
                  {STATUS_META.not_processed.label}
                </div>
              </DropdownItem>
              <DropdownItem key="used">
                <div
                  className={cn(
                    'w-full h-9 rounded-full px-4 flex items-center justify-center text-[14px]',
                    STATUS_META.used.menuPill
                  )}
                >
                  {STATUS_META.used.label}
                </div>
              </DropdownItem>
              <DropdownItem key="delete">
                <div className="w-full h-10 rounded-[10px] border-2 border-[#FF3A3A] text-[#FF3A3A] px-4 flex items-center justify-center gap-2 text-[16px]">
                  Удалить <SvgIcon src={iconBin} alt="" className="w-min h-4" size={18} />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="px-4 py-4 flex items-center gap-2 text-[13px] text-black min-w-0">
          <SvgIcon src={deviceIcon} alt="" className="w-min h-4 opacity-80" size={18} />
          <span className="min-w-0 break-words">{deviceLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(RequestRow)
