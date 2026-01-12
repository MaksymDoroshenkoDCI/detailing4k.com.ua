const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createMainAdmin() {
    try {
        const email = 'mdoroshenko1@gmail.com'
        const password = 'admin123'
        const name = 'Maxim Doroshenko'

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Check if admin already exists
        const existing = await prisma.admin.findUnique({
            where: { email },
        })

        if (existing) {
            console.log('Admin already exists, updating password and role...')
            await prisma.admin.update({
                where: { email },
                data: {
                    passwordHash,
                    role: 'SuperAdmin',
                    name, // Ensure name is set
                },
            })
            console.log('✅ Admin updated successfully!')
        } else {
            console.log('Creating new admin...')
            // Create admin
            await prisma.admin.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: 'SuperAdmin',
                },
            })
            console.log('✅ Admin created successfully!')
        }

        console.log('Email:', email)
        console.log('Password:', password)
    } catch (error) {
        console.error('Error processing admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createMainAdmin()
