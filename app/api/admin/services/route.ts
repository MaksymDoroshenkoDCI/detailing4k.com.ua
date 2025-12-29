import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  durationMinutes: z.number().int().positive(),
  categoryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    
    // Convert empty string to null for imageUrl
    if (body.imageUrl === '') {
      body.imageUrl = null
    }
    
    const validatedData = serviceSchema.parse(body)

    const service = await prisma.service.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        durationMinutes: validatedData.durationMinutes,
        categoryId: validatedData.categoryId || null,
        imageUrl: validatedData.imageUrl || null,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



