export const BALLOON_GLOW_ANIMATION = {
  scale: [1, 1.12, 1],
  filter: [
    'drop-shadow(0 0 10px rgba(143,92,255,0.5))',
    'drop-shadow(0 0 40px rgba(143,92,255,0.95))',
    'drop-shadow(0 0 10px rgba(143,92,255,0.5))'
  ],
  boxShadow: [
    '0 0 6px rgba(143,92,255,0.45)',
    '0 0 48px rgba(143,92,255,0.85)',
    '0 0 6px rgba(143,92,255,0.45)'
  ]
}

export const BALLOON_GLOW_TRANSITION = {
  duration: 1.5,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: 'easeInOut'
} as const
