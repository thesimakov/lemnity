import { Button } from '@heroui/button'
import logo from '../../assets/logos/logo.svg'
import ProfileButton from '../ProfileButton/ProfileButton'
import './Header.css'
import iconLight from '../../assets/icons/light.svg'
import iconBell from '../../assets/icons/bell.svg'
import { useSidebarStore } from '@/stores/sidebarStore'
import SvgIcon from '@/components/SvgIcon'
import iconMenuToggle from '@/assets/icons/menu-open.svg'

const Header = () => {
  const { toggle, isVisible } = useSidebarStore()

  return (
    <header className="h-[70px] min-h-[70px] flex items-center justify-between mx-5">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Lemnity" className="h-8 w-auto" />
        </a>
        <Button
          isIconOnly
          radius="full"
          className="p-0 m-0 bg-transparent w-[38px] h-[38px]"
          color="default"
          onClick={toggle}
          aria-label={isVisible ? 'Скрыть боковую панель' : 'Показать боковую панель'}
        >
          <SvgIcon src={iconMenuToggle} className="text-gray-500" size="24px" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500 flex flex-row gap-2.5">
          <Button isIconOnly radius="full" className="bg-white w-[38px] h-[38px]" color="default">
            <img src={iconLight} alt="Light" className="h-8 w-auto w-[19px] h-[19px]" />
          </Button>
          <Button isIconOnly radius="full" className="bg-white w-[38px] h-[38px]" color="default">
            <img src={iconBell} alt="Bell" className="h-8 w-auto w-[19px] h-[19px]" />
          </Button>
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}

export default Header
