const toFiniteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback

const normalizeMinMax = (min: number, max: number): { min: number; max: number } => {
  const a = toFiniteOr(min, 0)
  const b = toFiniteOr(max, 0)
  return a <= b ? { min: a, max: b } : { min: b, max: a }
}

export const randomFloat = (min: number, max: number): number => {
  const { min: low, max: high } = normalizeMinMax(min, max)
  if (high <= low) return low
  return low + Math.random() * (high - low)
}

export const randomInt = (min: number, max: number): number => {
  const { min: low, max: high } = normalizeMinMax(min, max)
  const minInt = Math.ceil(low)
  const maxInt = Math.floor(high)
  if (maxInt <= minInt) return minInt
  return minInt + Math.floor(Math.random() * (maxInt - minInt))
}
