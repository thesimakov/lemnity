import './MainContent.css'
import type { PropsWithChildren, ReactElement } from 'react'

const MainContent = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <main className="z-1 flex-1 min-h-0 flex flex-col gap-[10px] py-[10px] px-[19px] main-content-bg overflow-y-auto">
      {children}
    </main>
  )
}

export default MainContent
