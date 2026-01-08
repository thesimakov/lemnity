import './NavigationSidebar.css'
import iconProjects from '@/assets/icons/projects.svg'
import iconSuccessList from '@/assets/icons/success-list.svg'
import iconWallet from '@/assets/icons/wallet.svg'
import iconPaperAirplane from '@/assets/icons/paper-airplane.svg'
import iconEnvelope from '@/assets/icons/open-envelope.svg'
import iconTelephone from '@/assets/icons/telephone-call.svg'
import iconStatistics from '@/assets/icons/statistics-circle-chart.svg'
import { Listbox, ListboxItem } from '@heroui/listbox'
import { Tooltip } from '@heroui/tooltip'
import SvgIcon from '@/components/SvgIcon'
import iconDocumentation from '@/assets/icons/doc.svg'
import { memo, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSidebarStore } from '@/stores/sidebarStore'
import { Button } from '@heroui/button'
import { useLocation } from 'react-router-dom'
import { getNewRequestsCount } from '@/services/requests'

interface MenuItem {
  key: string
  icon: ReactNode
  label: string
  badge?: string | number
  href?: string
}

const NavigationSidebar = () => {
  const { isVisible } = useSidebarStore()
  const location = useLocation()

  const [newRequestsCount, setNewRequestsCount] = useState<number | null>(null)

  const activeKey = (() => {
    const path = location.pathname
    if (path.startsWith('/analytics')) return 'analytics'
    if (path.startsWith('/requests')) return 'requests'
    if (path.startsWith('/projects')) return 'projects'
    if (path === '/' || path.startsWith('/dashboard')) return 'projects'
    return 'projects'
  })()

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const count = await getNewRequestsCount()
        if (!isMounted) return
        setNewRequestsCount(count)
      } catch {
        if (!isMounted) return
        setNewRequestsCount(null)
      }
    }

    void load()

    const intervalId = window.setInterval(() => {
      void load()
    }, 30_000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: 'projects',
        icon: <img src={iconProjects} alt="Проекты" className="w-5 h-5" />,
        label: 'Проекты',
        href: '/'
      },
      {
        key: 'analytics',
        icon: <img src={iconStatistics} alt="Аналитика" className="w-5 h-5" />,
        label: 'Аналитика',
        href: '/analytics'
      },
      {
        key: 'requests',
        icon: <img src={iconSuccessList} alt="Заявки" className="w-5 h-5" />,
        label: 'Заявки',
        badge: newRequestsCount && newRequestsCount > 0 ? newRequestsCount : undefined,
        href: '/requests'
      },
      {
        key: 'payment',
        icon: <img src={iconWallet} alt="Оплата и тарифы" className="w-5 h-5" />,
        label: 'Оплата и тарифы'
      }
    ],
    [newRequestsCount]
  )

  const getFooter = () => (
    <div className="rounded-lg border border-default-200 flex flex-col justify-between gap-3.5 pt-1.5 p-3.5">
      <div className="flex items-center gap-3.5">
        <div className="flex-1 rounded-lg relative">
          <p className="font-normal text-default-900 text-center">Техническая поддержка</p>
        </div>
      </div>
      <Button
        radius="sm"
        color="default"
        variant="solid"
        className="w-full h-10 rounded-2.5 font-normal text-base"
      >
        Написать
      </Button>
      <a
        href="mailto:support@lemnity.ru"
        className="text-sm text-black text-center font-normal underline underline-offset-2"
      >
        support@lemnity.ru
      </a>
      <div className="flex justify-center gap-4">
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <a href="https://t.me/lemnity_ru" target="_blank">
            <img src={iconPaperAirplane} alt="Телеграм" className="w-4 h-4" />
          </a>
        </button>
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <a href="mailto:support@lemnity.ru" target="_blank">
            <img src={iconEnvelope} alt="Почта" className="w-4 h-4" />
          </a>
        </button>
        <button className="text-default-400 hover:text-default-600 transition-colors">
          <a href="tel:+79821300012" target="_blank">
            <img src={iconTelephone} alt="Телефон" className="w-4 h-4" />
          </a>
        </button>
      </div>
    </div>
  )

  const getExpandedMenu = useCallback(
    (menuItems: MenuItem[]) => {
      return (
        <Listbox
          aria-label="Navigation menu"
          // defaultSelectedKeys={['analytics']} почему-то not working
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
              classNames={{
                base: activeKey === item.key ? 'bg-default-200' : ''
              }}
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
      )
    },
    [activeKey]
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
                  className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-default-100 transition-colors relative ${activeKey === item.key ? 'bg-default-200' : ''}`}
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
          getExpandedMenu(menuItems)
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
