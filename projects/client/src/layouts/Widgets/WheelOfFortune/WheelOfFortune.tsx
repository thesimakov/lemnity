import type { SectorItem } from '@stores/widgetSettings/types'

type WheelOfFortuneProps = {
  sectors?: number | SectorItem[]
}

const MAX_SECTORS = 12
const DEFAULT_COLORS = [
  '#43BCFF', // indigo-600
  '#D9D9D9', // cyan-500
  '#43BCFF', // green-500
  '#D9D9D9', // yellow-500
  '#43BCFF', // orange-500
  '#D9D9D9', // red-500
  '#43BCFF', // violet-500
  '#D9D9D9', // blue-500
  '#43BCFF', // emerald-500
  '#D9D9D9', // amber-500
  '#43BCFF', // pink-500
  '#D9D9D9' // indigo-500
]

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = degToRad(angleDeg)
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function sectorPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, startAngle)
  const end = polar(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z'
  ].join(' ')
}

function normalizeSectors(input?: number | SectorItem[]): SectorItem[] {
  if (Array.isArray(input)) {
    const items = input.filter(Boolean).slice(0, MAX_SECTORS)
    if (items.length < 2) {
      return normalizeSectors(6) // fallback to 6 if too few provided
    }
    return items.map((item, i) => ({
      ...item,
      color: item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
    }))
  }
  const requested = typeof input === 'number' ? input : 8 // sensible default
  const count = Math.max(2, Math.min(MAX_SECTORS, requested))
  return Array.from({ length: count }).map((_, i) => ({
    id: String(i),
    mode: 'text',
    text: '',
    color: DEFAULT_COLORS[i % DEFAULT_COLORS.length]
  })) as SectorItem[]
}

const WheelOfFortune = ({ sectors }: WheelOfFortuneProps) => {
  const items = normalizeSectors(sectors)
  const count = items.length

  const size = 360 // px
  const cx = size / 2
  const cy = size / 2
  const totalR = size / 2
  const outerRingW = 14
  const innerRingW = 6
  const ringGap = 2
  const rOuter = totalR - outerRingW / 2
  const rInner = totalR - outerRingW - ringGap - innerRingW / 2
  const rDisk = totalR - outerRingW - ringGap - innerRingW - ringGap
  const step = 360 / count

  return (
    <div className="relative aspect-square w-full">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          <linearGradient
            id="outerRimGrad"
            x1="0"
            y1="0"
            x2={String(size)}
            y2={String(size)}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0E5DF8" />
            <stop offset="31%" stopColor="#0F4EE0" />
            <stop offset="96%" stopColor="#1026A3" />
            <stop offset="100%" stopColor="#10249F" />
          </linearGradient>
          <linearGradient
            id="innerRimGrad"
            x1="0"
            y1={String(size)}
            x2={String(size)}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFB90" />
            <stop offset="14%" stopColor="#FBEA78" />
            <stop offset="24%" stopColor="#F8DC65" />
            <stop offset="27%" stopColor="#E6C758" />
            <stop offset="34%" stopColor="#C5A041" />
            <stop offset="40%" stopColor="#AD8330" />
            <stop offset="45%" stopColor="#9E7226" />
            <stop offset="49%" stopColor="#996C22" />
            <stop offset="52%" stopColor="#9D7126" />
            <stop offset="56%" stopColor="#AA8131" />
            <stop offset="60%" stopColor="#BE9B42" />
            <stop offset="64%" stopColor="#DABE5B" />
            <stop offset="69%" stopColor="#FBE878" />
            <stop offset="77%" stopColor="#FFFFAA" />
            <stop offset="83%" stopColor="#FBE878" />
            <stop offset="100%" stopColor="#A4631B" />
          </linearGradient>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="url(#outerRimGrad)"
          strokeWidth={outerRingW}
        />
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="url(#innerRimGrad)"
          strokeWidth={innerRingW}
        />

        {/* Content disk */}
        <circle cx={cx} cy={cy} r={rDisk} fill="#ffffff" />

        {items.map((item, i) => {
          const start = i * step - 90
          const end = (i + 1) * step - 90
          const mid = start + step / 2
          const path = sectorPath(cx, cy, rDisk, start, end)
          const labelR = (rDisk - 20) * 0.65
          const lp = polar(cx, cy, labelR, mid)
          const iconR = (rDisk - 20) * 0.45
          const ip = polar(cx, cy, iconR, mid)
          return (
            <g key={item.id ?? i}>
              <path d={path} fill={item.color} />
              {item.mode === 'text' && item.text ? (
                <text
                  x={lp.x}
                  y={lp.y}
                  fill="#ffffff"
                  className="text-3xl font-bold text-white text-center align-center"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${lp.x}, ${lp.y})`}
                >
                  {item.text}
                </text>
              ) : null}
              {item.mode === 'icon' && item.icon ? (
                <image
                  href={item.icon}
                  x={ip.x - 12}
                  y={ip.y - 12}
                  width={24}
                  height={24}
                  transform={`rotate(${mid}, ${ip.x}, ${ip.y})`}
                />
              ) : null}
            </g>
          )
        })}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={10} fill="#0a1f6f" />
        <circle cx={cx} cy={cy} r={7} fill="#1736C1" />
      </svg>
    </div>
  )
}

export default WheelOfFortune
