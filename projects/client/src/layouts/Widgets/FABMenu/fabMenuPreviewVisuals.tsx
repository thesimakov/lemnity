import SvgIcon from '@/components/SvgIcon'
import iconAdd from '@/assets/icons/add.svg'
import iconBalloon from '@/assets/icons/balloon.svg'
import { motion } from 'framer-motion'
// import { BALLOON_GLOW_ANIMATION, BALLOON_GLOW_TRANSITION } from './fabMenuPreviewAnimations'

type IconProps = {
  color: string
}

export const FabMenuBalloonIcon = (props: { alignClassName: string; color: string }) => (
  <motion.span
    // animate={BALLOON_GLOW_ANIMATION}
    // transition={BALLOON_GLOW_TRANSITION}
    className="flex items-center justify-center w-8 h-8"
    style={{ color: props.color }}
  >
    <SvgIcon
      src={iconBalloon}
      size={40}
      className={`${props.alignClassName === 'items-start text-left' ? 'scale-x-[-1]' : ''}`}
    />
  </motion.span>
)

export const FabMenuAddIcon = ({ color }: IconProps) => (
  <div style={{ color: color }} className="">
    <div className="w-8 h-8">
      <SvgIcon src={iconAdd} size={40} className="rotate-45" />
    </div>
  </div>
)
