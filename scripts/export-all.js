const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:detailing4k_password@localhost:5433/detailing4k_db?schema=public"
    }
  }
})

async function exportAll() {
  try {
    console.log('📤 Exporting everything from local DB (localhost:5433)...')
    
    const tables = [
      'client',
      'serviceCategory',
      'service',
      'booking',
      'galleryImage',
      'testimonial',
      'consultation',
      'recommendation',
      'admin',
      'post',
    ]

    const data = {}

    for (const table of tables) {
      try {
        data[table] = await prisma[table].findMany()
        console.log(`   ✓ Exported ${table}: ${data[table].length}`)
      } catch (e) {
        console.log(`   ✗ Table ${table} does not exist or error: ${e.message.split('\n')[0]}`)
        data[table] = []
      }
    }

    const exportPath = path.join(__dirname, 'full-data-export.json')
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2))
    
    console.log(`✅ Final data saved to: ${exportPath}`)
    
  } catch (error) {
    console.error('❌ General error during export:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportAll()
