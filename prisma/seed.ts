import { PrismaClient } from './generated/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { webcrypto } from 'crypto'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'page_builder',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await webcrypto.subtle.digest('SHA-256', data)
  const salt = webcrypto.randomUUID()
  const saltedData = new Uint8Array([...encoder.encode(salt), ...new Uint8Array(hashBuffer)])
  const finalHash = await webcrypto.subtle.digest('SHA-256', saltedData)
  return salt + ':' + Array.from(new Uint8Array(finalHash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await hashPassword('admin123')
  const editorPassword = await hashPassword('editor123')
  const guestPassword = await hashPassword('guest123')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      password: editorPassword,
      name: 'Редактор',
      role: 'EDITOR',
      posts: {
        create: [
          {
            title: 'Первый пост редактора',
            content: 'Это контент первого поста от редактора.',
            published: true,
          },
        ],
      },
    },
  })

  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      password: guestPassword,
      name: 'Гость',
      role: 'GUEST',
    },
  })

  console.log('✅ Created users:', { admin: admin.email, editor: editor.email, guest: guest.email })

  // Подсчёт записей
  const userCount = await prisma.user.count()
  const postCount = await prisma.post.count()

  console.log(`📊 Database now has ${userCount} users and ${postCount} posts`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
