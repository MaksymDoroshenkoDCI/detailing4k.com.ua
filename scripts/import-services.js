const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Використовує DATABASE_URL з environment або аргументу
const databaseUrl = process.env.DATABASE_URL || process.argv[2]

if (!databaseUrl) {
  console.error('❌ Помилка: DATABASE_URL не вказано!')
  console.log('\nВикористання:')
  console.log('  DATABASE_URL="your-url" node scripts/import-services.js')
  console.log('або')
  console.log('  node scripts/import-services.js "your-database-url"')
  process.exit(1)
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function importServices() {
  try {
    console.log('📥 Імпорт послуг в продакшн БД...')
    
    // Завантажуємо експортовані дані
    const exportPath = path.join(__dirname, 'services-export.json')
    
    if (!fs.existsSync(exportPath)) {
      console.error(`❌ Файл не знайдено: ${exportPath}`)
      console.log('Спочатку виконайте: node scripts/export-services.js')
      process.exit(1)
    }
    
    const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'))
    console.log(`Завантажено: ${exportData.categories.length} категорій, ${exportData.services.length} послуг`)
    
    // Імпортуємо категорії
    console.log('\n📁 Імпорт категорій...')
    const categoryMap = {} // для збереження старих ID -> нових ID
    
    for (const category of exportData.categories) {
      try {
        // Перевіряємо чи існує категорія з таким ім'ям
        const existing = await prisma.serviceCategory.findFirst({
          where: { name: category.name },
        })
        
        if (existing) {
          categoryMap[category.categoryId] = existing.categoryId
          console.log(`  ✓ Категорія вже існує: ${category.name}`)
        } else {
          // Створюємо нову категорію (згенерує новий ID)
          const newCategory = await prisma.serviceCategory.create({
            data: {
              name: category.name,
              description: category.description,
            },
          })
          categoryMap[category.categoryId] = newCategory.categoryId
          console.log(`  ✓ Створено категорію: ${category.name}`)
        }
      } catch (error) {
        console.error(`  ✗ Помилка при імпорті категорії ${category.name}:`, error.message)
      }
    }
    
    // Імпортуємо послуги
    console.log('\n📦 Імпорт послуг...')
    let imported = 0
    let skipped = 0
    
    for (const service of exportData.services) {
      try {
        // Перевіряємо чи існує послуга з таким ім'ям
        const existing = await prisma.service.findFirst({
          where: { name: service.name },
        })
        
        if (existing) {
          skipped++
          console.log(`  ⏭️  Послуга вже існує: ${service.name}`)
        } else {
          // Мапимо categoryId на новий
          const newCategoryId = service.categoryId ? categoryMap[service.categoryId] : null
          
          // Створюємо нову послугу
          await prisma.service.create({
            data: {
              name: service.name,
              description: service.description,
              price: service.price,
              durationMinutes: service.durationMinutes,
              categoryId: newCategoryId,
              imageUrl: service.imageUrl,
            },
          })
          imported++
          console.log(`  ✓ Створено послугу: ${service.name}`)
        }
      } catch (error) {
        console.error(`  ✗ Помилка при імпорті послуги ${service.name}:`, error.message)
      }
    }
    
    console.log('\n✅ Імпорт завершено!')
    console.log(`   Створено послуг: ${imported}`)
    console.log(`   Пропущено (вже існують): ${skipped}`)
    
  } catch (error) {
    console.error('❌ Помилка при імпорті:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importServices()

