import { defineStore } from 'pinia'
import type { Role } from '~~/prisma/generated/client'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: Role
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isEditor = computed(() => user.value?.role === 'EDITOR' || user.value?.role === 'ADMIN')

  async function fetchUser() {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    return data
  }

  async function register(email: string, password: string, name?: string) {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email, password, name },
    })
    user.value = data.user
    return data
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  function hasRole(roles: Role | Role[]) {
    if (!user.value) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.value.role)
  }

  function $reset() {
    user.value = null
    isLoading.value = false
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isEditor,
    fetchUser,
    login,
    register,
    logout,
    hasRole,
    $reset,
  }
})
