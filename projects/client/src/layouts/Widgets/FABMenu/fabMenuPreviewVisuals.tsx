import SvgIcon from '@/components/SvgIcon'
import iconAdd from '@/assets/icons/add.svg'
import iconBalloon from '@/assets/icons/balloon.svg'
import { motion } from 'framer-motion'
import { BALLOON_GLOW_ANIMATION, BALLOON_GLOW_TRANSITION } from './fabMenuPreviewAnimations'

export const FabMenuBalloonIcon = ({ alignClassName }: { alignClassName: string }) => (
  <motion.span
    animate={BALLOON_GLOW_ANIMATION}
    transition={BALLOON_GLOW_TRANSITION}
    className="flex items-center justify-center"
  >
    <SvgIcon
      src={iconBalloon}
      size={40}
      className={`text-white ${alignClassName === 'items-start text-left' ? 'scale-x-[-1]' : ''}`}
    />
  </motion.span>
)

export const FabMenuAddIcon = () => (
  <SvgIcon src={iconAdd} size={40} className="text-white rotate-45" />
)
