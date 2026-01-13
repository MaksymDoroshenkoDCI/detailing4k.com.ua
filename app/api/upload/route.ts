import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Configure Cloudinary inside the handler and trim values to avoid hidden spaces
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  })

  console.log('UPLOAD_API: Starting upload process')
  console.log('UPLOAD_API: Cloud name is present:', !!process.env.CLOUDINARY_CLOUD_NAME)
  console.log('UPLOAD_API: API Key is present:', !!process.env.CLOUDINARY_API_KEY)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'File must be an image or video' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'detailing4k-gallery',
          },
          (error, result) => {
            if (error) {
              console.error('CLOUDINARY_STREAM_ERROR:', error)
              reject(error)
            } else resolve(result)
          }
        )
        uploadStream.end(buffer)
      })
    }

    const result = (await uploadToCloudinary()) as any

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type
    })

  } catch (error: any) {
    console.error('UPLOAD_API_FATAL:', error)
    return NextResponse.json(
      {
        error: 'Error uploading file',
        details: error?.message || (typeof error === 'string' ? error : 'Check raw_error field'),
        raw_error: error,
        env_check: {
          has_name: !!process.env.CLOUDINARY_CLOUD_NAME,
          has_key: !!process.env.CLOUDINARY_API_KEY,
          has_secret: !!process.env.CLOUDINARY_API_SECRET
        }
      },
      { status: 500 }
    )
  }
}

