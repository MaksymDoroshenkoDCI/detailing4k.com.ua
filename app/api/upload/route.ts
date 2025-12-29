import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Check buffer size (base64 will be ~33% larger)
      const maxBase64Size = 10 * 1024 * 1024 // ~10MB base64 = ~7.5MB original
      if (buffer.length > maxBase64Size) {
        return NextResponse.json(
          { error: 'File is too large. Please use images smaller than 7MB' },
          { status: 400 }
        )
      }
      
      // Convert to base64 for storage
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`

      // On Vercel, we can't write to file system
      // Return base64 data URL as temporary solution
      // In production, you should use Vercel Blob Storage, Cloudinary, or AWS S3
      
      // For now, return base64 data URL
      // This will work but is not optimal for large images
      const url = dataUrl

      return NextResponse.json({ url })
    } catch (error) {
      console.error('Error processing file:', error)
      return NextResponse.json(
        { error: 'Error processing file', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
