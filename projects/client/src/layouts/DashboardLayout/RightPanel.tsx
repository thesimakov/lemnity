import type { PropsWithChildren } from 'react'

type RightPanelProps = PropsWithChildren<{
  widthClassName?: string
}>

const RightPanel = ({ children, widthClassName = 'w-[52px]' }: RightPanelProps) => {
  return (
    <aside
      className={`${widthClassName} h-full flex flex-col gap-[10px] py-2 items-center rounded-r-lg bg-white`}
    >
      {children}
    </aside>
  )
}

export default RightPanel
