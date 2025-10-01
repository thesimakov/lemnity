import './MainContent.css'
import type { PropsWithChildren, ReactElement } from 'react'

const MainContent = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <main className="flex-1 min-h-0 flex flex-col gap-[10px] py-[10px] px-[19px] main-content-bg">
      {children}
    </main>
  )
}

export default MainContent
