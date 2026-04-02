export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()

  if (import.meta.client) {
    await fetchUser()
  }
})
