import { Button } from '@heroui/button'
import SvgIcon from './SvgIcon'
import { Tooltip } from '@heroui/tooltip'
import iconInfo from '@/assets/icons/info.svg'

const SimpleTooltip = ({ content, classNames }: { content: string; classNames?: string }) => {
  if (!content) return null
  return (
    <Tooltip
      content={content}
      classNames={{
        content: classNames
      }}
    >
      <Button className="min-w-0 w-min min-h-0 h-min z-1" variant="light" isIconOnly radius="full">
        <SvgIcon src={iconInfo} className="text-[#797979]" size={'20px'} />
      </Button>
    </Tooltip>
  )
}

export default SimpleTooltip
