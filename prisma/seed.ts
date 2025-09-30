import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@evolutiondash.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'

  // Verifica se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('✅ Usuário admin já existe')
    return
  }

  // Cria o hash da senha
  const passwordHash = await bcrypt.hash(password, 10)

  // Cria o usuário
  await prisma.user.create({
    data: {
      email,
      name: 'Administrator',
      passwordHash,
    },
  })

  console.log('✅ Usuário admin criado com sucesso!')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Senha: ${password}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
