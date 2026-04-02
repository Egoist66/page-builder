import type { H3Event } from 'h3'
import { SignJWT, jwtVerify } from 'jose'
import type { Role } from '~~/prisma/generated/client'

export interface JWTPayload {
  userId: number
  email: string
  role: Role
}

const getJwtSecret = () => {
  const secret = useRuntimeConfig().jwtSecret
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const salt = crypto.randomUUID()
  const saltedData = new Uint8Array([...encoder.encode(salt), ...new Uint8Array(hashBuffer)])
  const finalHash = await crypto.subtle.digest('SHA-256', saltedData)
  return salt + ':' + Array.from(new Uint8Array(finalHash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const saltedData = new Uint8Array([...encoder.encode(salt), ...new Uint8Array(hashBuffer)])
  const finalHash = await crypto.subtle.digest('SHA-256', saltedData)
  const computedHash = Array.from(new Uint8Array(finalHash)).map(b => b.toString(16).padStart(2, '0')).join('')

  return hash === computedHash
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromEvent(event: H3Event): Promise<JWTPayload | null> {
  const token = getCookie(event, 'auth_token')
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, 'auth_token', { path: '/' })
}

export function requireAuth(event: H3Event, allowedRoles?: Role[]) {
  const user = event.context.user as JWTPayload | undefined
  if (!user) {
    throw createError({ statusCode: 401, message: 'Требуется авторизация' })
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }
  return user
}
