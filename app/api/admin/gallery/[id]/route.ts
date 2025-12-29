import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

const galleryImageSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  beforeImageUrl: z.string().min(1, 'Before image URL is required'),
  afterImageUrl: z.string().min(1, 'After image URL is required'),
  serviceId: z.string().uuid().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    const validatedData = galleryImageSchema.parse(body)

    const image = await prisma.galleryImage.update({
      where: { imageId: params.id },
      data: {
        title: validatedData.title || null,
        description: validatedData.description || null,
        beforeImageUrl: validatedData.beforeImageUrl,
        afterImageUrl: validatedData.afterImageUrl,
        serviceId: validatedData.serviceId || null,
      },
    })

    return NextResponse.json(image)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating gallery image:', error)
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

    await prisma.galleryImage.delete({
      where: { imageId: params.id },
    })

    return NextResponse.json({ message: 'Gallery image deleted' })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

