const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Використовує локальну БД з .env
const prisma = new PrismaClient()

async function exportServices() {
  try {
    console.log('📤 Експорт послуг з локальної БД...')
    
    // Експортуємо категорії
    const categories = await prisma.serviceCategory.findMany()
    console.log(`Знайдено ${categories.length} категорій`)
    
    // Експортуємо послуги
    const services = await prisma.service.findMany({
      include: {
        category: true,
      },
    })
    console.log(`Знайдено ${services.length} послуг`)
    
    // Створюємо об'єкт для експорту
    const exportData = {
      categories: categories.map(cat => ({
        categoryId: cat.categoryId,
        name: cat.name,
        description: cat.description,
      })),
      services: services.map(service => ({
        serviceId: service.serviceId,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        durationMinutes: service.durationMinutes,
        categoryId: service.categoryId,
        imageUrl: service.imageUrl,
      })),
    }
    
    // Зберігаємо в JSON файл
    const exportPath = path.join(__dirname, 'services-export.json')
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))
    
    console.log(`✅ Дані експортовано в: ${exportPath}`)
    console.log(`   Категорії: ${exportData.categories.length}`)
    console.log(`   Послуги: ${exportData.services.length}`)
    
  } catch (error) {
    console.error('❌ Помилка при експорті:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportServices()

