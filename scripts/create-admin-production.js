const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Використовуємо DATABASE_URL з environment або передаємо як аргумент
const databaseUrl = process.env.DATABASE_URL || process.argv[2]

if (!databaseUrl) {
  console.error('❌ Помилка: DATABASE_URL не вказано!')
  console.log('\nВикористання:')
  console.log('  DATABASE_URL="your-url" node scripts/create-admin-production.js')
  console.log('або')
  console.log('  node scripts/create-admin-production.js "your-database-url"')
  process.exit(1)
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function createAdmin() {
  try {
    const email = process.argv[3] || 'admin@example.com'
    const password = process.argv[4] || 'admin123'
    const name = process.argv[5] || 'Admin User'

    console.log('🔐 Створення адміністратора...')
    console.log('Email:', email)
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('⚠️  Адміністратор вже існує:', email)
      console.log('Використовуйте scripts/reset-admin-password.js для зміни пароля')
      return
    }

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'SuperAdmin',
      },
    })

    console.log('\n✅ Адміністратор успішно створено!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password:', password)
    console.log('👤 Role:', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Тепер ви можете увійти на /admin з цими credentials')
  } catch (error) {
    console.error('❌ Помилка при створенні адміністратора:', error.message)
    if (error.code === 'P1001') {
      console.error('\n💡 Перевірте, що:')
      console.error('   1. DATABASE_URL правильний')
      console.error('   2. База даних доступна з інтернету')
      console.error('   3. Міграції застосовані (npx prisma migrate deploy)')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

