import alerCirccle from '@/assets/icons/alert-circle.svg'
import SvgIcon from './SvgIcon'

const TechnicalDisclaimer = () => {
  return (
    // Бессмысленно сейчас разбивать эту строку, потому что prettier
    // всё равно собьёт форматирование
    <div className="rounded-full p-4 absolute z-10 bottom-7.5 right-1/2 translate-x-1/2 w-100 h-11.25 bg-black flex flex-row items-center text-center">
      <div className="w-5 h-5 shrink-0 mr-2">
        <SvgIcon src={alerCirccle} preserveOriginalColors />
      </div>
      <span className="text-white text-xs leading-3.75">
        На платформе ведутся плановые технические работы, поэтому некоторые функции могут быть недоступны
      </span>
    </div>
  )
}

export default TechnicalDisclaimer

