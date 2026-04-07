const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importAll() {
  const exportPath = path.join(__dirname, 'full-data-export.json')
  if (!fs.existsSync(exportPath)) {
    console.error('❌ Export file not found!')
    return
  }

  const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'))

  try {
    console.log('📥 Importing data into the NEW database...')

    // 1. Admins
    console.log('👤 Importing Admins...')
    for (const item of data.admin) {
      try {
        await prisma.admin.upsert({
          where: { email: item.email },
          update: {
            name: item.name,
            passwordHash: item.passwordHash,
            role: item.role,
          },
          create: {
            adminId: item.adminId,
            name: item.name,
            email: item.email,
            passwordHash: item.passwordHash,
            role: item.role,
            createdAt: new Date(item.createdAt),
          }
        })
        console.log(`   ✓ Admin ${item.email} imported`)
      } catch (e) {
        console.error(`   ✗ Admin ${item.email} failed:`, e.message)
      }
    }

    // 2. Clients
    console.log('👥 Importing Clients...')
    for (const item of data.client) {
      try {
        await prisma.client.upsert({
          where: { email: item.email },
          update: item,
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Client ${item.email} imported`)
      } catch (e) {
        console.error(`   ✗ Client ${item.email} failed:`, e.message)
      }
    }

    // 3. Service Categories
    console.log('📁 Importing Categories...')
    for (const item of data.serviceCategory) {
      try {
        await prisma.serviceCategory.upsert({
          where: { categoryId: item.categoryId },
          update: item,
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Category ${item.name} imported`)
      } catch (e) {
        console.error(`   ✗ Category ${item.name} failed:`, e.message)
      }
    }

    // 4. Services
    console.log('📦 Importing Services...')
    for (const item of data.service) {
      try {
        await prisma.service.upsert({
          where: { serviceId: item.serviceId },
          update: item,
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Service ${item.name} imported`)
      } catch (e) {
        console.error(`   ✗ Service ${item.name} failed:`, e.message)
      }
    }

    // 5. Gallery Images
    console.log('🖼️ Importing Gallery Images...')
    for (const item of data.galleryImage) {
      try {
        let parsedImages = item.images
        if (typeof parsedImages === 'string') {
          try {
            parsedImages = JSON.parse(parsedImages)
          } catch (e) {
            parsedImages = [parsedImages]
          }
        }
        
        await prisma.galleryImage.upsert({
          where: { imageId: item.imageId },
          update: {
            ...item,
            images: JSON.stringify(parsedImages),
          },
          create: {
            ...item,
            images: JSON.stringify(parsedImages), 
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Gallery Image ${item.title} imported`)
      } catch (e) {
        console.error(`   ✗ Gallery Image ${item.title} failed:`, e.message)
      }
    }

    // 6. Testimonials
    console.log('⭐ Importing Testimonials...')
    for (const item of data.testimonial) {
      try {
        await prisma.testimonial.upsert({
          where: { testimonialId: item.testimonialId },
          update: item,
          create: {
            ...item,
            datePosted: new Date(item.datePosted),
          }
        })
        console.log(`   ✓ Testimonial from ${item.clientName} imported`)
      } catch (e) {
        console.error(`   ✗ Testimonial failed:`, e.message)
      }
    }

    // 7. Consultations
    console.log('💬 Importing Consultations...')
    for (const item of data.consultation) {
      try {
        await prisma.consultation.upsert({
          where: { consultationId: item.consultationId },
          update: item,
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Consultation from ${item.name} imported`)
      } catch (e) {
        console.error(`   ✗ Consultation failed:`, e.message)
      }
    }

    // 8. Recommendations
    console.log('💡 Importing Recommendations...')
    for (const item of data.recommendation) {
      try {
        await prisma.recommendation.upsert({
          where: { recommendationId: item.recommendationId },
          update: item,
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
          }
        })
        console.log(`   ✓ Recommendation ${item.recommendationId} imported`)
      } catch (e) {
        console.error(`   ✗ Recommendation failed:`, e.message)
      }
    }

    // 9. Bookings
    console.log('📅 Importing Bookings...')
    for (const item of data.booking) {
      try {
        await prisma.booking.upsert({
          where: { bookingId: item.bookingId },
          update: item,
          create: {
            ...item,
            bookingDate: new Date(item.bookingDate),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
        console.log(`   ✓ Booking ${item.bookingId} imported`)
      } catch (e) {
        console.error(`   ✗ Booking failed:`, e.message)
      }
    }

    console.log('✅ Import complete!')

  } catch (error) {
    console.error('❌ General error during import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importAll()
