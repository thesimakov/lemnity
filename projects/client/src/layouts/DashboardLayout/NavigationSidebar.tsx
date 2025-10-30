import './NavigationSidebar.css'
import iconProjects from '@/assets/icons/projects.svg'
import iconSuccessList from '@/assets/icons/success-list.svg'
import iconWallet from '@/assets/icons/wallet.svg'
import iconPaperAirplane from '@/assets/icons/paper-airplane.svg'
import iconEnvelope from '@/assets/icons/open-envelope.svg'
import iconTelephone from '@/assets/icons/telephone.svg'
import { Listbox, ListboxItem } from '@heroui/listbox'
import { Tooltip } from '@heroui/tooltip'
import SvgIcon from '@/components/SvgIcon'
import iconDocumentation from '@/assets/icons/doc.svg'
import { memo } from 'react'
import { useSidebarStore } from '@/stores/sidebarStore'

interface MenuItem {
  key: string
  icon: React.ReactNode
  label: string
  badge?: string | number
  href?: string
}

const NavigationSidebar = () => {
  const { isVisible } = useSidebarStore()

  const menuItems: MenuItem[] = [
    {
      key: 'projects',
      icon: <img src={iconProjects} alt="Проекты" className="w-5 h-5" />,
      label: 'Проекты',
      href: '/'
    },
    {
      key: 'requests',
      icon: <img src={iconSuccessList} alt="Заявки" className="w-5 h-5" />,
      label: 'Заявки',
      badge: 999
    },
    {
      key: 'payment',
      icon: <img src={iconWallet} alt="Оплата и тарифы" className="w-5 h-5" />,
      label: 'Оплата и тарифы'
    }
  ]

  const getFooter = () => (
    <div className="rounded-lg border border-default-200 flex flex-col justify-between gap-3.5 pt-1.5 p-3.5">
      <div className="flex items-center gap-3.5">
        <div className="flex-1 bg-gray-200 rounded-lg relative p-3.5 gap-3.5">
          <p className="text-sm font-normal text-default-900 text-center">Ваш менеджер</p>
          <p className="text-sm font-semibold text-default-900 text-center">Иван Иванов</p>
          <p className="text-xs text-default-500 text-center">[#000874]</p>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success border-2 border-background rounded-full"></div>
        </div>
      </div>
      <a
        href="mailto:support@lemnity.ru"
        className="text-sm text-black text-center font-normal hover:underline"
      >
        support@lemnity.ru
      </a>
      <div className="flex justify-center gap-4">
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <img src={iconPaperAirplane} alt="Выйти" className="w-4 h-4" />
        </button>
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <img src={iconEnvelope} alt="Выйти" className="w-4 h-4" />
        </button>
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <img src={iconTelephone} alt="Выйти" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <aside
      className={`${isVisible ? 'w-60 px-[19px]' : 'w-16 px-3'} h-full flex flex-col justify-between py-[18px] rounded-l-lg sidebar-bg transition-all duration-300 ease-in-out`}
    >
      <nav className="flex flex-col gap-1">
        {!isVisible ? (
          <div className="flex flex-col gap-3.5">
            {menuItems.map(item => (
              <Tooltip key={item.key} content={item.label} placement="right">
                <a
                  href={item.href || '#'}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-default-100 transition-colors relative"
                >
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-success text-white text-[9px] font-normal px-1.5 py-0.5 leading-3.5 rounded-full h-[18px] text-center min-w-[18px]">
                      {typeof item.badge === 'number' && item.badge > 999
                        ? '999+'
                        : String(item.badge)}
                    </span>
                  )}
                </a>
              </Tooltip>
            ))}
          </div>
        ) : (
          <Listbox
            aria-label="Navigation menu"
            defaultSelectedKeys={['projects']}
            variant="flat"
            classNames={{
              list: 'p-0 gap-3.5'
            }}
            itemClasses={{
              title: 'text-base'
            }}
          >
            {menuItems.map(item => (
              <ListboxItem
                key={item.key}
                startContent={item.icon}
                href={item.href || ''}
                endContent={
                  item.badge && (
                    <span className="bg-success text-white text-[9px] font-normal px-2.5 py-0.5 leading-3.5 rounded-full h-[18px] text-center">
                      {typeof item.badge === 'number' && item.badge > 999
                        ? '999+'
                        : String('+ ' + item.badge)}
                    </span>
                  )
                }
              >
                {item.label}
              </ListboxItem>
            ))}
          </Listbox>
        )}

        <hr className="w-full h-px mx-auto border-0 bg-default-300" />
      </nav>

      {isVisible && (
        <>
          <a
            href="https://help.lemnity.ru"
            target="_blank"
            className="gap-2 flex flex-row justify-center mt-auto mb-2.5"
          >
            <div>
              <SvgIcon src={iconDocumentation} size={'20px'} />
            </div>
            <span className="text-normal">Документация</span>
          </a>
          {getFooter()}
        </>
      )}
    </aside>
  )
}

export default memo(NavigationSidebar)
