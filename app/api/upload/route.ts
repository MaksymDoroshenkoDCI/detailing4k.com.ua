import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  console.log('UPLOAD_API: Starting upload process')
  console.log('UPLOAD_API: Cloud name is present:', !!process.env.CLOUDINARY_CLOUD_NAME)
  console.log('UPLOAD_API: API Key is present:', !!process.env.CLOUDINARY_API_KEY)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (allow images and videos)
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'File must be an image or video' },
        { status: 400 }
      )
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary using a Promise-based stream
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto', // Automatically detect image or video
            folder: 'detailing4k-gallery',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
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

  } catch (error) {
    console.error('UPLOAD_API: Error uploading to Cloudinary:', error)
    return NextResponse.json(
      {
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : 'Unknown error',
        raw_error: error
      },
      { status: 500 }
    )
  }
}

