const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPassword() {
  try {
    const email = process.argv[2] || 'mdoroshenko1@gmail.com'
    const newPassword = process.argv[3] || 'admin123'

    // Hash password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update admin password
    const admin = await prisma.admin.update({
      where: { email },
      data: { passwordHash },
    })

    console.log('✅ Password reset successfully!')
    console.log('Email:', admin.email)
    console.log('New Password:', newPassword)
    console.log('Role:', admin.role)
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Admin not found with email:', process.argv[2] || email)
    } else {
      console.error('Error resetting password:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()

