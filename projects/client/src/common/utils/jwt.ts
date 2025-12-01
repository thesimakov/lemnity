export type JwtPayload = Record<string, unknown> & { exp?: number }

const EXPIRY_DELTA_MS = 10 * 60 * 1000 // 10 минут до истечения считаются «скоро истечёт»

function decodeBase64Url(b64url: string): string {
  const b64 = b64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(b64url.length / 4) * 4, '=')
  if (typeof atob !== 'function') {
    throw new Error('Base64 decoding is not supported in this environment')
  }
  const binary = atob(b64)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function parseJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
  try {
    const [, payloadUrl] = token.split('.')
    if (!payloadUrl) return null
    const json = decodeBase64Url(payloadUrl)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export function isTokenExpiredOrNearExpiry(
  accessToken: string,
  currentTimeMs: number = Date.now(),
  renewBeforeMs: number = EXPIRY_DELTA_MS
): boolean {
  const payload = parseJwt(accessToken)
  if (!payload || typeof payload.exp !== 'number') return true
  const expMs = payload.exp * 1000
  return expMs <= currentTimeMs + renewBeforeMs
}
