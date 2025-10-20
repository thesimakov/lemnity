import type { PropsWithChildren, ReactElement } from 'react'
import { memo } from 'react'

const FullWidthLayout = ({ children }: PropsWithChildren): ReactElement => {
  return <div className="h-screen w-full">{children}</div>
}

export default memo(FullWidthLayout)
