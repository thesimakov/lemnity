import SvgIcon from '@/components/SvgIcon'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import iconCode from '@/assets/icons/website-code.svg'
const IntegrationTab = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-3xl font-normal leading-2">Внедрите механику в свой бизнес</span>
      <span className="text-xl ">(платформу)</span>
      <hr className="border-[#C0C0C0]" />
      <div className="flex">
        <SvgIcon src={iconCode} size={'100px'} className="w-min text-[#725DFF]" />
      </div>
      <hr className="border-[#C0C0C0]" />
      <div>
        <span>Скрипт</span>{' '}
        <a className="text-[#725DFF]" href="https://help.lemnity.ru" target="_blank">
          [ инструкция ]
        </a>
      </div>
      <BorderedContainer className="flex flex-row justify-between items-center">
        <span
          style={{
            display: 'inline-block',
            maxWidth: 320,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            verticalAlign: 'middle'
          }}
        >
          {
            "<script id='pixel-script-poptin' src='https://cdn.popt.in/pixel.js?id=c8916a370ba66' async='true'></script>"
          }
        </span>{' '}
        <div className="flex flex-row items-center gap-2">
          <div className="h-5 w-px bg-gray-900 mx-2 ml-auto" />
          <span
            className="text-[#797979] cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                "<script id='pixel-script-poptin' src='https://cdn.popt.in/pixel.js?id=c8916a370ba66' async='true'></script>"
              )
            }}
          >
            Скопировать
          </span>
        </div>
      </BorderedContainer>
      <span className="text-[#797979]">
        {
          'Добавьте код виджета в HTML-код всех страниц сайта. Код нужно разместить в пределах тегов <head> </head> или <body> </body> ВАЖНО! Если наш код уже добавлен на ваш сайт, повторно вставлять его не нужно. Достаточно одной установки — все новые виджеты подключатся автоматически'
        }
      </span>
    </div>
  )
}

export default IntegrationTab
