# Полное руководство по работе с Prisma

## Содержание

1. [Что такое Prisma](#что-такое-prisma)
2. [Структура проекта](#структура-проекта)
3. [Настройка подключения к БД](#настройка-подключения-к-бд)
4. [Схема Prisma](#схема-prisma)
5. [Команды Prisma](#команды-prisma)
6. [Prisma Studio](#prisma-studio)
7. [Работа с данными в коде](#работа-с-данными-в-коде)
8. [Миграции](#миграции)
9. [Частые ошибки и решения](#частые-ошибки-и-решения)

---

## Что такое Prisma

Prisma — это современный ORM (Object-Relational Mapping) для Node.js и TypeScript. Он позволяет:

- Описывать структуру БД в читаемом формате (schema.prisma)
- Автоматически генерировать типизированный клиент для работы с данными
- Управлять миграциями базы данных
- Визуально просматривать и редактировать данные через Prisma Studio

---

## Структура проекта

```
page-builder/
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   ├── migrations/            # Папка с миграциями
│   └── generated/             # Сгенерированный Prisma Client
├── server/
│   └── utils/
│       └── prisma.ts          # Инициализация клиента
├── prisma.config.ts           # Конфигурация Prisma
└── .env                       # Переменные окружения (DATABASE_URL)
```

---

## Настройка подключения к БД

### 1. Файл `.env`

Здесь хранится строка подключения к базе данных:

```env
# MySQL
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Примеры:
DATABASE_URL="mysql://root:password@localhost:3306/page_builder"
DATABASE_URL="mysql://admin:secret123@127.0.0.1:3306/myapp"
```

**Формат строки подключения MySQL:**

```
mysql://[пользователь]:[пароль]@[хост]:[порт]/[имя_базы]
```

| Параметр   | Описание                          | Пример         |
|------------|-----------------------------------|----------------|
| USER       | Имя пользователя MySQL            | root, admin    |
| PASSWORD   | Пароль пользователя               | password123    |
| HOST       | Адрес сервера                     | localhost      |
| PORT       | Порт MySQL (по умолчанию 3306)    | 3306           |
| DATABASE   | Имя базы данных                   | page_builder   |

### 2. Создание базы данных

Подключись к MySQL и создай базу:

```sql
CREATE DATABASE page_builder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Схема Prisma

Файл `prisma/schema.prisma` — сердце Prisma. Здесь описывается структура БД.

### Структура файла

```prisma
// Генератор клиента
generator client {
  provider = "prisma-client"
  output   = "./generated"
}

// Подключение к БД
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Модели (таблицы)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique @db.VarChar(255)
  name      String?  @db.VarChar(255)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Основные типы данных

| Prisma тип | MySQL тип        | Описание                    |
|------------|------------------|-----------------------------|
| String     | VARCHAR/TEXT     | Строка                      |
| Int        | INT              | Целое число                 |
| BigInt     | BIGINT           | Большое целое число         |
| Float      | DOUBLE           | Число с плавающей точкой    |
| Boolean    | TINYINT(1)       | true/false                  |
| DateTime   | DATETIME         | Дата и время                |
| Json       | JSON             | JSON данные                 |

### Атрибуты полей

| Атрибут              | Описание                                    |
|----------------------|---------------------------------------------|
| @id                  | Первичный ключ                              |
| @unique              | Уникальное значение                         |
| @default(value)      | Значение по умолчанию                       |
| @default(autoincrement()) | Автоинкремент                          |
| @default(now())      | Текущая дата/время                          |
| @updatedAt           | Автоматическое обновление при изменении     |
| @db.VarChar(255)     | Указать конкретный тип MySQL                |
| @db.Text             | Длинный текст                               |
| ?                    | Nullable поле (может быть null)             |

### Связи между таблицами

```prisma
// Один ко многим (User имеет много Post)
model User {
  id    Int    @id @default(autoincrement())
  posts Post[] // Массив постов
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int  // Внешний ключ
}

// Многие ко многим
model Post {
  id       Int        @id @default(autoincrement())
  tags     Tag[]      // Массив тегов
}

model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[] // Массив постов
}
```

---

## Команды Prisma

В `package.json` уже настроены удобные скрипты:

| Команда              | Описание                                         |
|----------------------|--------------------------------------------------|
| `pnpm db:generate`   | Генерирует Prisma Client по схеме                |
| `pnpm db:push`       | Применяет схему к БД без создания миграции       |
| `pnpm db:migrate`    | Создаёт и применяет миграцию                     |
| `pnpm db:migrate:prod` | Применяет миграции в production                |
| `pnpm db:studio`     | Открывает Prisma Studio                          |
| `pnpm db:seed`       | Заполняет БД тестовыми данными                   |
| `pnpm db:reset`      | Сбрасывает БД и применяет миграции заново        |

### Когда какую команду использовать

**Разработка (быстрые изменения):**

```bash
pnpm db:push      # Быстро применить изменения схемы
pnpm db:generate  # Обновить клиент
```

**Разработка (с историей изменений):**

```bash
pnpm db:migrate   # Создать миграцию и применить
```

**Production:**

```bash
pnpm db:migrate:prod  # Применить существующие миграции
```

---

## Prisma Studio

Prisma Studio — это визуальный редактор базы данных прямо в браузере.

### Запуск

```bash
pnpm db:studio
```

Откроется браузер на `http://localhost:5555`

### Возможности Prisma Studio

1. **Просмотр данных** — видишь все записи в таблицах
2. **Фильтрация** — поиск по любым полям
3. **Создание записей** — кнопка "Add record"
4. **Редактирование** — клик по ячейке для изменения
5. **Удаление** — выбрать записи и удалить
6. **Связи** — просмотр связанных данных

### Интерфейс

```
┌─────────────────────────────────────────────────────┐
│  Prisma Studio                                      │
├─────────────┬───────────────────────────────────────┤
│             │                                       │
│  Models     │  User                                 │
│  ─────────  │  ┌────┬──────────────┬─────────────┐ │
│  > User     │  │ id │ email        │ name        │ │
│  > Post     │  ├────┼──────────────┼─────────────┤ │
│             │  │ 1  │ john@ex.com  │ John        │ │
│             │  │ 2  │ jane@ex.com  │ Jane        │ │
│             │  └────┴──────────────┴─────────────┘ │
│             │                                       │
│             │  [+ Add record]  [Filter]  [Sort]    │
└─────────────┴───────────────────────────────────────┘
```

### Советы по работе

- **Ctrl+Click** — открыть связанную запись
- **Сортировка** — клик по заголовку столбца
- **Фильтр** — кнопка Filter, выбрать поле и условие
- **Сохранение** — изменения сохраняются автоматически

---

## Работа с данными в коде

### Инициализация клиента

Файл `server/utils/prisma.ts` уже настроен:

```typescript
import { PrismaClient } from '~~/prisma/generated/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Использование в API routes

```typescript
// server/api/users/index.get.ts
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()
  return users
})
```

### CRUD операции

#### Create (Создание)

```typescript
// Создать одного пользователя
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe'
  }
})

// Создать с вложенными данными
const userWithPosts = await prisma.user.create({
  data: {
    email: 'jane@example.com',
    name: 'Jane',
    posts: {
      create: [
        { title: 'Первый пост', content: 'Привет мир!' },
        { title: 'Второй пост', content: 'Ещё контент' }
      ]
    }
  }
})

// Создать много записей
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@ex.com', name: 'User 1' },
    { email: 'user2@ex.com', name: 'User 2' }
  ]
})
```

#### Read (Чтение)

```typescript
// Получить все записи
const users = await prisma.user.findMany()

// Получить по ID
const user = await prisma.user.findUnique({
  where: { id: 1 }
})

// Получить по уникальному полю
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
})

