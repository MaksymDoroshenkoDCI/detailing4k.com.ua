import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

const galleryImageSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  images: z.array(z.string()).max(10, 'Maximum 10 images allowed').default([]),
  beforeImageUrl: z.string().optional().nullable(),
  afterImageUrl: z.string().optional().nullable(),
  serviceId: z.string().uuid().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    console.log('API Gallery POST body images count:', body.images?.length)
    if (body.images?.[0]?.startsWith('data:')) {
      console.warn('WARNING: Base64 data detected in gallery images')
    }
    const validatedData = galleryImageSchema.parse(body)

    const image = await prisma.galleryImage.create({
      data: {
        title: validatedData.title || null,
        description: validatedData.description || null,
        images: JSON.stringify(validatedData.images),
        beforeImageUrl: validatedData.beforeImageUrl || null,
        afterImageUrl: validatedData.afterImageUrl || null,
        serviceId: validatedData.serviceId || null,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        details: error
      },
      { status: 500 }
    )
  }
}



