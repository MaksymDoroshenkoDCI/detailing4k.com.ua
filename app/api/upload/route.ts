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

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const path = require('path')
      const fs = require('fs/promises')

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)

      const url = `/uploads/${fileName}`

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
