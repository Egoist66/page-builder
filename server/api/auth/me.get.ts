export default defineEventHandler(async (event) => {
  const payload = await getUserFromEvent(event)

  if (!payload) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  })

  if (!user) {
    clearAuthCookie(event)
    throw createError({ statusCode: 401, message: 'Пользователь не найден' })
  }

  return { user }
})
