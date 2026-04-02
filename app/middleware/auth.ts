
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser, isLoading } = useAuth()

  if (!isAuthenticated.value && !isLoading.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
