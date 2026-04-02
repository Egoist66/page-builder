import { z } from 'zod'

const schema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
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

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  setAuthCookie(event, token)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
})
