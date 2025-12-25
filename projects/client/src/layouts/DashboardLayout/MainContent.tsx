import './MainContent.css'
import type { PropsWithChildren, ReactElement } from 'react'

const MainContent = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <main className="z-1 flex-1 min-h-0 flex flex-col gap-2.5 py-2.5 px-2.5 main-content-bg">
      {children}
    </main>
  )
}

export default MainContent
