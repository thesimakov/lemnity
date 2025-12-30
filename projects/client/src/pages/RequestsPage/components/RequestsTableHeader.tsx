import { REQUESTS_GRID_CLASS } from '../requests.model'
import { cn } from '@common/utils/cn'

const RequestsTableHeader = () => {
  return (
    <div className="overflow-x-auto">
      <div className={cn(REQUESTS_GRID_CLASS, 'divide-x divide-[#D6D6D6] text-[13px] text-black')}>
        <div className="px-4 py-2 font-medium min-w-0">Номер</div>
        <div className="px-4 py-2 font-medium min-w-0">Время / Дата</div>
        <div className="px-4 py-2 font-medium min-w-0">Контакт</div>
        <div className="px-4 py-2 font-medium min-w-0">ФИО</div>
        <div className="px-4 py-2 font-medium min-w-0">Приз</div>
        <div className="px-4 py-2 font-medium min-w-0">Статус</div>
        <div className="px-4 py-2 font-medium min-w-0">Девайс</div>
      </div>
    </div>
  )
}

export default RequestsTableHeader
