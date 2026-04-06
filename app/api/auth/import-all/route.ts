import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const exportPath = path.join(process.cwd(), 'scripts', 'full-data-export.json')
    if (!fs.existsSync(exportPath)) {
      return NextResponse.json({ error: 'Export file not found in repo' }, { status: 404 })
    }

    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'))
    console.log('📥 Importing data from ' + exportPath)

    // Helper for upserting
    // Admins
    for (const item of data.admin) {
      await prisma.admin.upsert({
        where: { email: item.email },
        update: { name: item.name, role: item.role },
        create: { ...item, createdAt: new Date(item.createdAt) }
      })
    }

    // Categories
    for (const item of data.serviceCategory) {
      await prisma.serviceCategory.upsert({
        where: { categoryId: item.categoryId },
        update: { name: item.name, description: item.description },
        create: { ...item, createdAt: new Date(item.createdAt) }
      })
    }

    // Services
    for (const item of data.service) {
      await prisma.service.upsert({
        where: { serviceId: item.serviceId },
        update: { name: item.name, description: item.description, price: item.price, durationMinutes: item.durationMinutes },
        create: { ...item, price: item.price, createdAt: new Date(item.createdAt) }
      })
    }

    // Gallery
    for (const item of data.galleryImage) {
      await prisma.galleryImage.upsert({
        where: { imageId: item.imageId },
        update: { title: item.title, description: item.description, images: item.images },
        create: { ...item, createdAt: new Date(item.createdAt) }
      })
    }

    // Testimonials
    for (const item of data.testimonial) {
      await prisma.testimonial.upsert({
        where: { testimonialId: item.testimonialId },
        update: { text: item.text, approved: item.approved },
        create: { ...item, datePosted: new Date(item.datePosted) }
      })
    }

    return NextResponse.json({ 
      message: '✅ Success! Data imported from JSON.',
      imported: {
        services: data.service.length,
        gallery: data.galleryImage.length,
        testimonials: data.testimonial.length
      }
    })

  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
