import { useAuthStore } from "~/stores/auth"

export function useAuth() {
  const store = useAuthStore()

  return {
    user: computed(() => store.user),
    isLoading: computed(() => store.isLoading),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    isEditor: computed(() => store.isEditor),
    fetchUser: store.fetchUser,
    login: store.login,
    register: store.register,
    logout: store.logout,
    hasRole: store.hasRole,
  }
}
