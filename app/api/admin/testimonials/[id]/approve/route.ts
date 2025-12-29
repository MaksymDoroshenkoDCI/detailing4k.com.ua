import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

const approveSchema = z.object({
  approved: z.boolean(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    const { approved } = approveSchema.parse(body)

    const testimonial = await prisma.testimonial.update({
      where: { testimonialId: params.id },
      data: { approved },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



