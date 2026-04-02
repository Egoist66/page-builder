export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  event.context.user = user
})
