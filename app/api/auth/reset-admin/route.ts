import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const email = 'mdoroshenko1@gmail.com'
    const password = 'admin123'
    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.admin.upsert({
      where: { email },
      update: {
        passwordHash,
        role: 'SuperAdmin',
      },
      create: {
        name: 'Maxim Doroshenko',
        email,
        passwordHash,
        role: 'SuperAdmin',
      },
    })

    return NextResponse.json({ message: '✅ Admin password for ' + email + ' has been reset to admin123' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
