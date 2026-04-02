import { useAuth } from "~~/composables/useAuth"

export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser, isLoading } = useAuth()

  if (isLoading.value || !isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
