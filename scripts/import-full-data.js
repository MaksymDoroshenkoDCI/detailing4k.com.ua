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

    // 1. Admins (skip if already exists based on email)
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
      } catch (e) {
        console.error(`   ✗ Admin ${item.email} failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 2. Clients (skip if already exists based on email)
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
      } catch (e) {
        console.error(`   ✗ Client ${item.email} failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 3. Service Categories
    console.log('📁 Importing Categories...')
    for (const item of data.serviceCategory) {
      try {
        await prisma.serviceCategory.create({
          data: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Category ${item.name} failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 4. Services
    console.log('📦 Importing Services...')
    for (const item of data.service) {
      try {
        await prisma.service.create({
          data: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Service ${item.name} failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 5. Gallery Images
    console.log('🖼️ Importing Gallery Images...')
    for (const item of data.galleryImage) {
      try {
        // Handle images field (JSON string)
        let parsedImages = item.images
        if (typeof parsedImages === 'string') {
          try {
            parsedImages = JSON.parse(parsedImages)
          } catch (e) {
            parsedImages = [parsedImages]
          }
        }
        
        await prisma.galleryImage.create({
          data: {
            ...item,
            images: JSON.stringify(parsedImages), 
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Gallery Image ${item.title} failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 6. Testimonials
    console.log('⭐ Importing Testimonials...')
    for (const item of data.testimonial) {
      try {
        await prisma.testimonial.create({
          data: {
            ...item,
            datePosted: new Date(item.datePosted),
          }
        })
      } catch (e) {
        console.error(`   ✗ Testimonial failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 7. Consultations
    console.log('💬 Importing Consultations...')
    for (const item of data.consultation) {
      try {
        await prisma.consultation.create({
          data: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Consultation failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 8. Recommendations
    console.log('💡 Importing Recommendations...')
    for (const item of data.recommendation) {
      try {
        await prisma.recommendation.create({
          data: {
            ...item,
            createdAt: new Date(item.createdAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Recommendation failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 9. Bookings
    console.log('📅 Importing Bookings...')
    for (const item of data.booking) {
      try {
        await prisma.booking.create({
          data: {
            ...item,
            bookingDate: new Date(item.bookingDate),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Booking failed: ${e.message.split('\n')[0]}`)
      }
    }

    // 10. Posts
    console.log('📝 Importing Posts...')
    for (const item of data.post) {
      try {
        await prisma.post.create({
          data: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        })
      } catch (e) {
        console.error(`   ✗ Post failed: ${e.message.split('\n')[0]}`)
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
