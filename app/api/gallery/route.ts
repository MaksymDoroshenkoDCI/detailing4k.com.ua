import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    const galleryImages = await prisma.galleryImage.findMany({
      where: serviceId ? { serviceId } : undefined,
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedImages = galleryImages.map((img) => {
      let parsedImages = []
      try {
        parsedImages = typeof img.images === 'string' ? JSON.parse(img.images) : img.images
      } catch (e) {
        // Якщо не вдалося розпарсити, можливо це просто рядок або масив
        parsedImages = Array.isArray(img.images) ? img.images : []
      }

      return {
        ...img,
        images: Array.isArray(parsedImages) ? parsedImages : [],
      }
    })

    return NextResponse.json(formattedImages)
  } catch (error: any) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error?.message || String(error),
        details: error,
        prisma_check: !!prisma
      },
      { status: 500 }
    )
  }
}



