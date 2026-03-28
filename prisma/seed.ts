import { PrismaClient } from './generated/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'page_builder',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Создание пользователей
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: [
          {
            title: 'Первый пост Alice',
            content: 'Это контент первого поста от Alice.',
            published: true,
          },
          {
            title: 'Черновик Alice',
            content: 'Этот пост ещё не опубликован.',
            published: false,
          },
        ],
      },
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Пост от Bob',
            content: 'Bob тоже умеет писать посты!',
            published: true,
          },
        ],
      },
    },
  })

  console.log('✅ Created users:', { user1, user2 })

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
