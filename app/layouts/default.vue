<script lang="ts" setup>

const { user, logout, isAdmin, isEditor } = useAuth()
const colorMode = useColorMode()
const route = useRoute()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const navigation = computed(() => [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: 'Страницы',
    icon: 'i-lucide-file-text',
    to: '/pages',
  },
  {
    label: 'Медиа',
    icon: 'i-lucide-image',
    to: '/media',
  },
  ...(isEditor.value ? [{
    label: 'Записи',
    icon: 'i-lucide-pen-square',
    to: '/posts',
  }] : []),
  ...(isAdmin.value ? [{
    label: 'Пользователи',
    icon: 'i-lucide-users',
    to: '/users',
  }] : []),
  ...(isAdmin.value ? [{
    label: 'Настройки',
    icon: 'i-lucide-settings',
    to: '/settings',
  }] : []),
])

const userMenuItems = [
  [{
    label: 'Профиль',
    icon: 'i-lucide-user',
    to: '/profile',
  }, {
    label: 'Настройки',
    icon: 'i-lucide-settings',
    to: '/settings',
  }],
  [{
    label: 'Выйти',
    icon: 'i-lucide-log-out',
    onSelect: () => logout(),
  }],
]

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function isActiveRoute(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  isMobileSidebarOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Mobile sidebar backdrop -->
    <Transition name="fade">
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
        @click="isMobileSidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        isSidebarCollapsed ? 'w-[72px]' : 'w-64',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <UIcon name="i-lucide-blocks" class="text-white text-lg" />
          </div>
          <span
            v-if="!isSidebarCollapsed"
            class="font-bold text-lg text-gray-900 dark:text-white"
          >
            PageBuilder
          </span>
        </NuxtLink>
        <UButton
          v-if="!isSidebarCollapsed"
          icon="i-lucide-panel-left-close"
          variant="ghost"
          color="neutral"
          size="sm"
          class="hidden lg:flex"
          @click="toggleSidebar"
        />
      </div>

      <!-- Navigation -->
      <nav class="p-3 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            isActiveRoute(item.to)
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            isSidebarCollapsed && 'justify-center'
          ]"
        >
          <UIcon :name="item.icon" class="text-xl flex-shrink-0" />
          <span v-if="!isSidebarCollapsed" class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800">
        <UButton
          v-if="isSidebarCollapsed"
          icon="i-lucide-panel-left-open"
          variant="ghost"
          color="neutral"
          size="sm"
          block
          @click="toggleSidebar"
        />
        <div v-else class="flex items-center gap-3">
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
          />
          <span class="text-xs text-gray-500">v1.0.0</span>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div
      :class="[
        'transition-all duration-300',
        isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
      ]"
    >
      <!-- Header -->
      <header class="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div class="h-full px-4 lg:px-6 flex items-center justify-between">
          <!-- Left side -->
          <div class="flex items-center gap-4">
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              color="neutral"
              size="sm"
              class="lg:hidden"
              @click="isMobileSidebarOpen = true"
            />

            <!-- Breadcrumb placeholder -->
            <div class="hidden sm:flex items-center gap-2 text-sm">
              <NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Главная
              </NuxtLink>
              <UIcon name="i-lucide-chevron-right" class="text-gray-400 text-xs" />
              <span class="text-gray-900 dark:text-white font-medium">Дашборд</span>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-2">
            <!-- Search -->
            <UButton
              icon="i-lucide-search"
              variant="ghost"
              color="neutral"
              size="sm"
              class="hidden sm:flex"
            />

            <!-- Notifications -->
            <UButton
              icon="i-lucide-bell"
              variant="ghost"
              color="neutral"
              size="sm"
            />

            <!-- User menu -->
            <UDropdownMenu :items="userMenuItems">
              <UButton variant="ghost" color="neutral" class="gap-2 pl-2">
                <UAvatar
                  :alt="user?.name || user?.email || ''"
                  size="sm"
                />
                <span class="hidden md:block text-sm font-medium">
                  {{ user?.name || user?.email }}
                </span>
                <UIcon name="i-lucide-chevron-down" class="text-xs text-gray-500" />
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
