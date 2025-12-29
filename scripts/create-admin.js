const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@example.com'
    const password = 'admin123'
    const name = 'Admin User'

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('Admin already exists:', email)
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

    console.log('✅ Admin created successfully!')
    console.log('Email:', admin.email)
    console.log('Password:', password)
    console.log('Role:', admin.role)
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

