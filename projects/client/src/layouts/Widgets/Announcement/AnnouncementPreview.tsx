import { useState } from "react"
import AnnouncementWidget from "./AnnouncementWidget"
import CountdownAnnouncementWidget from "./CountdownAnnouncementWidget"

type PreviewVariant = 'countdown' | 'announcement'

const AnnouncementPreview = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error
  const [variant, setVariant] = useState<PreviewVariant>('countdown')

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {variant === 'announcement' && <AnnouncementWidget />}
      {variant === 'countdown' && (
        <>
          <span className="text-xs py-3.75">Главный экран</span>
          <div className="w-fit h-fit scale-40 -translate-y-[31%]">
            <CountdownAnnouncementWidget variant="countdown" />
          </div>

          <span className="text-xs py-3.75 -translate-y-79.5">Экран формы</span>
          <div className="w-fit h-fit scale-40 -translate-y-[92%]">
            <CountdownAnnouncementWidget variant="form" />
          </div>

          <span className="text-xs py-3.75 -translate-y-159">Экран выигрыша</span>
          <div className="w-fit h-fit scale-40 -translate-y-[153%]">
            <CountdownAnnouncementWidget variant="reward" />
          </div>
        </>
      )}
    </div>
  )
}

export default AnnouncementPreview
