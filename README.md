# Page Builder

Page Builder is a simple page builder for Nuxt.js applications.

## Структура базы данных

```
User
├── id         Int       (auto-increment)
├── email      String    (unique)
├── name       String?
├── posts      Post[]
├── createdAt  DateTime
└── updatedAt  DateTime

Post
├── id         Int       (auto-increment)
├── title      String
├── content    String?
├── published  Boolean   (default: false)
├── author     User      (relation)
├── authorId   Int
├── createdAt  DateTime
└── updatedAt  DateTime
```

## Требования

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Порядок запуска приложения

### 1. Клонирование и установка зависимостей

```bash
# Клонировать репозиторий (если ещё не сделано)
git clone <repository-url>
cd page-builder

# Установить зависимости
pnpm install
```

### 2. Настройка переменных окружения

```bash
# Скопировать пример конфигурации
cp .env.example .env
```

Отредактируй `.env` при необходимости:

```env
DATABASE_HOST="localhost"
DATABASE_PORT=3306
DATABASE_USER="root"
DATABASE_PASSWORD="root"
DATABASE_NAME="page_builder"
DATABASE_URL="mysql://root:root@localhost:3306/page_builder"
```

### 3. Запуск Docker Desktop

Убедись, что Docker Desktop запущен и работает:
- Windows: найди иконку Docker в системном трее (должна быть зелёной)
- Или открой Docker Desktop вручную

### 4. Запуск базы данных MySQL

```bash
pnpm db:start
```

Дождись запуска контейнера. Проверить статус:

```bash
docker ps
```

Должен отображаться контейнер `page-builder-mysql` со статусом `Up`.

### 5. Генерация Prisma Client

```bash
pnpm db:generate
```

Эта команда создаёт TypeScript-клиент для работы с базой данных.

### 6. Применение схемы базы данных

**Для разработки** (синхронизация схемы без миграций):

```bash
pnpm db:push
```

**Для production** (с миграциями):

```bash
pnpm db:migrate
```

### 7. (Опционально) Заполнение тестовыми данными

```bash
pnpm db:seed
```

Создаст тестовых пользователей и посты для разработки.

### 8. Запуск приложения

```bash
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:3000

---

## Команды для работы с базой данных

| Команда | Описание |
|---------|----------|
| `pnpm db:start` | Запустить MySQL контейнер |
| `pnpm db:stop` | Остановить MySQL контейнер |
| `pnpm db:generate` | Сгенерировать Prisma Client |
| `pnpm db:push` | Применить схему к БД (dev) |
| `pnpm db:migrate` | Создать и применить миграцию |
| `pnpm db:migrate:prod` | Применить миграции (prod) |
| `pnpm db:studio` | Открыть Prisma Studio (GUI для БД) |
| `pnpm db:seed` | Заполнить БД тестовыми данными |
| `pnpm db:reset` | Сбросить БД и применить миграции заново |

## Работа с данными

### Заполнение тестовыми данными (seeding)

```bash
pnpm db:seed
```

Seed-файл находится в `prisma/seed.ts`. Он создаёт тестовых пользователей и посты.

### Prisma Studio (GUI)

```bash
pnpm db:studio
```

Откроется веб-интерфейс на http://localhost:5555 для просмотра и редактирования данных.

### Программное создание данных

Используй готовую утилиту `server/utils/prisma.ts` в API routes:

```typescript
// server/api/example.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // prisma доступна глобально через auto-import Nuxt
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  })

  return user
})
```

### Примеры Prisma-запросов

```typescript
// Создать пользователя с постами
const user = await prisma.user.create({
  data: {
    email: 'new@user.com',
    name: 'New User',
    posts: {
      create: [
        { title: 'Пост 1', content: 'Контент 1' },
        { title: 'Пост 2', content: 'Контент 2', published: true },
      ],
    },
  },
})

// Получить всех пользователей с постами
const users = await prisma.user.findMany({
  include: { posts: true },
})

// Найти пользователя по email
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' },
})

// Получить опубликованные посты
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
})

// Обновить пост
const updated = await prisma.post.update({
  where: { id: 1 },
  data: { published: true },
})

// Удалить пользователя (каскадно удалит посты)
await prisma.user.delete({
  where: { id: 1 },
})
```

> **Примечание:** В `server/` директории `prisma` доступна через Nuxt auto-import из `server/utils/prisma.ts`. Не нужно создавать `new PrismaClient()` вручную.

---

## Остановка приложения

1. Остановить dev-сервер: `Ctrl+C`
2. Остановить базу данных:

```bash
pnpm db:stop
```

## Полный перезапуск с нуля

```bash
# Остановить всё
pnpm db:stop

# Удалить Docker volume с данными (ВНИМАНИЕ: удалит все данные!)
docker volume rm page-builder_mysql_data

# Запустить заново
pnpm db:start
pnpm db:generate
pnpm db:push
pnpm db:seed      # опционально
pnpm dev
```

## Устранение проблем

### Docker не запускается
- Убедись, что Docker Desktop установлен и запущен
- Перезапусти Docker Desktop

### Ошибка подключения к БД
- Проверь, что контейнер запущен: `docker ps`
- Проверь логи: `docker logs page-builder-mysql`
- Убедись, что порт 3306 не занят другим процессом

### Prisma не видит изменения схемы
```bash
pnpm db:generate
pnpm db:push
```
