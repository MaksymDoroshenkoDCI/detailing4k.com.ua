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
    console.log('[GALLERY_POST] Starting request processing')

    const { error } = await requireAdmin(request)
    if (error) {
      console.log('[GALLERY_POST] Admin auth failed')
      return error
    }

    const body = await request.json()
    console.log('[GALLERY_POST] Request body:', JSON.stringify(body, null, 2))
    console.log('[GALLERY_POST] Images count:', body.images?.length)

    if (body.images?.[0]?.startsWith('data:')) {
      console.warn('[GALLERY_POST] WARNING: Base64 data detected in gallery images')
    }

    console.log('[GALLERY_POST] Validating data with schema')
    const validatedData = galleryImageSchema.parse(body)
    console.log('[GALLERY_POST] Validation successful')

    console.log('[GALLERY_POST] Creating database record with data:', {
      title: validatedData.title,
      description: validatedData.description,
      imagesCount: validatedData.images.length,
      serviceId: validatedData.serviceId
    })

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

    console.log('[GALLERY_POST] Successfully created image:', image.imageId)
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[GALLERY_POST] Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('[GALLERY_POST] Database/Server error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}