// Получить первую запись по условию
const user = await prisma.user.findFirst({
  where: { name: 'John' }
})

// С фильтрацией
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@gmail.com' },
    name: { not: null }
  }
})

// С сортировкой
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' }
})

// С пагинацией
const users = await prisma.user.findMany({
  skip: 10,  // Пропустить первые 10
  take: 5    // Взять 5 записей
})

// С включением связей
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
})

// Выбрать определённые поля
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true
  }
})
```

#### Update (Обновление)

```typescript
// Обновить одну запись
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'New Name' }
})

// Обновить или создать (upsert)
const user = await prisma.user.upsert({
  where: { email: 'john@example.com' },
  update: { name: 'Updated John' },
  create: { email: 'john@example.com', name: 'John' }
})

// Обновить много записей
const result = await prisma.user.updateMany({
  where: { name: null },
  data: { name: 'Anonymous' }
})
```

#### Delete (Удаление)

```typescript
// Удалить одну запись
const user = await prisma.user.delete({
  where: { id: 1 }
})

// Удалить много записей
const result = await prisma.user.deleteMany({
  where: { email: { contains: '@temp.com' } }
})

// Удалить все записи
await prisma.user.deleteMany()
```

### Фильтры

```typescript
// Равно
where: { status: 'active' }

// Не равно
where: { status: { not: 'deleted' } }

