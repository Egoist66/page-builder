import { z } from 'zod'

const schema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  name: z.string().min(2, 'Минимум 2 символа').optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = schema.safeParse(body)
  if (!result.success) {
    const firstError = result.error.issues?.[0]?.message || 'Ошибка валидации'
    throw createError({
      statusCode: 400,
      message: firstError,
    })
  }

  const { email, password, name } = result.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 400, message: 'Пользователь уже существует' })
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'GUEST',
    },
    select: { id: true, email: true, name: true, role: true },
  })

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  setAuthCookie(event, token)

  return { user }
})
