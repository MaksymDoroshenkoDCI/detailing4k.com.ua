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
  imageUrl: z.string().url().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    const validatedData = serviceSchema.parse(body)

    const service = await prisma.service.update({
      where: { serviceId: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        durationMinutes: validatedData.durationMinutes,
        categoryId: validatedData.categoryId || null,
        imageUrl: validatedData.imageUrl || null,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    await prisma.service.delete({
      where: { serviceId: params.id },
    })

    return NextResponse.json({ message: 'Service deleted' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



