/**
 * Додати або оновити адміністратора в БД.
 * Пароль не зберігайте в файлах — передавайте через змінні оточення.
 *
 * Приклад:
 *   ADMIN_EMAIL="user@example.com" ADMIN_PASSWORD="..." ADMIN_NAME="Ім'я Прізвище" node scripts/add-admin-user.js
 *
 * Роль за замовчуванням: Editor (для повних прав встановіть ADMIN_ROLE=SuperAdmin)
 */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const email = process.env.ADMIN_EMAIL?.trim()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim()
const role = (process.env.ADMIN_ROLE || 'Editor').trim()

if (!email || !password || !name) {
  console.error('❌ Потрібні змінні: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME')
  console.error('   Опційно: ADMIN_ROLE (Editor | SuperAdmin), за замовчуванням Editor')
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash(password, 10)

  const existing = await prisma.admin.findUnique({ where: { email } })

  if (existing) {
    await prisma.admin.update({
      where: { email },
      data: { passwordHash, name, role },
    })
    console.log('✅ Адміністратор оновлено:', email)
  } else {
    await prisma.admin.create({
      data: { name, email, passwordHash, role },
    })
    console.log('✅ Адміністратор створено:', email)
  }
  console.log('   Ім’я:', name)
  console.log('   Роль:', role)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
