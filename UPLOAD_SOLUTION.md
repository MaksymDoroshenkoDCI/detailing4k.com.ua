# 📸 Рішення для завантаження зображень на Vercel

## Проблема

На Vercel файлова система read-only, тому неможливо записувати файли в `/public/uploads`. 

## Тимчасове рішення (поточне)

Зараз використовується base64 encoding - зображення зберігаються як data URLs. Це працює, але має обмеження:
- Збільшує розмір зображення на ~33%
- Може бути проблемою для великих файлів
- Не оптимально для продуктивності

## Рекомендоване рішення: Vercel Blob Storage

Для продакшну рекомендується використовувати Vercel Blob Storage.

### Крок 1: Встановіть @vercel/blob

```bash
npm install @vercel/blob
```

### Крок 2: Оновіть app/api/upload/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob Storage
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Крок 3: Створіть Blob Storage на Vercel

1. Vercel Dashboard → ваш проект → **Storage**
2. **Create Database** → **Blob**
3. Скопіюйте `BLOB_READ_WRITE_TOKEN`
4. Додайте як `BLOB_READ_WRITE_TOKEN` в Environment Variables

### Крок 4: Перезапустіть деплой

Після налаштування перезапустіть деплой.

## Альтернативне рішення: Cloudinary

Якщо не хочете використовувати Vercel Blob Storage, можна використати Cloudinary:

### Крок 1: Встановіть cloudinary

```bash
npm install cloudinary
```

### Крок 2: Оновіть app/api/upload/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to base64
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Крок 3: Створіть акаунт Cloudinary

1. Перейдіть на [cloudinary.com](https://cloudinary.com)
2. Створіть безкоштовний акаунт
3. Скопіюйте credentials з Dashboard
4. Додайте в Environment Variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Поточний стан

Зараз використовується base64 data URLs як тимчасове рішення. Це працює, але для кращої продуктивності рекомендується перейти на Vercel Blob Storage або Cloudinary.

