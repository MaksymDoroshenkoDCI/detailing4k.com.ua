import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, isAdmin } = loginSchema.parse(body)

    if (isAdmin) {
      const admin = await prisma.admin.findUnique({
        where: { email },
      })

      if (!admin) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const isValid = await verifyPassword(password, admin.passwordHash)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const token = generateToken({
        userId: admin.adminId,
        email: admin.email,
        role: 'admin',
      })

      const response = NextResponse.json({
        user: {
          adminId: admin.adminId,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        message: 'Login successful',
      })

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    } else {
      const client = await prisma.client.findUnique({
        where: { email },
      })

      if (!client) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const isValid = await verifyPassword(password, client.passwordHash)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const token = generateToken({
        userId: client.clientId,
        email: client.email,
        role: 'client',
      })

      const response = NextResponse.json({
        user: {
          clientId: client.clientId,
          name: client.name,
          email: client.email,
          phone: client.phone,
        },
        message: 'Login successful',
      })

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