// Содержит
where: { email: { contains: 'gmail' } }

// Начинается с
where: { name: { startsWith: 'John' } }

// Заканчивается на
where: { email: { endsWith: '.com' } }

// В списке
where: { status: { in: ['active', 'pending'] } }

// Не в списке
where: { status: { notIn: ['deleted', 'banned'] } }

// Больше / меньше
where: { age: { gt: 18 } }     // greater than
where: { age: { gte: 18 } }    // greater than or equal
where: { age: { lt: 65 } }     // less than
where: { age: { lte: 65 } }    // less than or equal

// AND / OR
where: {
  AND: [
    { status: 'active' },
    { age: { gte: 18 } }
  ]
}

where: {
  OR: [
    { email: { contains: 'gmail' } },
    { email: { contains: 'yahoo' } }
  ]
}
```

### Транзакции

```typescript
// Несколько операций в одной транзакции
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'new@ex.com' } }),
  prisma.post.create({ data: { title: 'Hello', authorId: 1 } })
])

// Интерактивная транзакция
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'john@ex.com' }
  })
  
  await tx.post.create({
    data: { title: 'Welcome', authorId: user.id }
  })
  
  return user
})
```

---

## Миграции

Миграции — это версионирование структуры БД.

### Создание миграции

```bash
pnpm db:migrate
```

Prisma спросит название миграции, например: `add_user_table`

### Что происходит

1. Prisma сравнивает схему с текущей БД
2. Создаёт SQL файл в `prisma/migrations/`
3. Применяет SQL к базе данных
4. Генерирует обновлённый клиент

### Структура миграций

```
prisma/migrations/
├── 20260328121645_init/
│   └── migration.sql
├── 20260328130000_add_posts/
│   └── migration.sql
└── migration_lock.toml
```

### Откат миграций

```bash
# Полный сброс (удаляет все данные!)
pnpm db:reset
```

### Применение в production

```bash
pnpm db:migrate:prod
```

Эта команда только применяет существующие миграции, не создаёт новые.

---

## Частые ошибки и решения

### 1. "Can't reach database server"

**Причина:** MySQL не запущен или неправильные данные подключения

**Решение:**

- Проверь что MySQL запущен
- Проверь данные в `.env`
- Проверь что база данных создана

### 2. "P1001: Can't reach database"

**Решение:**

```bash
# Проверь подключение
mysql -u root -p -h localhost
```

### 3. "Unknown database"

**Решение:** Создай базу данных:

```sql
CREATE DATABASE page_builder;
```

### 4. "Prisma Client is not generated"

**Решение:**

```bash
pnpm db:generate
```

### 5. "Migration failed"

**Решение:**

```bash
# Посмотри статус
npx prisma migrate status

# Сбрось и начни заново (только для dev!)
pnpm db:reset
```

### 6. Изменения схемы не применяются

**Решение:**

```bash
pnpm db:push      # Применить изменения
pnpm db:generate  # Обновить клиент
```

### 7. TypeScript не видит новые поля

**Решение:**

```bash
pnpm db:generate  # Перегенерировать клиент
```

Перезапусти VS Code / Cursor для обновления типов.

---

## Полезные ссылки

- [Документация Prisma](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Типы данных MySQL в Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#mysql)

---

## Быстрый старт (чеклист)

1. [ ] Установить MySQL и создать базу данных
2. [ ] Настроить `.env` с правильным `DATABASE_URL`
3. [ ] Описать модели в `prisma/schema.prisma`
4. [ ] Запустить `pnpm db:migrate` для создания таблиц
5. [ ] Запустить `pnpm db:generate` для генерации клиента
6. [ ] Использовать `prisma` в API routes
7. [ ] Открыть `pnpm db:studio` для просмотра данных
