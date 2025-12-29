import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const testimonialSchema = z.object({
  text: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
  clientName: z.string().optional(),
})

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        datePosted: 'desc',
      },
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = testimonialSchema.parse(body)

    // Try to get current user
    const token = request.cookies.get('token')?.value
    let clientId = null

    if (token) {
      const { getCurrentUser } = await import('@/lib/auth')
      const user = await getCurrentUser(token)
      if (user && 'clientId' in user) {
        clientId = user.clientId
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientId,
        text: validatedData.text,
        rating: validatedData.rating,
        clientName: validatedData.clientName,
        approved: false, // Requires admin approval
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



