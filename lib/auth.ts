import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface TokenPayload {
  userId: string
  email: string
  role: 'client' | 'admin'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(token: string | null) {
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  if (payload.role === 'admin') {
    return await prisma.admin.findUnique({
      where: { adminId: payload.userId },
      select: {
        adminId: true,
        name: true,
        email: true,
        role: true,
      },
    })
  } else {
    return await prisma.client.findUnique({
      where: { clientId: payload.userId },
      select: {
        clientId: true,
        name: true,
        email: true,
        phone: true,
      },
    })
  }
}



